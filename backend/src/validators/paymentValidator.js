const { z } = require('zod');

const createOrderSchema = z.object({
  serviceType: z.enum(['interview_assistance', 'resume_builder']),
  jobId: z.string().optional(),
});

const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  paymentId: z.string().min(1, 'Payment ID is required'),
  signature: z.string().optional(),
  utr: z.string().optional(),
});

const manualUtrSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  approved: z.boolean(),
  adminNotes: z.string().optional(),
});

module.exports = {
  createOrderSchema,
  verifyPaymentSchema,
  manualUtrSchema,
};
