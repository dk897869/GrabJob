import React from 'react';
import { Bell, Calendar, CreditCard, FileText, CheckCircle2 } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      title: 'Welcome to GrabJob!',
      message: 'Explore verified job openings and walk-ins near your city.',
      time: 'Just now',
      type: 'system',
      read: true,
    },
    {
      id: 2,
      title: 'Walk-in Alert in Tricity',
      message: 'Teleperformance India is hosting a walk-in interview today from 10:00 AM in Mohali.',
      time: '2 hours ago',
      type: 'walkin',
      read: false,
    },
    {
      id: 3,
      title: 'Resume Builder Ready',
      message: 'Optimize your CV with AI keywords for just ₹50 to get shortlisted faster.',
      time: '1 day ago',
      type: 'resume',
      read: true,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>
          Notifications & Alerts
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Updates on your job applications, interview schedules, and local walk-ins
        </p>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              padding: '18px 24px',
              borderBottom: '1px solid #f1f5f9',
              background: n.read ? '#ffffff' : '#f8fafc',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: n.type === 'walkin' ? '#fee2e2' : '#eff6ff',
                color: n.type === 'walkin' ? '#dc2626' : '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {n.type === 'walkin' ? <Calendar size={18} /> : <Bell size={18} />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)' }}>
                  {n.title}
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{n.time}</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#475569', marginTop: '4px' }}>
                {n.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
