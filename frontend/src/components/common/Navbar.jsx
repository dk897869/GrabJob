import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User, LogOut, Shield, Menu, X, ArrowRight, Users, MessageSquare, MapPin, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdown(false);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo">
            <div className="brand-icon-box">
              <Briefcase size={20} color="#ffffff" strokeWidth={2.5} />
            </div>
            <span className="brand-name-dark">Grab</span>
            <span className="brand-name-blue">Job</span>
          </Link>

          {/* Desktop Navigation Links (Clean, centered, matches reference mockup) */}
          <nav className="nav-links">
            <NavLink to="/jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Jobs
            </NavLink>
            <NavLink to="/walkin-jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Walk-in Jobs
            </NavLink>
            <NavLink to="/map" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Map
            </NavLink>
            <NavLink to="/freelance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Freelance
            </NavLink>
            <NavLink to="/network" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Network
            </NavLink>
            <NavLink to="/messages" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Messages
            </NavLink>
            <NavLink to="/resume-builder" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Resume Builder
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              About
            </NavLink>
          </nav>

          {/* Desktop Auth Actions */}
          <div className="nav-auth-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Location Pill */}
                <div
                  className="desktop-only-nav-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    backgroundColor: '#f1f5f9',
                    fontSize: '0.82rem',
                    color: '#334155',
                    fontWeight: 600,
                  }}
                >
                  <MapPin size={14} color="#64748b" />
                  <span>India</span>
                </div>

                {/* Notification Bell */}
                <Link
                  to="/notifications"
                  style={{
                    position: 'relative',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#334155',
                    textDecoration: 'none',
                  }}
                >
                  <Bell size={18} />
                  <span
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                    }}
                  />
                </Link>

                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="user-profile-pill"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 10px 4px 4px',
                      borderRadius: '24px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      className="user-avatar-circle"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div className="desktop-only-nav-item" style={{ textAlign: 'left', lineHeight: 1.2 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>
                        {user?.name || 'Deepak Kumar'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>
                        {user?.currentRole || 'Job Seeker'}
                      </span>
                    </div>
                  </button>

                {userDropdown && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-user-header">
                      <p className="dropdown-user-name">{user?.name || 'Candidate'}</p>
                      <p className="dropdown-user-email">{user?.email}</p>
                    </div>

                    <Link
                      to="/network"
                      onClick={() => setUserDropdown(false)}
                      className="dropdown-item"
                    >
                      <Users size={16} /> My Network & Connections
                    </Link>

                    <Link
                      to="/messages"
                      onClick={() => setUserDropdown(false)}
                      className="dropdown-item"
                    >
                      <MessageSquare size={16} /> Direct Messages
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdown(false)}
                      className="dropdown-item"
                    >
                      <User size={16} /> Candidate Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="dropdown-item"
                    >
                      <Briefcase size={16} /> My Profile & CV
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdown(false)}
                        className="dropdown-item admin-item"
                      >
                        <Shield size={16} /> Admin Console
                      </Link>
                    )}

                    <div className="dropdown-divider" />

                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
            ) : (
              <div className="auth-buttons-group">
                <Link to="/login" className="btn btn-login">
                  Login
                </Link>
                <Link to="/register" className="btn btn-signup">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="mobile-hamburger"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileNavOpen && (
          <div className="mobile-drawer">
            <Link to="/jobs" onClick={() => setMobileNavOpen(false)} className="mobile-drawer-link">
              Find Jobs
            </Link>
            <Link to="/walkin-jobs" onClick={() => setMobileNavOpen(false)} className="mobile-drawer-link">
              Walk-in Drives
            </Link>
            <Link to="/map" onClick={() => setMobileNavOpen(false)} className="mobile-drawer-link">
              Map Discovery
            </Link>
            <Link to="/freelance" onClick={() => setMobileNavOpen(false)} className="mobile-drawer-link">
              Freelance Projects
            </Link>
            <Link to="/network" onClick={() => setMobileNavOpen(false)} className="mobile-drawer-link">
              My Network & Connections
            </Link>
            <Link to="/messages" onClick={() => setMobileNavOpen(false)} className="mobile-drawer-link">
              Direct Messages & Chats
            </Link>
            <Link to="/resume-builder" onClick={() => setMobileNavOpen(false)} className="mobile-drawer-link">
              ATS Resume Builder (₹50)
            </Link>
            <Link to="/interview-assistance" onClick={() => setMobileNavOpen(false)} className="mobile-drawer-link">
              Interview Assistance (₹100)
            </Link>
            <Link to="/about" onClick={() => setMobileNavOpen(false)} className="mobile-drawer-link">
              About GrabJob
            </Link>

            {!isAuthenticated && (
              <div className="mobile-drawer-auth">
                <Link to="/login" onClick={() => setMobileNavOpen(false)} className="btn btn-login" style={{ width: '100%', justifyContent: 'center' }}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileNavOpen(false)} className="btn btn-signup" style={{ width: '100%', justifyContent: 'center' }}>
                  Create Free Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
