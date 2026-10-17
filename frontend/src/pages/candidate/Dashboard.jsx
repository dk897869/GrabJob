import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  CheckCircle2,
  CalendarCheck,
  Bookmark,
  TrendingUp,
  FileText,
  Zap,
  Target,
  ArrowRight,
  MoreVertical,
  SlidersHorizontal,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const displayName = user?.name?.split(' ')[0] || 'Deepak';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    if (filter === 'Walk-in') {
      navigate('/walkin-jobs');
    } else if (filter === 'Freelance') {
      navigate('/freelance');
    } else if (filter === 'Remote') {
      navigate('/jobs?workMode=Remote');
    } else {
      navigate(`/jobs?type=${encodeURIComponent(filter)}`);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
      
      {/* ========================================================
          CENTER COLUMN (MAIN CONTENT)
          ======================================================== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
        
        {/* HERO WELCOME BANNER */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 55%, #f8faff 100%)',
            padding: '28px 32px',
            position: 'relative',
          }}
        >
          {/* Top badges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                <span style={{ fontWeight: 400, color: '#334155' }}>Welcome back, </span>
                {displayName}!
              </h1>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b' }}>
                Let's take the next step in your career journey.
              </p>
            </div>

            {/* Floating metric chips */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={13} />
                </div>
                <span>10,000+ Active Jobs</span>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={13} />
                </div>
                <span>50+ Cities in India</span>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            style={{
              display: 'flex',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 3px 8px rgba(0,0,0,0.04)',
              padding: '6px 6px 6px 16px',
              alignItems: 'center',
              marginTop: '18px',
              marginBottom: '16px',
            }}
          >
            <Search size={18} color="#94a3b8" style={{ marginRight: '10px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search jobs by title, skills or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.92rem',
                color: '#0f172a',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 22px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Search Jobs
            </button>
          </form>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleFilterClick('Remote')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                backgroundColor: selectedFilter === 'Remote' ? '#2563eb' : '#ffffff',
                color: selectedFilter === 'Remote' ? '#ffffff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Remote
            </button>

            <button
              onClick={() => handleFilterClick('Walk-in')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                backgroundColor: selectedFilter === 'Walk-in' ? '#2563eb' : '#ffffff',
                color: selectedFilter === 'Walk-in' ? '#ffffff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              Walk-in
            </button>

            <button
              onClick={() => handleFilterClick('Full Time')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                backgroundColor: selectedFilter === 'Full Time' ? '#2563eb' : '#ffffff',
                color: selectedFilter === 'Full Time' ? '#ffffff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Full Time
            </button>

            <button
              onClick={() => handleFilterClick('Part Time')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                backgroundColor: selectedFilter === 'Part Time' ? '#2563eb' : '#ffffff',
                color: selectedFilter === 'Part Time' ? '#ffffff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Part Time
            </button>

            <button
              onClick={() => handleFilterClick('Freelance')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                backgroundColor: selectedFilter === 'Freelance' ? '#2563eb' : '#ffffff',
                color: selectedFilter === 'Freelance' ? '#ffffff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Freelance
            </button>
          </div>
        </div>

        {/* 4 STATS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {/* Card 1: Applied Jobs */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '18px 20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileText size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>12</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Applied Jobs</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
              <span>↑ 2 this week</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                <span style={{ width: '3px', height: '6px', backgroundColor: '#93c5fd', borderRadius: '1px' }} />
                <span style={{ width: '3px', height: '10px', backgroundColor: '#60a5fa', borderRadius: '1px' }} />
                <span style={{ width: '3px', height: '14px', backgroundColor: '#2563eb', borderRadius: '1px' }} />
              </div>
            </div>
          </div>

          {/* Card 2: Shortlisted */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '18px 20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>4</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Shortlisted</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
              <span>↑ 1 this week</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                <span style={{ width: '3px', height: '8px', backgroundColor: '#86efac', borderRadius: '1px' }} />
                <span style={{ width: '3px', height: '11px', backgroundColor: '#4ade80', borderRadius: '1px' }} />
                <span style={{ width: '3px', height: '14px', backgroundColor: '#16a34a', borderRadius: '1px' }} />
              </div>
            </div>
          </div>

          {/* Card 3: Interviews */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '18px 20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#fffbeb',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CalendarCheck size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>2</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Interviews</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
              <span>↑ 1 this week</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                <span style={{ width: '3px', height: '5px', backgroundColor: '#fde68a', borderRadius: '1px' }} />
                <span style={{ width: '3px', height: '9px', backgroundColor: '#fcd34d', borderRadius: '1px' }} />
                <span style={{ width: '3px', height: '14px', backgroundColor: '#f59e0b', borderRadius: '1px' }} />
              </div>
            </div>
          </div>

          {/* Card 4: Saved Jobs */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '18px 20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#f5f3ff',
                  color: '#8b5cf6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bookmark size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>8</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Saved Jobs</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600 }}>
              <span>↑ 3 this week</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                <span style={{ width: '3px', height: '7px', backgroundColor: '#ddd6fe', borderRadius: '1px' }} />
                <span style={{ width: '3px', height: '11px', backgroundColor: '#c4b5fd', borderRadius: '1px' }} />
                <span style={{ width: '3px', height: '14px', backgroundColor: '#8b5cf6', borderRadius: '1px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* RECENT APPLICATIONS TABLE */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Recent Applications
            </h2>
            <Link
              to="/applications"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#2563eb',
                textDecoration: 'none',
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ color: '#94a3b8', borderBottom: '1px solid #f1f5f9', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ paddingBottom: '12px', fontWeight: 600 }}>Job</th>
                  <th style={{ paddingBottom: '12px', fontWeight: 600 }}>Company</th>
                  <th style={{ paddingBottom: '12px', fontWeight: 600 }}>Status</th>
                  <th style={{ paddingBottom: '12px', fontWeight: 600 }}>Applied On</th>
                  <th style={{ paddingBottom: '12px', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1: Amazon */}
                <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '14px 0' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Frontend Developer</p>
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Full Time • Bangalore</span>
                  </td>
                  <td style={{ padding: '14px 0' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Amazon</span>
                  </td>
                  <td style={{ padding: '14px 0' }}>
                    <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700 }}>
                      Applied
                    </span>
                  </td>
                  <td style={{ padding: '14px 0', color: '#64748b', fontSize: '0.82rem' }}>17 Oct 2026</td>
                  <td style={{ padding: '14px 0', textAlign: 'right' }}>
                    <Link
                      to="/applications"
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        color: '#2563eb',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textDecoration: 'none',
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>

                {/* Row 2: Microsoft */}
                <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '14px 0' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>React Developer</p>
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Hybrid • Chandigarh</span>
                  </td>
                  <td style={{ padding: '14px 0' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Microsoft</span>
                  </td>
                  <td style={{ padding: '14px 0' }}>
                    <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700 }}>
                      Shortlisted
                    </span>
                  </td>
                  <td style={{ padding: '14px 0', color: '#64748b', fontSize: '0.82rem' }}>16 Oct 2026</td>
                  <td style={{ padding: '14px 0', textAlign: 'right' }}>
                    <Link
                      to="/applications"
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        color: '#2563eb',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textDecoration: 'none',
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>

                {/* Row 3: TCS */}
                <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '14px 0' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Software Engineer</p>
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Full Time • Pune</span>
                  </td>
                  <td style={{ padding: '14px 0' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>TCS</span>
                  </td>
                  <td style={{ padding: '14px 0' }}>
                    <span style={{ backgroundColor: '#fffbeb', color: '#d97706', padding: '3px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700 }}>
                      Interview
                    </span>
                  </td>
                  <td style={{ padding: '14px 0', color: '#64748b', fontSize: '0.82rem' }}>15 Oct 2026</td>
                  <td style={{ padding: '14px 0', textAlign: 'right' }}>
                    <Link
                      to="/applications"
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        color: '#2563eb',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textDecoration: 'none',
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>

                {/* Row 4: Infosys */}
                <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '14px 0' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Web Developer</p>
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Remote • India</span>
                  </td>
                  <td style={{ padding: '14px 0' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Infosys</span>
                  </td>
                  <td style={{ padding: '14px 0' }}>
                    <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700 }}>
                      Applied
                    </span>
                  </td>
                  <td style={{ padding: '14px 0', color: '#64748b', fontSize: '0.82rem' }}>14 Oct 2026</td>
                  <td style={{ padding: '14px 0', textAlign: 'right' }}>
                    <Link
                      to="/applications"
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        color: '#2563eb',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textDecoration: 'none',
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>

                {/* Row 5: Google */}
                <tr>
                  <td style={{ padding: '14px 0' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Frontend Engineer</p>
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Full Time • Gurgaon</span>
                  </td>
                  <td style={{ padding: '14px 0' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Google</span>
                  </td>
                  <td style={{ padding: '14px 0' }}>
                    <span style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '3px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 700 }}>
                      Rejected
                    </span>
                  </td>
                  <td style={{ padding: '14px 0', color: '#64748b', fontSize: '0.82rem' }}>12 Oct 2026</td>
                  <td style={{ padding: '14px 0', textAlign: 'right' }}>
                    <Link
                      to="/applications"
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        color: '#2563eb',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textDecoration: 'none',
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RECOMMENDED JOBS FOR YOU */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                Recommended Jobs for You
              </h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                Based on your profile, skills and career preferences
              </p>
            </div>
            <Link
              to="/jobs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#2563eb',
                textDecoration: 'none',
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {/* Job Card 1: Amazon */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '18px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Amazon</span>
                <span style={{ backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                  92% Match
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                Frontend Developer
              </h4>
              <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: '#64748b' }}>
                Bangalore, Karnataka
              </p>
              <p style={{ margin: '0 0 12px', fontSize: '0.82rem', fontWeight: 700, color: '#2563eb' }}>
                ₹8 - 14 LPA <span style={{ fontWeight: 400, color: '#94a3b8' }}>• Full Time</span>
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>React</span>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>JavaScript</span>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>HTML</span>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>+2</span>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <Link
                  to="/jobs"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                  }}
                >
                  Apply Now
                </Link>
                <button
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  <Bookmark size={15} />
                </button>
              </div>
            </div>

            {/* Job Card 2: Microsoft */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '18px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Microsoft</span>
                <span style={{ backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                  88% Match
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                Software Engineer
              </h4>
              <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: '#64748b' }}>
                Hyderabad, Telangana
              </p>
              <p style={{ margin: '0 0 12px', fontSize: '0.82rem', fontWeight: 700, color: '#2563eb' }}>
                ₹12 - 20 LPA <span style={{ fontWeight: 400, color: '#94a3b8' }}>• Hybrid</span>
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>React</span>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>TypeScript</span>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>Azure</span>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>+2</span>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <Link
                  to="/jobs"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                  }}
                >
                  Apply Now
                </Link>
                <button
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  <Bookmark size={15} />
                </button>
              </div>
            </div>

            {/* Job Card 3: Google */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '18px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Google</span>
                <span style={{ backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                  84% Match
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                React Developer
              </h4>
              <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: '#64748b' }}>
                Pune, Maharashtra
              </p>
              <p style={{ margin: '0 0 12px', fontSize: '0.82rem', fontWeight: 700, color: '#2563eb' }}>
                ₹10 - 18 LPA <span style={{ fontWeight: 400, color: '#94a3b8' }}>• Full Time</span>
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>React</span>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>Next.js</span>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>Firebase</span>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>+2</span>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <Link
                  to="/jobs"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                  }}
                >
                  Apply Now
                </Link>
                <button
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  <Bookmark size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          RIGHT COLUMN (SERVICES & COMPLETE PROFILE)
          ======================================================== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* 1. COMPLETE YOUR PROFILE */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }}>
            Complete Your Profile
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            {/* Circular Gauge */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'conic-gradient(#10b981 0% 80%, #e2e8f0 80% 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: '#0f172a',
                }}
              >
                80%
              </div>
            </div>

            <div>
              <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}>
                Your profile is 80% complete
              </p>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b', lineHeight: 1.3 }}>
                Add skills, experience and resume to get better job recommendations.
              </p>
            </div>
          </div>

          <Link
            to="/profile/edit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              padding: '9px 14px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.84rem',
              textDecoration: 'none',
              boxSizing: 'border-box',
            }}
          >
            Complete Profile <ArrowRight size={14} />
          </Link>
        </div>

        {/* 2. ATS RESUME BUILDER (₹50) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} color="#f59e0b" fill="#f59e0b" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                ATS Resume Builder (₹50)
              </h3>
            </div>
            <span style={{ backgroundColor: '#fef2f2', color: '#ef4444', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
              Popular
            </span>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 12px', lineHeight: 1.35 }}>
            Build an ATS-friendly resume with AI and get matched with top companies.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#334155' }}>
              <CheckCircle2 size={13} color="#16a34a" />
              <span>ATS Score Analysis</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#334155' }}>
              <CheckCircle2 size={13} color="#16a34a" />
              <span>Actionable Suggestions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#334155' }}>
              <CheckCircle2 size={13} color="#16a34a" />
              <span>Job Match Recommendations</span>
            </div>
          </div>

          <Link
            to="/resume-builder"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              padding: '9px 14px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.84rem',
              textDecoration: 'none',
              boxSizing: 'border-box',
            }}
          >
            Build Resume Now <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3. INTERVIEW ASSISTANCE (₹100) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={16} color="#ef4444" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                Interview Assistance (₹100)
              </h3>
            </div>
            <span style={{ backgroundColor: '#fef2f2', color: '#ef4444', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
              New
            </span>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 12px', lineHeight: 1.35 }}>
            Get interview scheduling assistance with verified employers.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#334155' }}>
              <CheckCircle2 size={13} color="#16a34a" />
              <span>Priority Interview Scheduling</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#334155' }}>
              <CheckCircle2 size={13} color="#16a34a" />
              <span>Verified Hiring Partners</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#334155' }}>
              <CheckCircle2 size={13} color="#16a34a" />
              <span>Real-time Updates</span>
            </div>
          </div>

          <Link
            to="/interview-assistance"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              padding: '9px 14px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.84rem',
              textDecoration: 'none',
              boxSizing: 'border-box',
            }}
          >
            Get Interview Assistance <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4. TRENDING SKILLS */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
              Trending Skills
            </h3>
            <Link to="/profile/edit" style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Update Skills →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* React.js */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                <span>React.js</span>
                <span style={{ color: '#2563eb' }}>90%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', backgroundColor: '#2563eb', borderRadius: '4px' }} />
              </div>
            </div>

            {/* JavaScript */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                <span>JavaScript</span>
                <span style={{ color: '#2563eb' }}>85%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', backgroundColor: '#2563eb', borderRadius: '4px' }} />
              </div>
            </div>

            {/* TypeScript */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                <span>TypeScript</span>
                <span style={{ color: '#2563eb' }}>70%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', backgroundColor: '#2563eb', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Node.js */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                <span>Node.js</span>
                <span style={{ color: '#2563eb' }}>65%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', backgroundColor: '#2563eb', borderRadius: '4px' }} />
              </div>
            </div>

            {/* HTML & CSS */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                <span>HTML & CSS</span>
                <span style={{ color: '#2563eb' }}>60%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', backgroundColor: '#2563eb', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
