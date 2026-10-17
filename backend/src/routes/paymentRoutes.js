const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getPaymentById,
  handleWebhook,
} = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/webhook', handleWebhook);

router.post('/create-order', requireAuth, createOrder);
router.post('/verify', requireAuth, verifyPayment);
router.get('/:id', requireAuth, getPaymentById);

module.exports = router;
