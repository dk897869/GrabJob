import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Password reset link dispatched!');
    } catch {
      toast.error('Unable to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '36px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#64748b', marginBottom: '20px' }}>
          <ArrowLeft size={16} /> Back to Login
        </Link>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={30} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--secondary)' }}>Check your email</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '10px 0 24px' }}>
              If an account is associated with <strong>{email}</strong>, we have sent a secure password reset link.
            </p>
            <Link to="/login" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              Return to Login
            </Link>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '8px' }}>
              Forgot Password?
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '24px' }}>
              Enter your registered email address and we will send you a secure link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                style={{ width: '100%', marginTop: '10px' }}
                loading={loading}
              >
                Send Reset Link
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
