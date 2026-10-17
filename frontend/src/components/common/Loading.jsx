import React from 'react';

export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
      <div style={{
        width: '36px',
        height: '36px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{message}</p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function SkeletonJobCard() {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      animation: 'pulse 1.5s infinite'
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ width: '44px', height: '44px', background: '#f1f5f9', borderRadius: '8px' }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: '18px', width: '60%', background: '#f1f5f9', borderRadius: '4px', marginBottom: '6px' }} />
          <div style={{ height: '14px', width: '40%', background: '#f1f5f9', borderRadius: '4px' }} />
        </div>
      </div>
      <div style={{ height: '14px', width: '80%', background: '#f1f5f9', borderRadius: '4px' }} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ height: '24px', width: '60px', background: '#f1f5f9', borderRadius: '4px' }} />
        <div style={{ height: '24px', width: '60px', background: '#f1f5f9', borderRadius: '4px' }} />
        <div style={{ height: '24px', width: '60px', background: '#f1f5f9', borderRadius: '4px' }} />
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}

export function EmptyState({ title = 'No opportunities found', description = 'Try adjusting your search query, location, or filters.', onReset }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '400px', margin: '0 auto 20px' }}>{description}</p>
      {onReset && (
        <button onClick={onReset} className="btn btn-outline btn-sm">
          Reset Filters
        </button>
      )}
    </div>
  );
}

export default LoadingSpinner;
