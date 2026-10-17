import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, IndianRupee, Lock } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import PaymentMethods from './PaymentMethods';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { paymentService, loadRazorpayScript } from '../../services/paymentService';
import toast from 'react-hot-toast';

export default function PaymentModal({ onSuccess }) {
  const navigate = useNavigate();
  const { paymentModal, closePaymentModal } = useUiStore();
  const { user, isAuthenticated } = useAuthStore();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  const { isOpen, serviceType, jobId, jobTitle, amount, resumeId } = paymentModal;

  const serviceTitle =
    serviceType === 'interview_assistance'
      ? 'Interview Assistance'
      : 'ATS Resume Builder';

  const handlePay = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in before completing payment.');
      closePaymentModal();
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      // 1. Create order on backend
      const orderRes = await paymentService.createOrder({
        serviceType,
        jobId,
      });

      if (!orderRes.success) {
        throw new Error(orderRes.message || 'Failed to initiate payment');
      }

      const { orderId, isSimulation, keyId } = orderRes.data;

      // 2. If simulation mode (keys not set in dev)
      if (isSimulation) {
        toast.loading('Processing payment securely...', { duration: 1200 });
        setTimeout(async () => {
          const verifyRes = await paymentService.verifyPayment({
            orderId,
            paymentId: `sim_pay_${Date.now()}`,
            signature: 'sig_simulated_success',
          });

          if (verifyRes.success) {
            toast.success(`Payment of ₹${amount} completed successfully!`);
            closePaymentModal();
            if (onSuccess) onSuccess(verifyRes.data);
            navigate(`/payment/${verifyRes.data._id}`);
          }
        }, 1200);
        return;
      }

      // 3. Live Razorpay Flow
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK could not be loaded. Please check your internet connection.');
      }

      const options = {
        key: keyId,
        amount: amount * 100,
        currency: 'INR',
        name: 'GrabJob India',
        description: serviceTitle,
        order_id: orderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#2563eb',
        },
        handler: async (response) => {
          try {
            const verifyRes = await paymentService.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              toast.success(`Payment of ₹${amount} received!`);
              closePaymentModal();
              if (onSuccess) onSuccess(verifyRes.data);
              navigate(`/payment/${verifyRes.data._id}`);
            }
          } catch (err) {
            toast.error('Payment verification failed: ' + err.message);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closePaymentModal} title="Complete your Payment">
      <div>
        {/* Service Card Highlight */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                background: 'rgba(255,255,255,0.15)',
                padding: '3px 8px',
                borderRadius: '9999px',
                display: 'inline-block',
                marginBottom: '6px',
              }}
            >
              Selected Service
            </span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{serviceTitle}</h4>
            {jobTitle && (
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                Job: {jobTitle}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60a5fa' }}>
              ₹{amount}
            </span>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Inclusive of GST</p>
          </div>
        </div>

        {/* Razorpay Trust Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: '#15803d',
            background: '#f0fdf4',
            padding: '6px',
            borderRadius: '6px',
            marginBottom: '12px',
          }}
        >
          <ShieldCheck size={16} />
          <span>Secured 256-bit encrypted checkout</span>
        </div>

        {/* Payment Methods */}
        <PaymentMethods selectedMethod={selectedMethod} onSelect={setSelectedMethod} />

        {/* Pay CTA */}
        <Button
          variant="primary"
          size="lg"
          className="btn-pay"
          style={{ width: '100%', marginTop: '10px' }}
          onClick={handlePay}
          loading={loading}
        >
          Pay ₹{amount}
        </Button>

        <p
          style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            textAlign: 'center',
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <Lock size={12} /> Your payment information is never stored on GrabJob servers.
        </p>
      </div>
    </Modal>
  );
}
