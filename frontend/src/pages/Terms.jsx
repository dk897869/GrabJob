import React from 'react';

export default function Terms() {
  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '50px 0' }}>
      <div className="container" style={{ maxWidth: '840px', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '40px', lineHeight: '1.8' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '8px' }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
          Effective Date: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '20px' }}>
          1. Platform Nature & Disclaimer
        </h3>
        <p>
          GrabJob operates solely as a discovery and career coordination platform. Job seekers understand that job listings, walk-in events, and freelance projects originate from direct employer submissions, official partner APIs, and licensed public aggregations. GrabJob does not guarantee job offers, employment, or interview outcomes.
        </p>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '20px' }}>
          2. Paid Services Clarification
        </h3>
        <p>
          - <strong>Interview Assistance (₹100):</strong> A coordination fee for administrative assistance with scheduling confirmed interview time slots for eligible jobs. It is not an employment guarantee.<br />
          - <strong>ATS Resume Builder (₹50):</strong> An AI-assisted formatting and keyword analyzer tool. It does not fabricate certifications or work experiences.
        </p>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '20px' }}>
          3. Prohibited Conduct
        </h3>
        <p>
          Users agree not to upload fraudulent resumes, use automated bots to hammer the API, reverse engineer endpoints, or engage in malicious activity.
        </p>
      </div>
    </div>
  );
}
