import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, ShieldCheck, Search } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/Loading';
import toast from 'react-hot-toast';

export default function AdminJobs() {
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-jobs-list', search],
    queryFn: () => jobService.getJobs({ search, limit: 50 }),
  });

  const jobs = data?.data || [];

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await adminService.deleteJob(id);
        toast.success('Job deleted successfully');
        refetch();
      } catch {
        toast.error('Could not delete job');
      }
    }
  };

  const handleToggleVerify = async (job) => {
    try {
      await adminService.updateJob(job._id, { isVerified: !job.isVerified });
      toast.success(`Job marked as ${!job.isVerified ? 'Verified' : 'Unverified'}`);
      refetch();
    } catch {
      toast.error('Could not update status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>Manage Jobs</h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Create, verify, publish, and audit job listings across India</p>
        </div>
        <Link to="/admin/jobs/create" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Post New Job
        </Link>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        {isLoading ? (
          <LoadingSpinner message="Loading jobs..." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '14px 18px' }}>Title & Company</th>
                <th style={{ padding: '14px 18px' }}>Location</th>
                <th style={{ padding: '14px 18px' }}>Type</th>
                <th style={{ padding: '14px 18px' }}>Walk-in</th>
                <th style={{ padding: '14px 18px' }}>Verified</th>
                <th style={{ padding: '14px 18px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} style={{ borderBottom: '1px solid #334155', color: '#cbd5e1' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{job.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{job.company}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>{job.city}, {job.state}</td>
                  <td style={{ padding: '14px 18px' }}>{job.jobType}</td>
                  <td style={{ padding: '14px 18px' }}>
                    {job.isWalkin ? (
                      <span style={{ background: '#7f1d1d', color: '#fca5a5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                        WALK-IN
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <button
                      onClick={() => handleToggleVerify(job)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: job.isVerified ? '#065f46' : '#334155',
                        color: job.isVerified ? '#a7f3d0' : '#94a3b8',
                      }}
                    >
                      {job.isVerified ? '✓ Verified' : 'Unverified'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        to={`/admin/jobs/${job._id}/edit`}
                        style={{ color: '#60a5fa', padding: '4px' }}
                        title="Edit Job"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id, job.title)}
                        style={{ color: '#f87171', padding: '4px' }}
                        title="Delete Job"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
