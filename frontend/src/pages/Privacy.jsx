import React from 'react';

export default function Privacy() {
  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '50px 0' }}>
      <div className="container" style={{ maxWidth: '840px', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '40px', lineHeight: '1.8' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '8px' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
          Last Updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '20px' }}>
          1. Information We Collect
        </h3>
        <p>
          GrabJob collects candidate information such as full name, email address, phone number, current city, state, resume documents, and declared skills. We only collect details that candidates voluntarily supply during profile registration or resume builder upload.
        </p>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '20px' }}>
          2. Use of Information
        </h3>
        <p>
          Information collected is utilized exclusively for job discovery, walk-in interview venue alerts, resume keyword optimization, and interview scheduling coordination. We do not sell personal information to unsolicited third-party marketing telemarketers.
        </p>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '20px' }}>
          3. Payment Information Security
        </h3>
        <p>
          All online transactions (such as ₹100 Interview Assistance or ₹50 ATS Resume Builder) are processed via PCI-DSS compliant payment gateways (such as Razorpay). GrabJob servers never retain or store credit card numbers, CVVs, or bank netbanking passwords.
        </p>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '20px' }}>
          4. Data Deletion
        </h3>
        <p>
          Candidates can request complete deletion of their account, application history, and uploaded resumes at any time by contacting privacy@grabjob.in.
        </p>
      </div>
    </div>
  );
}
