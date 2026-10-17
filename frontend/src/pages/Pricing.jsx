import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function Pricing() {
  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '50px 0 80px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-verified" style={{ marginBottom: '12px' }}>
            TRANSPARENT PRICING
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--secondary)' }}>
            Simple, Accessible Career Services
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '520px', margin: '8px auto 0' }}>
            No recurring monthly subscriptions. Pay only for the specific career assistance you need.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {/* Free Tier */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Basic Search</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', margin: '8px 0 4px' }}>Free</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '24px' }}>
                Full access to search and discover opportunities across India.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                  <Check size={18} color="#16a34a" /> <span>Browse pan-India verified jobs</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                  <Check size={18} color="#16a34a" /> <span>Interactive geospatial map with radius</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                  <Check size={18} color="#16a34a" /> <span>Walk-in interview venue alerts & directions</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                  <Check size={18} color="#16a34a" /> <span>Track candidate application stages</span>
                </div>
              </div>
            </div>

            <Link to="/jobs" className="btn btn-outline" style={{ width: '100%' }}>
              Start Job Search
            </Link>
          </div>

          {/* ₹50 ATS Resume Builder */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '2px solid #3b82f6', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '24px', background: 'var(--primary)', color: '#ffffff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: '9999px' }}>
              MOST POPULAR
            </div>

            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>AI Resume Service</span>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', margin: '8px 0 4px' }}>
                ₹50 <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#64748b' }}>/ resume</span>
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '24px' }}>
                Automated ATS formatting and keyword alignment against job postings.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                  <Check size={18} color="#16a34a" /> <span>Upload old PDF / DOCX resume</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                  <Check size={18} color="#16a34a" /> <span>AI job description keyword matcher</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                  <Check size={18} color="#16a34a" /> <span>Download clean ATS PDF & DOCX</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                  <Check size={18} color="#16a34a" /> <span>Delivered directly to your email</span>
                </div>
              </div>
            </div>

            <Link to="/resume-builder" className="btn btn-primary" style={{ width: '100%' }}>
              Build ATS Resume (₹50)
            </Link>
          </div>

          {/* ₹100 Interview Assistance */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase' }}>Coordination Service</span>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', margin: '8px 0 4px' }}>
                ₹100 <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#64748b' }}>/ request</span>
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '24px' }}>
                Dedicated coordination to schedule interviews for eligible openings.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                  <Check size={18} color="#16a34a" /> <span>Select eligible target opening</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                  <Check size={18} color="#16a34a" /> <span>Coordinator verifies candidate profile</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                  <Check size={18} color="#16a34a" /> <span>Confirmed meeting link / venue by email</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                  <Check size={18} color="#16a34a" /> <span>Status updates on candidate dashboard</span>
                </div>
              </div>
            </div>

            <Link to="/interview-assistance" className="btn btn-secondary" style={{ width: '100%' }}>
              Book Assistance (₹100)
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.84rem', color: '#94a3b8' }}>
          🛡️ GrabJob is committed to transparent hiring. Paid services coordinate logistics and formatting; they do not guarantee job offers or hiring decisions.
        </div>
      </div>
    </div>
  );
}
