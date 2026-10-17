import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, CheckCircle2, XCircle, Search, ShieldCheck } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/Loading';
import PaymentStatusBadge from '../../components/payments/PaymentStatus';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function AdminPayments() {
  const [statusFilter, setStatusFilter] = useState('All');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-payments', statusFilter],
    queryFn: () => adminService.getPayments({ status: statusFilter !== 'All' ? statusFilter : undefined }),
  });

  const payments = data?.data || [];

  const handleVerify = async (paymentId, approved) => {
    const action = approved ? 'verify' : 'reject';
    const notes = prompt(`Enter notes for ${action}:`, approved ? 'Verified by Admin' : 'Rejected');
    if (notes === null) return;

    try {
      await adminService.verifyPayment(paymentId, { approved, adminNotes: notes });
      toast.success(`Payment successfully marked as ${approved ? 'VERIFIED' : 'REJECTED'}`);
      refetch();
    } catch {
      toast.error('Failed to update payment status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>Payment Transactions & UTR</h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Verify Razorpay gateway orders, review UTR transfers, and issue manual clearances
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            background: '#1e293b',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '0.88rem',
          }}
        >
          <option value="All">All Statuses</option>
          <option value="PAID">PAID</option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="PENDING">PENDING</option>
          <option value="FAILED">FAILED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        {isLoading ? (
          <LoadingSpinner message="Loading payments..." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '12px 16px' }}>Candidate</th>
                <th style={{ padding: '12px 16px' }}>Service</th>
                <th style={{ padding: '12px 16px' }}>Amount</th>
                <th style={{ padding: '12px 16px' }}>Order / Pay ID</th>
                <th style={{ padding: '12px 16px' }}>Gateway</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid #334155', color: '#cbd5e1' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{p.user?.name || 'Candidate'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.user?.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {p.serviceType === 'interview_assistance' ? 'Interview Assistance' : 'ATS Resume Builder'}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#34d399' }}>₹{p.amount}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                    <div>{p.orderId}</div>
                    {p.paymentId && <div style={{ color: '#60a5fa' }}>{p.paymentId}</div>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{p.gateway}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <PaymentStatusBadge status={p.status} />
                  </td>
                  <td style={{ padding: '12px 16px' }}>{formatDate(p.createdAt)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleVerify(p._id, true)}
                        className="btn btn-sm"
                        style={{ background: '#065f46', color: '#ffffff', padding: '3px 8px', fontSize: '0.75rem' }}
                        title="Verify / Approve"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleVerify(p._id, false)}
                        className="btn btn-sm"
                        style={{ background: '#7f1d1d', color: '#ffffff', padding: '3px 8px', fontSize: '0.75rem' }}
                        title="Reject"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
