import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Calendar,
  Building2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { WalkinBadge, VerifiedBadge, SourceBadge } from '../jobs/WalkinBadge';
import { formatSalary, timeAgo } from '../../utils/formatters';
import { jobService } from '../../services/jobService';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

// Color palette generator for company avatar icons
const getAvatarGradient = (name = 'G') => {
  const charCode = name.charCodeAt(0) || 65;
  const gradients = [
    'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    'linear-gradient(135deg, #065f46 0%, #059669 100%)',
    'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
    'linear-gradient(135deg, #831843 0%, #db2777 100%)',
    'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
  ];
  return gradients[charCode % gradients.length];
};

export default function JobCard({ job, onApply, isSavedInit = false }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isSaved, setIsSaved] = useState(isSavedInit || job.isSaved || false);
  const [saving, setSaving] = useState(false);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to save jobs.');
      navigate('/login');
      return;
    }

    try {
      setSaving(true);
      if (isSaved) {
        await jobService.unsaveJob(job._id);
        setIsSaved(false);
        toast.success('Job removed from saved bookmarks');
      } else {
        await jobService.saveJob(job._id);
        setIsSaved(true);
        toast.success('Job saved to your bookmarks!');
      }
    } catch {
      toast.error('Could not update saved job');
    } finally {
      setSaving(false);
    }
  };

  const handleApplyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onApply) {
      onApply(job);
    } else {
      navigate(`/jobs/${job._id}`);
    }
  };

  const companyLetter = job.company ? job.company.charAt(0).toUpperCase() : 'G';
  const avatarGradient = getAvatarGradient(job.company);

  return (
    <div className={`job-card ${job.isWalkin ? 'walkin-card' : ''}`}>
      <div>
        {/* Top Header */}
        <div className="job-header">
          <div className="job-company-info">
            <div
              className="company-logo-avatar"
              style={{ background: avatarGradient }}
            >
              {companyLetter}
            </div>
            <div>
              <Link to={`/jobs/${job._id}`}>
                <h3 className="job-title">{job.title}</h3>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <p className="job-company">{job.company}</p>
                {job.isVerified && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#2563eb',
                      background: '#eff6ff',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    <CheckCircle2 size={11} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleToggleSave}
              disabled={saving}
              title={isSaved ? 'Remove from saved' : 'Save job'}
              style={{
                background: isSaved ? '#eff6ff' : '#f8fafc',
                border: isSaved ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px',
                color: isSaved ? '#2563eb' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>
        </div>

        {/* Walkin Specific Highlight Banner */}
        {job.isWalkin && (
          <div className="walkin-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#dc2626' }}>
              <Calendar size={15} />
              <span>
                Walk-in Interview: {job.walkinDateDisplay || 'Upcoming Drive'} ({job.walkinStartTime || '10:00 AM'} - {job.walkinEndTime || '4:00 PM'})
              </span>
            </div>
            {job.walkinVenue && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                <MapPin size={13} color="#64748b" />
                <span>Venue: {job.walkinVenue}</span>
              </div>
            )}
          </div>
        )}

        {/* Key Job Meta Row */}
        <div className="job-meta-row">
          <div className="job-meta-item">
            <MapPin size={14} color="#64748b" />
            <span>{job.city}{job.state ? `, ${job.state}` : ''}</span>
          </div>

          <div className="job-meta-item">
            <IndianRupee size={14} color="#16a34a" />
            <span style={{ fontWeight: 700, color: '#16a34a' }}>
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryDisplay)}
            </span>
          </div>

          <div className="job-meta-item">
            <Briefcase size={14} color="#64748b" />
            <span>{job.experience || '0-2 Yrs'}</span>
          </div>

          <div className="job-meta-item">
            <span
              style={{
                background: '#f1f5f9',
                color: '#334155',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 600,
              }}
            >
              {job.jobType || 'Full Time'}
            </span>
          </div>

          <div className="job-meta-item">
            <span
              style={{
                background: '#eff6ff',
                color: '#2563eb',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 600,
              }}
            >
              {job.workMode || 'On-site'}
            </span>
          </div>
        </div>

        {/* Skills Row */}
        {job.skills && job.skills.length > 0 && (
          <div className="job-skills-row">
            {job.skills.slice(0, 5).map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span style={{ fontSize: '0.74rem', color: '#64748b', alignSelf: 'center', fontWeight: 500 }}>
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="job-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94a3b8' }}>
          <Clock size={13} />
          <span>{timeAgo(job.createdAt)}</span>
          {job.source && (
            <span style={{ color: '#64748b', fontWeight: 500 }}>
              • {job.sourceName || (job.source === 'employer' ? 'Direct Employer' : job.source)}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to={`/jobs/${job._id}`}
            className="btn btn-outline btn-sm"
            style={{ fontWeight: 600 }}
          >
            View Details
          </Link>
          <button
            onClick={handleApplyClick}
            className="btn btn-primary btn-sm"
          >
            {job.source !== 'employer' && job.sourceUrl ? (
              <>Apply <ExternalLink size={12} /></>
            ) : (
              'Apply Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
