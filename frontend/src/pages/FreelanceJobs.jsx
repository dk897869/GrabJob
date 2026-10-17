import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layers, IndianRupee, Clock, CheckCircle, Search, Laptop, ShieldCheck } from 'lucide-react';
import { freelanceService } from '../services/freelanceService';
import { SkeletonJobCard, EmptyState } from '../components/common/Loading';
import toast from 'react-hot-toast';

export default function FreelanceJobs() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(true);

  const categories = [
    'All',
    'Development',
    'Design',
    'Writing',
    'Marketing',
    'Data',
    'Video',
    'Customer Support',
    'Virtual Assistant',
    'Other',
  ];

  const { data, isLoading } = useQuery({
    queryKey: ['freelance', selectedCategory, search, remoteOnly],
    queryFn: () =>
      freelanceService.getFreelanceJobs({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: search || undefined,
        isRemote: remoteOnly ? 'true' : undefined,
      }),
  });

  const projects = data?.data || [];

  const handleApplyProposal = (project) => {
    toast.success(`Proposal started for "${project.title}". Connect with client directly!`);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '30px 0 60px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Laptop size={12} /> FREELANCE & CONTRACT GIGS
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '8px' }}>
            Freelance & Remote Projects
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748b' }}>
            Find high-paying Indian & global freelance contracts, hourly gigs, and fixed-price milestones
          </p>
        </div>

        {/* Search & Categories */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div className="search-field" style={{ flex: 1, minWidth: '240px' }}>
              <Search size={18} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search freelance projects by skill or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer', padding: '0 12px' }}>
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
              />
              <span style={{ fontWeight: 600 }}>100% Remote Only</span>
            </label>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: `1px solid ${selectedCategory === cat ? 'var(--primary)' : '#e2e8f0'}`,
                  background: selectedCategory === cat ? 'var(--primary)' : '#ffffff',
                  color: selectedCategory === cat ? '#ffffff' : '#475569',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            <SkeletonJobCard />
            <SkeletonJobCard />
            <SkeletonJobCard />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No freelance projects found in this category"
            description="Try changing the category or search keywords."
            onReset={() => {
              setSelectedCategory('All');
              setSearch('');
            }}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {projects.map((proj) => (
              <div
                key={proj._id}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '3px 8px', borderRadius: '4px' }}>
                      {proj.category}
                    </span>
                    {proj.isVerified && (
                      <span className="badge badge-verified">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '6px' }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#475569', fontWeight: 500 }}>
                    Client: {proj.client}
                  </p>

                  <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5', margin: '10px 0' }}>
                    {proj.description}
                  </p>

                  {/* Skills */}
                  {proj.skills && proj.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '12px 0' }}>
                      {proj.skills.map((s, idx) => (
                        <span key={idx} className="skill-tag">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta info */}
                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
                    <span>⏳ {proj.duration || '2-4 Weeks'}</span>
                    <span>📍 {proj.isRemote ? 'Remote (India)' : proj.location}</span>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', marginTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Estimated Budget</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16a34a' }}>
                      {proj.budget}
                    </span>
                  </div>

                  <button
                    onClick={() => handleApplyProposal(proj)}
                    className="btn btn-primary btn-sm"
                  >
                    Submit Proposal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
