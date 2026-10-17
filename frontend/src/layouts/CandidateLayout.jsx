import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Bookmark,
  CalendarCheck,
  FileText,
  Bell,
  Settings,
  Crown,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import MobileBottomNav from '../components/common/MobileBottomNav';

export default function CandidateLayout() {
  const { user } = useAuthStore();
  const displayName = user?.name || 'Deepak Kumar';
  const displayRole = user?.currentRole || 'Job Seeker';
  const initial = displayName.charAt(0).toUpperCase();

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', to: '/profile', icon: User },
    { label: 'Job Applications', to: '/applications', icon: Briefcase, badge: 3 },
    { label: 'Saved Jobs', to: '/saved-jobs', icon: Bookmark },
    { label: 'Interview Requests', to: '/interview-assistance', icon: CalendarCheck },
    { label: 'Resume Builder', to: '/resume-builder', icon: FileText },
    { label: 'Interview Assistance', to: '/interview-assistance', icon: Sparkles },
    { label: 'Notifications', to: '/notifications', icon: Bell, badge: 5 },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <div style={{ backgroundColor: '#f4f6fa', minHeight: '92vh', padding: '24px 0 60px' }}>
      <div className="container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
        <div className="candidate-layout-grid">
          
          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="candidate-sidebar">
            {/* User Mini Profile Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {initial}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: '0.94rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {displayName}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                    {displayRole}
                  </p>
                </div>
              </div>

              {/* Profile Completion Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 500 }}>Profile Completion</span>
                  <span style={{ fontWeight: 700, color: '#2563eb' }}>80%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: '80%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: '9999px',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '12px 8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.to === '/dashboard'}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 600 : 500,
                      backgroundColor: isActive ? '#2563eb' : 'transparent',
                      color: isActive ? '#ffffff' : '#475569',
                      transition: 'all 0.15s ease',
                    })}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        style={{
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          borderRadius: '10px',
                          padding: '1px 7px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Upgrade to Pro Card */}
            <div
              style={{
                backgroundColor: '#fffdf5',
                borderRadius: '16px',
                border: '1px solid #fef3c7',
                padding: '18px 16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Crown size={20} color="#f59e0b" fill="#f59e0b" />
                <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                  Upgrade to Pro
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#475569' }}>
                  <CheckCircle2 size={14} color="#16a34a" />
                  <span>Priority job access</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#475569' }}>
                  <CheckCircle2 size={14} color="#16a34a" />
                  <span>Unlimited resume building</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#475569' }}>
                  <CheckCircle2 size={14} color="#16a34a" />
                  <span>Interview assistance</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#475569' }}>
                  <CheckCircle2 size={14} color="#16a34a" />
                  <span>Personalised job alerts</span>
                </div>
              </div>

              <Link
                to="/pricing"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(37,99,235,0.25)',
                  boxSizing: 'border-box',
                }}
              >
                Get Pro Now <ArrowRight size={14} />
              </Link>
            </div>
          </aside>

          {/* ================= MAIN DASHBOARD OUTLET ================= */}
          <main style={{ minWidth: 0 }}>
            <Outlet />
          </main>

        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
