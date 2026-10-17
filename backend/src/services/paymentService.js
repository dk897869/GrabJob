const crypto = require('crypto');
const Razorpay = require('razorpay');
const env = require('../config/env');
const Payment = require('../models/Payment');
const AuditLog = require('../models/AuditLog');

let razorpayInstance = null;
if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

/**
 * Create order for Razorpay or safe simulation
 */
const createPaymentOrder = async ({ userId, serviceType, jobId = null, amount }) => {
  const currency = 'INR';
  const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  let orderId = '';
  let gateway = 'razorpay';

  if (razorpayInstance) {
    try {
      const options = {
        amount: Math.round(amount * 100), // amount in paise
        currency,
        receipt,
        notes: {
          userId: userId.toString(),
          serviceType,
          jobId: jobId ? jobId.toString() : '',
        },
      };

      const order = await razorpayInstance.orders.create(options);
      orderId = order.id;
    } catch (error) {
      console.error('[Razorpay Order Error]:', error);
      throw new Error(`Payment Gateway Error: ${error.message}`);
    }
  } else {
    // Safe simulation mode for development/demo when Razorpay keys are not configured
    orderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    gateway = 'demo_simulation';
  }

  const paymentRecord = await Payment.create({
    user: userId,
    serviceType,
    job: jobId,
    amount,
    currency,
    gateway,
    orderId,
    status: 'PENDING',
  });

  return {
    success: true,
    paymentRecord,
    orderId,
    amount,
    currency,
    keyId: env.RAZORPAY_KEY_ID || 'rzp_test_simulation',
    isSimulation: !razorpayInstance,
  };
};

/**
 * Verify payment signature
 */
const verifyPaymentSignature = async ({ orderId, paymentId, signature, utr = null }) => {
  const payment = await Payment.findOne({ orderId });
  if (!payment) {
    throw new Error('Payment record not found for the given order ID.');
  }

  if (payment.gateway === 'demo_simulation') {
    // Demo simulation verification
    payment.paymentId = paymentId || `pay_sim_${Date.now()}`;
    payment.signature = signature || 'sig_demo_simulation_verified';
    payment.status = 'PAID';
    if (utr) payment.utr = utr;
    await payment.save();
    return { success: true, verified: true, payment };
  }

  // Real Razorpay HMAC signature check
  const text = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');

  const isValid = generatedSignature === signature;

  if (isValid) {
    payment.paymentId = paymentId;
    payment.signature = signature;
    payment.status = 'PAID';
    if (utr) payment.utr = utr;
    await payment.save();
    return { success: true, verified: true, payment };
  } else {
    payment.status = 'FAILED';
    await payment.save();
    return { success: false, verified: false, message: 'Invalid payment signature' };
  }
};

/**
 * Process manual UTR verification by admin
 */
const verifyManualUtr = async ({ paymentId, adminUser, approved = true, adminNotes = '' }) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new Error('Payment not found');
  }

  const prevStatus = payment.status;
  payment.status = approved ? 'VERIFIED' : 'REJECTED';
  payment.adminNotes = adminNotes;
  payment.verifiedBy = adminUser._id;
  payment.verifiedAt = new Date();
  await payment.save();

  // Create audit log
  await AuditLog.create({
    admin: adminUser._id,
    adminEmail: adminUser.email,
    action: approved ? 'PAYMENT_VERIFIED_MANUAL' : 'PAYMENT_REJECTED_MANUAL',
    targetModel: 'Payment',
    targetId: payment._id.toString(),
    details: {
      orderId: payment.orderId,
      utr: payment.utr,
      amount: payment.amount,
      prevStatus,
      newStatus: payment.status,
      adminNotes,
    },
  });

  return payment;
};

module.exports = {
  createPaymentOrder,
  verifyPaymentSignature,
  verifyManualUtr,
};
