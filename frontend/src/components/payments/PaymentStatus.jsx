import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function PaymentStatusBadge({ status }) {
  let bg = '#f1f5f9';
  let color = '#475569';
  let Icon = Clock;

  switch (status) {
    case 'PAID':
    case 'VERIFIED':
      bg = '#dcfce7';
      color = '#15803d';
      Icon = CheckCircle2;
      break;
    case 'PENDING':
    case 'PROCESSING':
      bg = '#fef3c7';
      color = '#b45309';
      Icon = Clock;
      break;
    case 'FAILED':
    case 'REJECTED':
      bg = '#fee2e2';
      color = '#b91c1c';
      Icon = AlertCircle;
      break;
    default:
      break;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '0.78rem',
        fontWeight: 600,
        background: bg,
        color: color,
      }}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}
