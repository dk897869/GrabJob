import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { LoadingSpinner } from '../components/common/Loading';
import PaymentStatusBadge from '../components/payments/PaymentStatus';
import { formatDate } from '../utils/formatters';

export default function PaymentResult() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentService.getPaymentById(id),
  });

  const payment = data?.data;

  if (isLoading) return <LoadingSpinner message="Retrieving transaction status..." />;

  if (error || !payment) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Transaction Record Not Found</h2>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isSuccess = ['PAID', 'VERIFIED'].includes(payment.status);

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '50px 0' }}>
      <div
        className="container"
        style={{
          maxWidth: '560px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '36px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: isSuccess ? '#dcfce7' : '#fee2e2',
            color: isSuccess ? '#16a34a' : '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          {isSuccess ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '4px' }}>
          {isSuccess ? 'Payment Received!' : 'Payment Pending'}
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px' }}>
          {isSuccess
            ? 'Your request has been registered and is being processed by our coordination team.'
            : 'Your payment is being confirmed with the payment gateway.'}
        </p>

        {/* Receipt Box */}
        <div
          style={{
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '0.88rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Order ID:</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{payment.orderId}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Service:</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>
              {payment.serviceType === 'interview_assistance'
                ? 'Interview Assistance'
                : 'ATS Resume Builder'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Amount Paid:</span>
            <span style={{ fontWeight: 800, color: '#16a34a' }}>₹{payment.amount}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b' }}>Status:</span>
            <PaymentStatusBadge status={payment.status} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Date & Time:</span>
            <span>{formatDate(payment.createdAt)}</span>
          </div>
        </div>

        {/* Next Steps Info */}
        <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', fontSize: '0.84rem', color: '#1e40af', marginBottom: '24px', textAlign: 'left' }}>
          <p><strong>Next Steps:</strong></p>
          <p style={{ marginTop: '4px' }}>
            {payment.serviceType === 'interview_assistance'
              ? 'Our coordinator is reaching out to the employer. You will receive an email confirmation once the slot is confirmed.'
              : 'Your optimized ATS resume is available to download and has been emailed.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/dashboard" className="btn btn-primary" style={{ flex: 1 }}>
            Candidate Dashboard
          </Link>
          <Link to="/jobs" className="btn btn-outline" style={{ flex: 1 }}>
            Browse More Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
