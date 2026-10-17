import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { LoadingSpinner, EmptyState } from '../components/common/Loading';
import { formatDate } from '../utils/formatters';

export default function MyApplications() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationService.getMyApplications(),
  });

  const applications = data?.data || [];

  const stages = ['Applied', 'Under Review', 'Shortlisted', 'Interview'];

  const getStageIndex = (status) => {
    switch (status) {
      case 'Applied': return 0;
      case 'Under Review': return 1;
      case 'Shortlisted': return 2;
      case 'Interview': return 3;
      default: return 0;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>
          My Job Applications
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Track the status and timeline of your submitted job applications
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading your applications..." />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications submitted yet"
          description="Browse thousands of active verified job openings across India and apply directly."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {applications.map((app) => {
            const currentStage = getStageIndex(app.status);

            return (
              <div
                key={app._id}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <Link to={`/jobs/${app.job?._id}`}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '4px' }}>
                        {app.job?.title || 'Job Opening'}
                      </h3>
                    </Link>
                    <p style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                      {app.job?.company} • 📍 {app.job?.city}, {app.job?.state}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: app.status === 'Interview' ? '#fef3c7' : '#eff6ff',
                        color: app.status === 'Interview' ? '#b45309' : 'var(--primary)',
                      }}
                    >
                      Status: {app.status}
                    </span>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                      Applied on {formatDate(app.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Timeline UI */}
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    {/* Connecting Bar */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '20px',
                        right: '20px',
                        height: '3px',
                        background: '#e2e8f0',
                        zIndex: 1,
                      }}
                    />

                    {stages.map((stage, idx) => {
                      const isCompleted = idx <= currentStage;
                      const isCurrent = idx === currentStage;

                      return (
                        <div
                          key={stage}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 2,
                          }}
                        >
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: isCompleted ? 'var(--primary)' : '#ffffff',
                              border: `2px solid ${isCompleted ? 'var(--primary)' : '#cbd5e1'}`,
                              color: isCompleted ? '#ffffff' : '#94a3b8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <span
                            style={{
                              fontSize: '0.78rem',
                              marginTop: '6px',
                              fontWeight: isCurrent ? 700 : 500,
                              color: isCurrent ? 'var(--secondary)' : '#64748b',
                            }}
                          >
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
