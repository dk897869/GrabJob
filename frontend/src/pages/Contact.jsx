import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Thank you! Your message has been received by GrabJob Support.');
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '50px 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--secondary)' }}>Contact GrabJob Support</h1>
          <p style={{ fontSize: '1rem', color: '#64748b', marginTop: '6px' }}>
            Have questions about a walk-in drive, payment verification, or partner integrations?
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
          {/* Contact Details */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '20px' }}>
              Headquarters
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>Office Address</h5>
                  <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    Rajiv Gandhi IT Park, Chandigarh & Mohali Hub, Punjab - 160101, India
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Mail size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>Email Support</h5>
                  <p style={{ fontSize: '0.84rem', color: '#64748b' }}>support@grabjob.in</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Phone size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>Toll-Free Helpline</h5>
                  <p style={{ fontSize: '0.84rem', color: '#64748b' }}>+91 1800-GRAB-JOB (Mon-Sat, 9AM-6PM IST)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '30px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#16a34a', marginBottom: '8px' }}>
                  Message Sent Successfully!
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  Our career coordination team typically replies within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    rows={4}
                    required
                    className="form-input"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" style={{ width: '100%' }}>
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
