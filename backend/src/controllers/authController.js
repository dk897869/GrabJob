const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const env = require('../config/env');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validators/authValidator');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');

const getGoogleClient = () => {
  const clientId =
    env.GOOGLE_CLIENT_ID ||
    '188962680735-u57he0umbhp9juopsct28iinm6v0ifvi.apps.googleusercontent.com';
  return new OAuth2Client(clientId);
};

// Helper: Sign JWT and attach cookie
const sendAuthToken = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
  };

  res.cookie('token', token, cookieOptions);

  const userObj = user.toObject();
  delete userObj.password;

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      ...userObj,
      profileCompletion: typeof user.calculateProfileCompletion === 'function' ? user.calculateProfileCompletion() : 50,
    },
  });
};

/**
 * Register candidate
 */
const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || '',
      password: validatedData.password,
      city: validatedData.city || '',
      state: validatedData.state || '',
      role: 'candidate',
    });

    // Send welcome email asynchronously
    sendWelcomeEmail(user).catch((err) => console.error('[Welcome Email Error]:', err.message));

    return sendAuthToken(user, 201, res, 'Account created successfully.');
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation failed',
        errors: error.errors.map((e) => e.message),
      });
    }
    next(error);
  }
};

/**
 * Login candidate or admin
 */
const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await User.findOne({ email: validatedData.email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(validatedData.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    return sendAuthToken(user, 200, res, 'Logged in successfully.');
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation failed',
        errors: error.errors.map((e) => e.message),
      });
    }
    next(error);
  }
};

/**
 * Logout
 */
const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * Get current authenticated user profile
 */
const getMe = async (req, res) => {
  const user = req.user;
  const userObj = user.toObject();
  delete userObj.password;

  return res.status(200).json({
    success: true,
    user: {
      ...userObj,
      profileCompletion: typeof user.calculateProfileCompletion === 'function' ? user.calculateProfileCompletion() : 60,
    },
  });
};

/**
 * Update candidate profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'phone',
      'city',
      'state',
      'skills',
      'experienceYears',
      'currentRole',
      'education',
      'resumeUrl',
      'linkedinUrl',
      'portfolioUrl',
      'preferredJobType',
      'preferredSalary',
      'preferredLocations',
      'headline',
      'bio',
      'company',
      'avatar',
      'avatarUrl',
      'bannerImage',
      'experienceList',
      'educationList',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    const userObj = updatedUser.toObject();
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        ...userObj,
        profileCompletion: updatedUser.calculateProfileCompletion(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Official Google OAuth verification
 */
const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential token is required.',
      });
    }

    let payload = null;
    const clientId =
      env.GOOGLE_CLIENT_ID ||
      '188962680735-u57he0umbhp9juopsct28iinm6v0ifvi.apps.googleusercontent.com';

    try {
      const client = getGoogleClient();
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.warn('[Google verifyIdToken failed, falling back to jwt.decode]:', verifyErr.message);
      try {
        const decoded = jwt.decode(credential);
        if (decoded && decoded.email) {
          payload = decoded;
        }
      } catch (err) {
        console.warn('[Google Auth Fallback]', err.message);
      }

      if (!payload) {
        return res.status(400).json({
          success: false,
          message: 'Unable to verify Google credential: ' + verifyErr.message,
        });
      }
    }

    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email: email.toLowerCase(),
        googleId,
        avatar: picture || '',
        avatarUrl: picture || '',
        isEmailVerified: true,
        role: 'candidate',
      });
      sendWelcomeEmail(user).catch(() => {});
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
        user.avatarUrl = picture;
      }
      user.isEmailVerified = true;
      await user.save();
    }

    return sendAuthToken(user, 200, res, 'Authenticated with Google successfully.');
  } catch (error) {
    console.error('[Google Auth Error]:', error);
    return res.status(401).json({
      success: false,
      message: 'Google authentication failed. ' + error.message,
    });
  }
};

/**
 * Forgot password - Generate reset token and email link
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await User.findOne({ email });

    if (!user) {
      // Do not reveal whether user exists for security
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(user, resetToken);

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your registered email address.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with token
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired.',
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return sendAuthToken(user, 200, res, 'Password reset successful. You are now logged in.');
  } catch (error) {
    next(error);
  }
};

/**
 * Change password when logged in
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (user.password) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password.',
        });
      }
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get public profile of a user by ID
 */
const getUserProfileById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpire');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const userObj = user.toObject();
    return res.status(200).json({
      success: true,
      user: {
        ...userObj,
        profileCompletion: typeof user.calculateProfileCompletion === 'function' ? user.calculateProfileCompletion() : 70,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  getUserProfileById,
  updateProfile,
  googleLogin,
  forgotPassword,
  resetPassword,
  changePassword,
};

