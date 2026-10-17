import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Edit3,
  CheckCircle2,
  Calendar,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const { user } = useAuthStore();
  const completion = user?.profileCompletion || 75;

  const experienceList = user?.experienceList || [];
  const educationList = user?.educationList || [];

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Candidate Profile
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '4px 0 0' }}>
            Manage your verified career details, experience history, and resume
          </p>
        </div>
        <Link
          to="/profile/edit"
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px' }}
        >
          <Edit3 size={15} /> Edit Profile
        </Link>
      </div>

      {/* Profile Strength Meter */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
            Profile Strength: {completion}%
          </span>
          <span style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 700 }}>
            {completion >= 90 ? 'Profile Discoverable by Recruiters' : 'Add remaining details to increase discovery'}
          </span>
        </div>
        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${completion}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
              borderRadius: '999px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Main Info Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', gap: '22px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          {/* Avatar Image / Fallback */}
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: user?.avatar
                ? 'transparent'
                : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              overflow: 'hidden',
              border: '3px solid #bfdbfe',
              boxShadow: '0 4px 12px rgba(37,99,235,0.18)',
              flexShrink: 0,
            }}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              user?.name ? user.name.charAt(0).toUpperCase() : 'U'
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {user?.name}
              </h2>
              {user?.role === 'admin' && (
                <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                  ADMINISTRATOR
                </span>
              )}
              {user?.isEmailVerified && (
                <span className="badge badge-verified">
                  <CheckCircle2 size={12} /> Verified
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.94rem', color: '#475569', fontWeight: 600, margin: '4px 0 0' }}>
              {user?.currentRole || 'Job Seeker'} • {user?.experienceYears || 0} Yrs Experience
            </p>
          </div>
        </div>

        {/* Contact details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            padding: '16px 0',
            borderTop: '1px solid #f1f5f9',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#334155' }}>
            <Mail size={16} color="#64748b" /> <span>{user?.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#334155' }}>
            <Phone size={16} color="#64748b" /> <span>{user?.phone || 'Not specified'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#334155' }}>
            <MapPin size={16} color="#64748b" /> <span>{user?.city ? `${user.city}, ${user.state}` : 'India'}</span>
          </div>
        </div>

        {/* Skills */}
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
            Technical & Soft Skills
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {user?.skills && user.skills.length > 0 ? (
              user.skills.map((s, idx) => (
                <span key={idx} className="skill-tag" style={{ fontSize: '0.82rem', padding: '4px 12px' }}>
                  {s}
                </span>
              ))
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                No skills listed yet. Click edit to add your core competencies.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= WORK EXPERIENCE SECTION ================= */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Work Experience
            </h3>
          </div>
          <Link to="/profile/edit" style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 600 }}>
            + Update Experience
          </Link>
        </div>

        {experienceList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {experienceList.map((exp, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {exp.title || 'Role'}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                    {exp.duration || 'Duration'}
                  </span>
                </div>
                {exp.company && (
                  <p style={{ fontSize: '0.86rem', color: '#2563eb', fontWeight: 600, margin: '2px 0 8px' }}>
                    {exp.company}
                  </p>
                )}
                {exp.description && (
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
            No past employment listed. Click <strong>Edit Profile</strong> to add your work history.
          </p>
        )}
      </div>

      {/* ================= EDUCATION QUALIFICATIONS ================= */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={20} color="#16a34a" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Education & Qualifications
            </h3>
          </div>
          <Link to="/profile/edit" style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 600 }}>
            + Update Education
          </Link>
        </div>

        {educationList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {educationList.map((edu, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {edu.degree || 'Degree'}
                  </h4>
                  {edu.year && (
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                      Class of {edu.year}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.86rem', color: '#475569', margin: '2px 0 0' }}>
                  {edu.institution}{edu.field ? ` • ${edu.field}` : ''}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
            {user?.education || 'No formal degree listed. Click Edit Profile to add.'}
          </p>
        )}
      </div>
    </div>
  );
}
