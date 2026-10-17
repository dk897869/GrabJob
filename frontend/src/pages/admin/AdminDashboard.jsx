import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Calendar, Layers, CreditCard, UserCheck, FileCheck, IndianRupee, ArrowUpRight } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/Loading';
import PaymentStatusBadge from '../../components/payments/PaymentStatus';
import { formatDate } from '../../utils/formatters';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getDashboardStats(),
  });

  if (isLoading) return <LoadingSpinner message="Loading administrator metrics..." />;

  const stats = data?.data?.stats || {};
  const jobsByCity = data?.data?.jobsByCity || [];
  const recentPayments = data?.data?.recentPayments || [];

  return (
    <div>
      {/* Top Welcome */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>
          Platform Operations Dashboard
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
          Real-time metrics on candidate registrations, job postings, payments, and interview requests
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>Total Users</span>
            <Users size={18} color="#60a5fa" />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            {stats.totalUsers?.toLocaleString('en-IN') || 0}
          </span>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>Active Jobs</span>
            <Briefcase size={18} color="#34d399" />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            {stats.activeJobs?.toLocaleString('en-IN') || 0}
          </span>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>Walk-in Drives</span>
            <Calendar size={18} color="#f87171" />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            {stats.walkinJobs?.toLocaleString('en-IN') || 0}
          </span>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>Total Revenue</span>
            <IndianRupee size={18} color="#fbbf24" />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>
            ₹{stats.totalRevenue?.toLocaleString('en-IN') || 0}
          </span>
        </div>
      </div>

      {/* Breakdown Row: Jobs by City + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px', marginBottom: '32px' }}>
        {/* Jobs by City */}
        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
            Jobs by Major City
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {jobsByCity.map((item) => (
              <div key={item.city}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  <span>{item.city}</span>
                  <span style={{ fontWeight: 700 }}>{item.count} jobs</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#334155', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.min(100, item.count * 15)}%`,
                      height: '100%',
                      background: '#3b82f6',
                      borderRadius: '9999px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Recent Transactions</h3>
            <Link to="/admin/payments" style={{ fontSize: '0.82rem', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentPayments.map((p) => (
              <div
                key={p._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                }}
              >
                <div>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                    {p.user?.name || 'Candidate'}
                  </h5>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {p.serviceType === 'interview_assistance' ? 'Interview Assist (₹100)' : 'ATS Resume (₹50)'} • {formatDate(p.createdAt)}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', display: 'block' }}>
                    ₹{p.amount}
                  </span>
                  <PaymentStatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
