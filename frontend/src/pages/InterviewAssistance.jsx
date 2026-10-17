import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarCheck, ShieldCheck, CheckCircle2, Clock, IndianRupee, AlertCircle, ArrowRight } from 'lucide-react';
import { interviewService } from '../services/interviewService';
import { useJobs } from '../hooks/useJobs';
import { useUiStore } from '../store/uiStore';
import { LoadingSpinner } from '../components/common/Loading';
import Button from '../components/common/Button';

export default function InterviewAssistance() {
  const { jobId } = useParams();
  const { openPaymentModal } = useUiStore();

  const { data: myInterviewsData, isLoading: interviewsLoading, refetch } = useQuery({
    queryKey: ['my-interviews'],
    queryFn: () => interviewService.getMyInterviews(),
  });

  const { data: jobsData } = useJobs({ limit: 10 });

  const [selectedJob, setSelectedJob] = useState(null);

  const handleBook = (job) => {
    openPaymentModal({
      serviceType: 'interview_assistance',
      jobId: job._id,
      jobTitle: `${job.title} at ${job.company}`,
      amount: 100,
    });
  };

  const myInterviews = myInterviewsData?.data || [];
  const eligibleJobs = jobsData?.data || [];

  return (
    <div>
      {/* Service Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '36px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ maxWidth: '580px' }}>
          <span
            style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '12px',
            }}
          >
            <ShieldCheck size={14} /> COORDINATION SERVICE
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '6px 0 12px' }}>
            Interview Assistance (₹100)
          </h1>
          <p style={{ fontSize: '0.94rem', opacity: 0.9, lineHeight: '1.6' }}>
            GrabJob Interview Assistance helps coordinate interview scheduling for eligible jobs. It does not guarantee employment or hiring decisions.
          </p>
        </div>

        <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.1)', padding: '20px 28px', borderRadius: '12px' }}>
          <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#60a5fa' }}>₹100</span>
          <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Per eligible opening</p>
        </div>
      </div>

      {/* How it Works 4-Step Ribbon */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '18px' }}>
          How Coordination Works
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{ fontSize: '0.86rem', color: '#334155' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>1. Select Job</span>
            Choose an eligible verified position you qualify for.
          </div>
          <div style={{ fontSize: '0.86rem', color: '#334155' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>2. Pay ₹100</span>
            Secure checkout via UPI or Card on Razorpay.
          </div>
          <div style={{ fontSize: '0.86rem', color: '#334155' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>3. Verification</span>
            Our recruitment coordinator connects with hiring HR.
          </div>
          <div style={{ fontSize: '0.86rem', color: '#334155' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>4. Confirmed Link</span>
            Receive scheduled date, time, & meeting link via email.
          </div>
        </div>
      </div>

      {/* Active Requests List */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '16px' }}>
          Your Interview Assistance Requests
        </h3>

        {interviewsLoading ? (
          <LoadingSpinner message="Checking interview requests..." />
        ) : myInterviews.length === 0 ? (
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1', padding: '30px', textAlign: 'center', color: '#64748b' }}>
            <p>You haven't requested interview coordination for any jobs yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {myInterviews.map((req) => (
              <div
                key={req._id}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--secondary)' }}>
                    {req.job?.title || 'Target Job Position'}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#475569' }}>
                    {req.job?.company} • 📍 {req.job?.city}
                  </p>

                  {/* If Scheduled Details Exist */}
                  {req.status === 'SCHEDULED' && req.scheduledDetails && (
                    <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', marginTop: '10px', fontSize: '0.84rem', color: '#166534' }}>
                      <p><strong>Scheduled:</strong> {req.scheduledDetails.dateDisplay} at {req.scheduledDetails.time}</p>
                      <p><strong>Mode:</strong> {req.scheduledDetails.mode}</p>
                      {req.scheduledDetails.meetingLink && (
                        <p><strong>Link:</strong> <a href={req.scheduledDetails.meetingLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{req.scheduledDetails.meetingLink}</a></p>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background:
                        req.status === 'SCHEDULED'
                          ? '#dcfce7'
                          : req.status === 'PAID'
                          ? '#fef3c7'
                          : '#eff6ff',
                      color:
                        req.status === 'SCHEDULED'
                          ? '#15803d'
                          : req.status === 'PAID'
                          ? '#b45309'
                          : '#2563eb',
                    }}
                  >
                    {req.status === 'PAID' ? 'Request in Verification' : req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Select an Eligible Opening to Request Assistance */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '16px' }}>
          Select an Eligible Job for Assistance (₹100)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {eligibleJobs.slice(0, 6).map((job) => (
            <div
              key={job._id}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--secondary)' }}>{job.title}</h4>
                <p style={{ fontSize: '0.86rem', color: '#475569' }}>{job.company} • {job.city}</p>
                <div style={{ display: 'flex', gap: '6px', margin: '10px 0' }}>
                  <span className="badge badge-verified">Eligible for Coordination</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>₹100</span>
                <button onClick={() => handleBook(job)} className="btn btn-primary btn-sm">
                  Request Assistance
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
