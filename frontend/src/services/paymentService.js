import api from './api';

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const paymentService = {
  createOrder: async ({ serviceType, jobId }) => {
    const { data } = await api.post('/payments/create-order', { serviceType, jobId });
    return data;
  },

  verifyPayment: async ({ orderId, paymentId, signature, utr }) => {
    const { data } = await api.post('/payments/verify', {
      orderId,
      paymentId,
      signature,
      utr,
    });
    return data;
  },

  getPaymentById: async (id) => {
    const { data } = await api.get(`/payments/${id}`);
    return data;
  },
};
