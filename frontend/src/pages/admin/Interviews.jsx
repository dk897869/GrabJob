import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserCheck, Calendar, Video, Mail, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

export default function AdminInterviews() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-interviews'],
    queryFn: () => adminService.getInterviews({}),
  });

  const interviews = data?.data || [];

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    company: '',
    position: '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM IST',
    mode: 'Online (Google Meet/Zoom)',
    address: '',
    meetingLink: 'https://meet.google.com/xyz-grabjob-interview',
    instructions: 'Please be prepared with your updated resume and portfolio.',
  });
  const [scheduling, setScheduling] = useState(false);

  const openSchedule = (req) => {
    setSelectedRequest(req);
    setScheduleForm({
      company: req.job?.company || '',
      position: req.job?.title || '',
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM IST',
      mode: 'Online (Google Meet/Zoom)',
      address: req.job?.address || '',
      meetingLink: 'https://meet.google.com/xyz-grabjob-interview',
      instructions: 'Please be prepared with your updated resume and portfolio.',
    });
    setScheduleModalOpen(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      setScheduling(true);
      await adminService.scheduleInterview(selectedRequest._id, scheduleForm);
      toast.success('Interview scheduled and email dispatched to candidate!');
      setScheduleModalOpen(false);
      refetch();
    } catch {
      toast.error('Failed to schedule interview');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>Interview Assistance Coordinator</h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Schedule and coordinate candidate interviews with employer hiring teams
          </p>
        </div>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        {isLoading ? (
          <LoadingSpinner message="Loading interview requests..." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '14px 18px' }}>Candidate</th>
                <th style={{ padding: '14px 18px' }}>Target Job</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px' }}>Schedule Details</th>
                <th style={{ padding: '14px 18px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((req) => (
                <tr key={req._id} style={{ borderBottom: '1px solid #334155', color: '#cbd5e1' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{req.candidate?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{req.candidate?.email}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{req.job?.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{req.job?.company} • {req.job?.city}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: req.status === 'SCHEDULED' ? '#065f46' : '#1e3a8a',
                        color: '#ffffff',
                      }}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {req.status === 'SCHEDULED' && req.scheduledDetails ? (
                      <div style={{ fontSize: '0.78rem' }}>
                        <div>📅 {req.scheduledDetails.dateDisplay || req.scheduledDetails.time}</div>
                        <div>🔗 {req.scheduledDetails.mode}</div>
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>Awaiting schedule</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <button
                      onClick={() => openSchedule(req)}
                      className="btn btn-primary btn-sm"
                    >
                      {req.status === 'SCHEDULED' ? 'Reschedule' : 'Schedule Interview'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule Confirmed Interview"
      >
        <form onSubmit={handleScheduleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Company</label>
              <input
                type="text"
                required
                className="form-input"
                value={scheduleForm.company}
                onChange={(e) => setScheduleForm({ ...scheduleForm, company: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Position</label>
              <input
                type="text"
                required
                className="form-input"
                value={scheduleForm.position}
                onChange={(e) => setScheduleForm({ ...scheduleForm, position: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Interview Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={scheduleForm.date}
                onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Interview Time (IST)</label>
              <input
                type="text"
                required
                placeholder="e.g. 11:30 AM IST"
                className="form-input"
                value={scheduleForm.time}
                onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Interview Mode</label>
            <select
              className="form-input"
              value={scheduleForm.mode}
              onChange={(e) => setScheduleForm({ ...scheduleForm, mode: e.target.value })}
            >
              <option value="Online (Google Meet/Zoom)">Online (Google Meet/Zoom)</option>
              <option value="In-Person Venue">In-Person Venue</option>
              <option value="Telephonic">Telephonic</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Meeting Link / Video URL</label>
            <input
              type="url"
              className="form-input"
              value={scheduleForm.meetingLink}
              onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Instructions for Candidate</label>
            <textarea
              rows={3}
              className="form-input"
              value={scheduleForm.instructions}
              onChange={(e) => setScheduleForm({ ...scheduleForm, instructions: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => setScheduleModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" loading={scheduling}>
              Confirm & Dispatch Email
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
