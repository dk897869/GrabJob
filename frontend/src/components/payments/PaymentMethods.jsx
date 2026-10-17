import React from 'react';
import { Smartphone, CreditCard, Landmark, Check } from 'lucide-react';

export default function PaymentMethods({ selectedMethod, onSelect }) {
  const methods = [
    { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm)', icon: Smartphone },
    { id: 'card', name: 'Credit / Debit Card (Visa, RuPay)', icon: CreditCard },
    { id: 'netbanking', name: 'Net Banking (All Indian Banks)', icon: Landmark },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
      <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#475569' }}>
        Select Payment Method:
      </label>
      {methods.map((m) => {
        const Icon = m.icon;
        const isSelected = selectedMethod === m.id;
        return (
          <div
            key={m.id}
            onClick={() => onSelect(m.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              border: `1.5px solid ${isSelected ? 'var(--primary)' : '#e2e8f0'}`,
              borderRadius: '8px',
              background: isSelected ? 'var(--primary-light)' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon size={18} color={isSelected ? 'var(--primary)' : '#64748b'} />
              <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#0f172a' }}>
                {m.name}
              </span>
            </div>
            {isSelected && <Check size={16} color="var(--primary)" />}
          </div>
        );
      })}
    </div>
  );
}
