import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Bell, Shield, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Settings() {
  const { user } = useAuthStore();

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>
          Account Settings
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Manage your login credentials, security preferences, and notification alerts
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
        {/* Change Password Card */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>Security & Password</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Update your account password regularly to keep your profile secure
            </p>
          </div>
          <Link to="/change-password" className="btn btn-outline btn-sm">
            Change Password
          </Link>
        </div>

        {/* Profile Info Card */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>Candidate Profile</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Edit skills, experience years, contact numbers, and target cities
            </p>
          </div>
          <Link to="/profile/edit" className="btn btn-outline btn-sm">
            Edit Profile
          </Link>
        </div>

        {/* Notification Preferences */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '14px' }}>
            Alert Preferences
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Email notifications for new walk-ins near my city</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Interview schedule updates & confirmations</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Application status changes</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
