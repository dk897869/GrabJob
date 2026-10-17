import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Bookmark,
  Share2,
  Calendar,
  ExternalLink,
  Navigation,
  CheckCircle,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { useJobDetails } from '../hooks/useJobs';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { jobService } from '../services/jobService';
import { formatSalary, timeAgo, formatDate } from '../utils/formatters';
import { WalkinBadge, VerifiedBadge } from '../components/jobs/WalkinBadge';
import { LoadingSpinner } from '../components/common/Loading';
import JobMap from '../components/map/JobMap';
import toast from 'react-hot-toast';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { openPaymentModal } = useUiStore();

  const { data, isLoading, error, refetch } = useJobDetails(id);
  const job = data?.data;

  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to apply for this job.');
      navigate('/login');
      return;
    }

    if (job.source !== 'employer' && job.sourceUrl) {
      window.open(job.sourceUrl, '_blank');
      toast.success(`Redirecting to official source: ${job.sourceName}`);
      return;
    }

    try {
      setApplying(true);
      const res = await jobService.applyToJob(job._id);
      if (res.success) {
        setHasApplied(true);
        toast.success('Application submitted successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this opening for ${job.title} on GrabJob India!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied to clipboard!');
    }
  };

  const handleInterviewAssistance = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to purchase interview assistance.');
      navigate('/login');
      return;
    }
    openPaymentModal({
      serviceType: 'interview_assistance',
      jobId: job._id,
      jobTitle: `${job.title} - ${job.company}`,
      amount: 100,
    });
  };

  if (isLoading) return <LoadingSpinner message="Loading job opening..." />;
  if (error || !job) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Job opening not found</h2>
        <p style={{ color: '#64748b', marginTop: '8px' }}>This position may have expired or been filled.</p>
        <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Browse other jobs
        </Link>
      </div>
    );
  }

  const [lng, lat] = job.location?.coordinates || [76.7794, 30.7333];
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '32px 0 60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '16px' }}>
          <Link to="/">Home</Link> &gt; <Link to="/jobs">Jobs</Link> &gt; <span>{job.title}</span>
        </div>

        {/* Top Header Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '30px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '18px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: '#f1f5f9',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {job.company ? job.company.charAt(0).toUpperCase() : 'G'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)' }}>
                    {job.title}
                  </h1>
                  {job.isVerified && <VerifiedBadge />}
                  {job.isWalkin && <WalkinBadge dateDisplay={job.walkinDateDisplay} />}
                </div>

                <p style={{ fontSize: '1.05rem', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                  {job.company}
                </p>

                <div className="job-meta-row" style={{ marginTop: '12px' }}>
                  <div className="job-meta-item">
                    <MapPin size={16} color="#64748b" />
                    <span>{job.city}, {job.state}</span>
                  </div>
                  <div className="job-meta-item">
                    <IndianRupee size={16} color="#16a34a" />
                    <span style={{ fontWeight: 700, color: '#16a34a' }}>
                      {formatSalary(job.salaryMin, job.salaryMax, job.salaryDisplay)}
                    </span>
                  </div>
                  <div className="job-meta-item">
                    <Briefcase size={16} color="#64748b" />
                    <span>{job.experience || '0-2 Years'}</span>
                  </div>
                  <div className="job-meta-item">
                    <span style={{ background: '#f1f5f9', padding: '3px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {job.jobType}
                    </span>
                  </div>
                  <div className="job-meta-item">
                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {job.workMode}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={handleShare} className="btn btn-outline">
                <Share2 size={16} /> Share
              </button>

              <button
                onClick={handleApply}
                disabled={applying || hasApplied || job.hasApplied}
                className="btn btn-primary btn-lg"
              >
                {hasApplied || job.hasApplied ? (
                  <>✓ Applied</>
                ) : job.source !== 'employer' && job.sourceUrl ? (
                  <>Apply on {job.sourceName || 'Source'} <ExternalLink size={16} /></>
                ) : (
                  'Apply Now'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Details + Sidebar Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          {/* Left Column: Job Description & Requirements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Walk-in Venue Highlight */}
            {job.isWalkin && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 700, fontSize: '1.05rem', marginBottom: '8px' }}>
                  <Calendar size={20} />
                  <span>Walk-in Interview Details</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '4px' }}>
                  <strong>Date:</strong> {job.walkinDateDisplay || formatDate(job.walkinDate) || 'This Week'}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '4px' }}>
                  <strong>Timings:</strong> {job.walkinStartTime || '10:00 AM'} to {job.walkinEndTime || '4:00 PM'}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '12px' }}>
                  <strong>Venue:</strong> {job.walkinVenue || job.address || job.city}
                </p>

                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-danger btn-sm"
                  style={{ display: 'inline-flex' }}
                >
                  <Navigation size={14} /> Get Directions on Maps
                </a>
              </div>
            )}

            {/* Description */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '14px' }}>
                Job Overview
              </h3>
              <p style={{ fontSize: '0.94rem', color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {job.description}
              </p>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '10px' }}>
                    Key Responsibilities
                  </h4>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: '#334155', lineHeight: '1.7' }}>
                    {job.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '10px' }}>
                    Requirements & Eligibility
                  </h4>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: '#334155', lineHeight: '1.7' }}>
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills Required */}
              {job.skills && job.skills.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '10px' }}>
                    Skills Required
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#f1f5f9',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.84rem',
                          fontWeight: 500,
                          color: '#1e293b',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Location Map View */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--secondary)' }}>
                  Location & Map
                </h3>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex' }}
                >
                  <Navigation size={13} /> Get Directions
                </a>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '14px' }}>
                📍 {job.address || `${job.city}, ${job.state}, India`}
              </p>
              <div style={{ height: '240px', borderRadius: '10px', overflow: 'hidden' }}>
                <JobMap jobs={[job]} center={[lat, lng]} zoom={13} radiusKm={null} />
              </div>
            </div>
          </div>

          {/* Right Column: Services & Company Verification */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Interview Assistance ₹100 Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                color: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: 'rgba(255,255,255,0.2)',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                }}
              >
                SPECIAL SERVICE
              </span>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '8px 0 6px' }}>
                Interview Assistance
              </h4>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: '1.5', marginBottom: '16px' }}>
                GrabJob helps coordinate interview scheduling for eligible jobs. It does not guarantee employment.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>₹100</span>
                <span style={{ fontSize: '0.78rem', opacity: 0.8 }}>One-time fee</span>
              </div>
              <button
                onClick={handleInterviewAssistance}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', background: '#ffffff', color: '#1e3a8a', fontWeight: 700 }}
              >
                Book Assistance (₹100)
              </button>
            </div>

            {/* Source Provenance Info */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={18} color="#16a34a" /> Job Verification
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: '1.5', marginBottom: '10px' }}>
                Source: <strong>{job.sourceName || 'Direct Employer'}</strong> ({job.source})
              </p>
              <div style={{ fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                {job.isDemo ? (
                  <span>⚠️ This is a simulated DEMO job for platform testing.</span>
                ) : (
                  <span>🛡️ Verified listing from authorized employer feed. GrabJob does not charge job application fees.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
