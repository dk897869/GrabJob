const Payment = require('../models/Payment');
const { createOrderSchema, verifyPaymentSchema } = require('../validators/paymentValidator');
const { createPaymentOrder, verifyPaymentSignature } = require('../services/paymentService');
const { sendPaymentConfirmation } = require('../services/emailService');

/**
 * Create order for Interview Assistance (₹100) or Resume Builder (₹50)
 */
const createOrder = async (req, res, next) => {
  try {
    const { serviceType, jobId } = createOrderSchema.parse(req.body);

    const amount = serviceType === 'interview_assistance' ? 100 : 50;

    const orderData = await createPaymentOrder({
      userId: req.user._id,
      serviceType,
      jobId,
      amount,
    });

    return res.status(201).json({
      success: true,
      data: orderData,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
      });
    }
    next(error);
  }
};

/**
 * Verify payment signature or simulate approval
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature, utr } = verifyPaymentSchema.parse(req.body);

    const result = await verifyPaymentSignature({
      orderId,
      paymentId,
      signature,
      utr,
    });

    if (result.success && result.payment) {
      // Send confirmation email
      sendPaymentConfirmation(req.user, result.payment).catch((err) =>
        console.error('[Payment Email Error]:', err.message)
      );

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully.',
        data: result.payment,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message || 'Payment verification failed',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment receipt / detail by ID
 */
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      ...(req.user.role !== 'admin' && { user: req.user._id }),
    }).populate('job', 'title company');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Razorpay webhook handler
 */
const handleWebhook = async (req, res) => {
  // Webhook event received
  console.log('[Payment Webhook Event Received]:', req.body?.event);
  return res.status(200).json({ received: true });
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentById,
  handleWebhook,
};
