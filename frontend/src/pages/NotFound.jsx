import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '480px' }}>
        <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
          404
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', margin: '14px 0 8px' }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '24px' }}>
          The job, walk-in event, or career page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', gap: '8px' }}>
          <ArrowLeft size={18} /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}
