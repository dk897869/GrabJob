import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Navigation } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { LoadingSpinner } from '../../components/common/Loading';

export default function AdminWalkins() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-walkins'],
    queryFn: () => jobService.getWalkinJobs({}),
  });

  const walkins = data?.data || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>Walk-in Interviews Manager</h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Audit spot hiring drives and venue details</p>
        </div>
        <Link to="/admin/jobs/create" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Add Walk-in Drive
        </Link>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        {isLoading ? (
          <LoadingSpinner message="Loading walk-in events..." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '14px 18px' }}>Drive Title</th>
                <th style={{ padding: '14px 18px' }}>Company</th>
                <th style={{ padding: '14px 18px' }}>City</th>
                <th style={{ padding: '14px 18px' }}>Date & Timing</th>
                <th style={{ padding: '14px 18px' }}>Venue Address</th>
              </tr>
            </thead>
            <tbody>
              {walkins.map((w) => (
                <tr key={w._id} style={{ borderBottom: '1px solid #334155', color: '#cbd5e1' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 600, color: '#ffffff' }}>{w.title}</td>
                  <td style={{ padding: '14px 18px' }}>{w.company}</td>
                  <td style={{ padding: '14px 18px' }}>{w.city}</td>
                  <td style={{ padding: '14px 18px', color: '#f87171', fontWeight: 600 }}>
                    {w.walkinDateDisplay || 'Upcoming'} ({w.walkinStartTime || '10:00 AM'} - {w.walkinEndTime || '4:00 PM'})
                  </td>
                  <td style={{ padding: '14px 18px' }}>{w.walkinVenue || w.address || w.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
