import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Layers,
  CreditCard,
  UserCheck,
  FileCheck,
  Globe,
  Mail,
  ShieldAlert,
  Settings,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', to: '/admin/users', icon: Users },
    { label: 'Jobs', to: '/admin/jobs', icon: Briefcase },
    { label: 'Walk-ins', to: '/admin/walkins', icon: Calendar },
    { label: 'Freelance', to: '/admin/freelance', icon: Layers },
    { label: 'Payments', to: '/admin/payments', icon: CreditCard },
    { label: 'Interviews', to: '/admin/interviews', icon: UserCheck },
    { label: 'Resume Orders', to: '/admin/resumes', icon: FileCheck },
    { label: 'Job Sources', to: '/admin/job-sources', icon: Globe },
    { label: 'Email Logs', to: '/admin/email-logs', icon: Mail },
    { label: 'Audit Logs', to: '/admin/audit-logs', icon: ShieldAlert },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0b1329' }}>
      {/* Admin Topbar */}
      <header
        style={{
          background: '#0f172a',
          borderBottom: '1px solid #1e293b',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6' }}>GrabJob</span>
            <span style={{ fontSize: '0.78rem', background: '#2563eb', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              ADMIN CONSOLE
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/"
            style={{
              color: '#94a3b8',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeft size={16} /> View Candidate Portal
          </Link>
          <div style={{ width: '1px', height: '20px', background: '#334155' }} />
          <span style={{ color: '#cbd5e1', fontSize: '0.86rem', fontWeight: 500 }}>
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside
          className="dashboard-sidebar admin-theme"
          style={{ width: '240px', overflowY: 'auto' }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </aside>

        {/* Admin Content Area */}
        <main style={{ flex: 1, padding: '32px', background: '#0b1329', overflowY: 'auto', color: '#f8fafc' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
