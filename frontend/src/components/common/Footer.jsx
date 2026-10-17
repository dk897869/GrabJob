import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <Link to="/" className="brand-logo" style={{ marginBottom: '14px', display: 'inline-flex' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'var(--primary)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Briefcase size={18} />
              </div>
              Grab<span>Job</span>
            </Link>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px', maxWidth: '320px' }}>
              India's trusted career platform. Discover verified jobs, walk-in interviews, and freelance opportunities near you.
            </p>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              🛡️ <strong>Legal & Compliance:</strong> GrabJob only aggregates authorized employer listings, licensed feeds, and partner APIs. No unauthorized web scraping.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-link-list">
              <li><Link to="/jobs" className="footer-link">Browse Jobs</Link></li>
              <li><Link to="/walkin-jobs" className="footer-link">Walk-in Jobs</Link></li>
              <li><Link to="/map" className="footer-link">Map Discovery</Link></li>
              <li><Link to="/freelance" className="footer-link">Freelance Projects</Link></li>
              <li><Link to="/pricing" className="footer-link">Services & Pricing</Link></li>
            </ul>
          </div>

          {/* Career Tools */}
          <div>
            <h4 className="footer-heading">Career Services</h4>
            <ul className="footer-link-list">
              <li><Link to="/resume-builder" className="footer-link">ATS Resume Builder (₹50)</Link></li>
              <li><Link to="/interview-assistance" className="footer-link">Interview Assistance (₹100)</Link></li>
              <li><Link to="/dashboard" className="footer-link">Candidate Dashboard</Link></li>
              <li><Link to="/applications" className="footer-link">Track Applications</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-link-list">
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Support</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GrabJob India. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Made with <Heart size={14} color="#dc2626" fill="#dc2626" /> in India
          </div>
        </div>
      </div>
    </footer>
  );
}
