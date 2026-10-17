import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layers, Plus, ExternalLink } from 'lucide-react';
import { freelanceService } from '../../services/freelanceService';
import { LoadingSpinner } from '../../components/common/Loading';

export default function AdminFreelance() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-freelance'],
    queryFn: () => freelanceService.getFreelanceJobs({ limit: 50 }),
  });

  const projects = data?.data || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>Freelance Projects Manager</h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Monitor freelance contracts, categories, and budgets</p>
        </div>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        {isLoading ? (
          <LoadingSpinner message="Loading freelance projects..." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '14px 18px' }}>Project Title</th>
                <th style={{ padding: '14px 18px' }}>Client</th>
                <th style={{ padding: '14px 18px' }}>Category</th>
                <th style={{ padding: '14px 18px' }}>Budget</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid #334155', color: '#cbd5e1' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 600, color: '#ffffff' }}>{p.title}</td>
                  <td style={{ padding: '14px 18px' }}>{p.client}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ background: '#0f172a', padding: '2px 8px', borderRadius: '4px' }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#34d399', fontWeight: 700 }}>{p.budget}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ background: '#065f46', color: '#a7f3d0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                      ACTIVE
                    </span>
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
