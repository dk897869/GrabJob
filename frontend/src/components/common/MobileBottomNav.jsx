import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, CalendarCheck, MapPin, User, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function MobileBottomNav() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-bottom-nav-inner">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon-wrap">
            <Home size={20} strokeWidth={2.2} />
          </div>
          <span className="mobile-nav-label">Home</span>
        </NavLink>

        <NavLink
          to="/jobs"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon-wrap">
            <Briefcase size={20} strokeWidth={2.2} />
          </div>
          <span className="mobile-nav-label">Jobs</span>
        </NavLink>

        <NavLink
          to="/walkin-jobs"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon-wrap relative-icon">
            <CalendarCheck size={20} strokeWidth={2.2} />
            <span className="mobile-live-dot" />
          </div>
          <span className="mobile-nav-label">Walk-ins</span>
        </NavLink>

        <NavLink
          to="/map"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon-wrap">
            <MapPin size={20} strokeWidth={2.2} />
          </div>
          <span className="mobile-nav-label">Map</span>
        </NavLink>

        <NavLink
          to={isAuthenticated ? '/dashboard' : '/login'}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon-wrap">
            {isAuthenticated ? (
              <LayoutDashboard size={20} strokeWidth={2.2} />
            ) : (
              <User size={20} strokeWidth={2.2} />
            )}
          </div>
          <span className="mobile-nav-label">
            {isAuthenticated ? 'Dashboard' : 'Login'}
          </span>
        </NavLink>
      </div>
    </nav>
  );
}
