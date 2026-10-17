import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users as UsersIcon, Shield, Search } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/Loading';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', search, roleFilter],
    queryFn: () => adminService.getUsers({ search, role: roleFilter !== 'All' ? roleFilter : undefined }),
  });

  const users = data?.data || [];

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      refetch();
    } catch {
      toast.error('Failed to update user role');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>Candidate & Staff Directory</h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Manage registered candidates and assign RBAC staff roles</p>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div className="search-field" style={{ flex: 1, background: '#1e293b', border: '1px solid #334155' }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ color: '#ffffff' }}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            background: '#1e293b',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '0.88rem',
          }}
        >
          <option value="All">All Roles</option>
          <option value="candidate">Candidates</option>
          <option value="staff">Staff</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Users Table */}
      <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        {isLoading ? (
          <LoadingSpinner message="Loading user directory..." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '14px 18px' }}>Name</th>
                <th style={{ padding: '14px 18px' }}>Email</th>
                <th style={{ padding: '14px 18px' }}>Phone</th>
                <th style={{ padding: '14px 18px' }}>City</th>
                <th style={{ padding: '14px 18px' }}>Current Role</th>
                <th style={{ padding: '14px 18px' }}>Assign Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #334155', color: '#cbd5e1' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 600, color: '#ffffff' }}>{u.name}</td>
                  <td style={{ padding: '14px 18px' }}>{u.email}</td>
                  <td style={{ padding: '14px 18px' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '14px 18px' }}>{u.city || '—'}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: u.role === 'admin' ? '#3730a3' : u.role === 'staff' ? '#065f46' : '#1e3a8a',
                        color: '#ffffff',
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      style={{
                        background: '#0f172a',
                        color: '#ffffff',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.8rem',
                      }}
                    >
                      <option value="candidate">Candidate</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
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
