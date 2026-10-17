import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Clock,
  Check,
  X,
  MessageSquare,
  ShieldAlert,
  Search,
  ExternalLink,
  Briefcase,
  MapPin,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import networkService from '../services/networkService';

export default function Network() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('suggestions'); // 'suggestions' | 'invitations' | 'connections'
  const [searchQuery, setSearchQuery] = useState('');

  // Queries
  const { data: pendingData, isLoading: loadingPending } = useQuery({
    queryKey: ['pendingConnections'],
    queryFn: () => networkService.getPendingRequests(),
  });

  const { data: connectionsData, isLoading: loadingConnections } = useQuery({
    queryKey: ['myConnections'],
    queryFn: () => networkService.getMyConnections(),
  });

  const { data: suggestionsData, isLoading: loadingSuggestions } = useQuery({
    queryKey: ['suggestedConnections'],
    queryFn: () => networkService.getSuggestedConnections(),
  });

  // Mutations
  const sendRequestMutation = useMutation({
    mutationFn: ({ userId }) => networkService.sendConnectionRequest(userId),
    onSuccess: (data) => {
      toast.success(data.message || 'Connection request sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['suggestedConnections'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to send connection request');
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (connectionId) => networkService.acceptConnectionRequest(connectionId),
    onSuccess: () => {
      toast.success('Connection request accepted!');
      queryClient.invalidateQueries({ queryKey: ['pendingConnections'] });
      queryClient.invalidateQueries({ queryKey: ['myConnections'] });
      queryClient.invalidateQueries({ queryKey: ['suggestedConnections'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to accept invitation');
    },
  });

  const declineMutation = useMutation({
    mutationFn: (connectionId) => networkService.declineConnectionRequest(connectionId),
    onSuccess: () => {
      toast.info('Invitation declined');
      queryClient.invalidateQueries({ queryKey: ['pendingConnections'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to decline');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (connectionId) => networkService.removeConnection(connectionId),
    onSuccess: () => {
      toast.success('Connection removed');
      queryClient.invalidateQueries({ queryKey: ['myConnections'] });
      queryClient.invalidateQueries({ queryKey: ['suggestedConnections'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to remove connection');
    },
  });

  const blockMutation = useMutation({
    mutationFn: (userId) => networkService.blockUser(userId),
    onSuccess: () => {
      toast.success('User blocked');
      queryClient.invalidateQueries({ queryKey: ['myConnections'] });
      queryClient.invalidateQueries({ queryKey: ['suggestedConnections'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to block user');
    },
  });

  const pendingList = pendingData?.invitations || [];
  const connectionsList = connectionsData?.connections || [];
  const suggestionsList = suggestionsData?.suggestions || [];

  const filteredConnections = connectionsList.filter((conn) => {
    const name = conn.connectedUser?.name?.toLowerCase() || '';
    const headline = conn.connectedUser?.headline?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return name.includes(q) || headline.includes(q);
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '88vh', padding: '32px 0 64px' }}>
      <div className="container" style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* Page Header */}
        <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>
              My Professional Network
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
              Grow your career connections, find peers and recruiters across India, and collaborate.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              to="/messages"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
              }}
            >
              <MessageSquare size={18} /> Direct Messages
            </Link>
          </div>
        </div>

        {/* Grid Layout: Left Sidebar + Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Left Column: Network Stats & Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  height: '60px',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                  position: 'relative',
                }}
              />
              <div style={{ padding: '0 16px 20px', textAlign: 'center', marginTop: '-32px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '3px solid #ffffff',
                    color: '#2563eb',
                    fontWeight: '700',
                    fontSize: '1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    background: '#eff6ff',
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>
                  {user?.name || 'Professional'}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px', lineHeight: 1.3 }}>
                  {user?.headline || 'GrabJob Member • Ready for new career opportunities'}
                </p>

                <div
                  style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    textAlign: 'left',
                  }}
                >
                  <button
                    onClick={() => setActiveTab('connections')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: activeTab === 'connections' ? '600' : '400',
                      color: activeTab === 'connections' ? '#2563eb' : '#334155',
                      backgroundColor: activeTab === 'connections' ? '#eff6ff' : 'transparent',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={16} /> My Connections
                    </span>
                    <span style={{ fontWeight: '700', color: '#2563eb' }}>
                      {connectionsList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('invitations')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: activeTab === 'invitations' ? '600' : '400',
                      color: activeTab === 'invitations' ? '#2563eb' : '#334155',
                      backgroundColor: activeTab === 'invitations' ? '#eff6ff' : 'transparent',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} /> Pending Invitations
                    </span>
                    {pendingList.length > 0 && (
                      <span
                        style={{
                          backgroundColor: '#ef4444',
                          color: '#fff',
                          borderRadius: '12px',
                          padding: '1px 8px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                        }}
                      >
                        {pendingList.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('suggestions')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: activeTab === 'suggestions' ? '600' : '400',
                      color: activeTab === 'suggestions' ? '#2563eb' : '#334155',
                      backgroundColor: activeTab === 'suggestions' ? '#eff6ff' : 'transparent',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <UserPlus size={16} /> Discover People
                    </span>
                    <Sparkles size={14} color="#f59e0b" />
                  </button>
                </div>
              </div>
            </div>

            {/* LinkedIn Verification & Fast Sync Badge */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '16px',
                fontSize: '0.82rem',
                color: '#475569',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', color: '#0f172a' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                5-Min Job Sync Engine
              </div>
              <p style={{ margin: 0, lineHeight: 1.4, color: '#64748b' }}>
                GrabJob is synchronized with LinkedIn, Indeed, and Naukri syndication feeds every 5 minutes.
              </p>
            </div>
          </div>

          {/* Right Column: Tab View */}
          <div>
            {/* PENDING INVITATIONS BANNER (if any and not currently on invitations tab) */}
            {pendingList.length > 0 && activeTab !== 'invitations' && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #fed7aa',
                  padding: '16px 20px',
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'linear-gradient(90deg, #fffbeb 0%, #ffffff 100%)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#92400e' }}>
                      You have {pendingList.length} connection invitation{pendingList.length > 1 ? 's' : ''} waiting!
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#b45309' }}>
                      Review and accept them to unlock 1-on-1 direct chat and resume sharing.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('invitations')}
                  style={{
                    backgroundColor: '#d97706',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Manage
                </button>
              </div>
            )}

            {/* TAB 1: PENDING INVITATIONS */}
            {activeTab === 'invitations' && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                    Invitations ({pendingList.length})
                  </h2>
                </div>

                {loadingPending ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    Loading invitations...
                  </div>
                ) : pendingList.length === 0 ? (
                  <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                      }}
                    >
                      <UserCheck size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#1e293b', margin: '0 0 6px' }}>
                      No pending invitations
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 16px' }}>
                      Discover professionals in your domain and expand your reach.
                    </p>
                    <button
                      onClick={() => setActiveTab('suggestions')}
                      style={{
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 18px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                      }}
                    >
                      Discover People
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {pendingList.map((inv) => (
                      <div
                        key={inv._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px',
                          border: '1px solid #f1f5f9',
                          borderRadius: '10px',
                          backgroundColor: '#fafaf9',
                          gap: '16px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div
                            style={{
                              width: '52px',
                              height: '52px',
                              borderRadius: '50%',
                              backgroundColor: '#2563eb',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '1.2rem',
                              flexShrink: 0,
                            }}
                          >
                            {inv.requester?.name?.charAt(0)?.toUpperCase() || 'P'}
                          </div>
                          <div>
                            <Link
                              to={`/profile/${inv.requester?._id}`}
                              style={{
                                fontWeight: '700',
                                color: '#0f172a',
                                fontSize: '1rem',
                                textDecoration: 'none',
                              }}
                            >
                              {inv.requester?.name}
                            </Link>
                            <p style={{ margin: '2px 0 4px', fontSize: '0.84rem', color: '#475569' }}>
                              {inv.requester?.headline || 'GrabJob Professional'}
                            </p>
                            {inv.note && (
                              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                                "{inv.note}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => declineMutation.mutate(inv._id)}
                            disabled={declineMutation.isPending}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#ffffff',
                              color: '#475569',
                              fontWeight: '600',
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                            }}
                          >
                            Ignore
                          </button>
                          <button
                            onClick={() => acceptMutation.mutate(inv._id)}
                            disabled={acceptMutation.isPending}
                            style={{
                              padding: '8px 18px',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: '#2563eb',
                              color: '#ffffff',
                              fontWeight: '600',
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <Check size={16} /> Accept
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MY CONNECTIONS */}
            {activeTab === 'connections' && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                    My Connections ({connectionsList.length})
                  </h2>

                  <div style={{ position: 'relative', width: '260px' }}>
                    <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                    <input
                      type="text"
                      placeholder="Search connections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 34px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {loadingConnections ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    Loading connections...
                  </div>
                ) : filteredConnections.length === 0 ? (
                  <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <Users size={32} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#1e293b', margin: '0 0 6px' }}>
                      No connections found
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 16px' }}>
                      {searchQuery ? 'Try matching a different name or skill' : 'Start connecting with peers and recruiters to build your network.'}
                    </p>
                    <button
                      onClick={() => setActiveTab('suggestions')}
                      style={{
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 18px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                      }}
                    >
                      Find Connections
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {filteredConnections.map((conn) => {
                      const cUser = conn.connectedUser;
                      return (
                        <div
                          key={conn._id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px',
                            border: '1px solid #f1f5f9',
                            borderRadius: '10px',
                            backgroundColor: '#ffffff',
                            gap: '16px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div
                              style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                backgroundColor: '#2563eb',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '1.2rem',
                                flexShrink: 0,
                              }}
                            >
                              {cUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <Link
                                to={`/profile/${cUser?._id}`}
                                style={{
                                  fontWeight: '700',
                                  color: '#0f172a',
                                  fontSize: '0.98rem',
                                  textDecoration: 'none',
                                }}
                              >
                                {cUser?.name}
                              </Link>
                              <p style={{ margin: '2px 0 2px', fontSize: '0.84rem', color: '#475569' }}>
                                {cUser?.headline || `${cUser?.company || 'Company'} • Professional`}
                              </p>
                              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                                Connected {new Date(conn.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              onClick={() => navigate(`/messages?userId=${cUser?._id}`)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: '1px solid #2563eb',
                                backgroundColor: '#eff6ff',
                                color: '#2563eb',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                              }}
                            >
                              <MessageSquare size={16} /> Message
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Remove ${cUser?.name} from your connections?`)) {
                                  removeMutation.mutate(conn._id);
                                }
                              }}
                              title="Remove connection"
                              style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#ffffff',
                                color: '#64748b',
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                              }}
                            >
                              Remove
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Block ${cUser?.name}? You will no longer be able to message or view each other.`)) {
                                  blockMutation.mutate(cUser?._id);
                                }
                              }}
                              title="Block user"
                              style={{
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid #fecaca',
                                backgroundColor: '#fff',
                                color: '#dc2626',
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                              }}
                            >
                              <ShieldAlert size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: DISCOVER PEOPLE / SUGGESTIONS */}
            {activeTab === 'suggestions' && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>
                      People You May Know
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
                      Based on your industry, job preferences, and mutual peers in India
                    </p>
                  </div>
                </div>

                {loadingSuggestions ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    Loading recommendations...
                  </div>
                ) : suggestionsList.length === 0 ? (
                  <div style={{ padding: '50px 20px', textAlign: 'center', color: '#64748b' }}>
                    No new suggestions right now. Check back as new professionals join!
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    {suggestionsList.map((person) => (
                      <div
                        key={person._id}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          flexDirection: 'column',
                          textAlign: 'center',
                          position: 'relative',
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        }}
                      >
                        {/* Background Banner */}
                        <div
                          style={{
                            height: '52px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          }}
                        />

                        {/* Avatar */}
                        <div style={{ marginTop: '-28px', display: 'flex', justifyContent: 'center' }}>
                          <div
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '50%',
                              backgroundColor: '#ffffff',
                              border: '3px solid #ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#2563eb',
                              fontWeight: '700',
                              fontSize: '1.3rem',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              background: '#eff6ff',
                            }}
                          >
                            {person.name?.charAt(0)?.toUpperCase() || 'P'}
                          </div>
                        </div>

                        {/* Card Info */}
                        <div style={{ padding: '12px 14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <Link
                            to={`/profile/${person._id}`}
                            style={{
                              fontWeight: '700',
                              fontSize: '0.96rem',
                              color: '#0f172a',
                              textDecoration: 'none',
                              margin: '0 0 4px',
                            }}
                          >
                            {person.name}
                          </Link>

                          <p
                            style={{
                              fontSize: '0.8rem',
                              color: '#475569',
                              margin: '0 0 8px',
                              height: '32px',
                              overflow: 'hidden',
                              lineHeight: 1.25,
                            }}
                          >
                            {person.headline || `${person.company || 'Tech Company'} • Professional`}
                          </p>

                          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <Users size={12} /> {person.connectionsCount || 0} connections
                          </p>

                          <div style={{ marginTop: 'auto' }}>
                            {person.connectionStatus === 'pending' ? (
                              <button
                                disabled
                                style={{
                                  width: '100%',
                                  padding: '7px 0',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  backgroundColor: '#f1f5f9',
                                  color: '#64748b',
                                  fontSize: '0.82rem',
                                  fontWeight: '600',
                                  cursor: 'not-allowed',
                                }}
                              >
                                Pending
                              </button>
                            ) : (
                              <button
                                onClick={() => sendRequestMutation.mutate({ userId: person._id })}
                                disabled={sendRequestMutation.isPending}
                                style={{
                                  width: '100%',
                                  padding: '7px 0',
                                  borderRadius: '6px',
                                  border: '1px solid #2563eb',
                                  backgroundColor: '#eff6ff',
                                  color: '#2563eb',
                                  fontSize: '0.84rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                }}
                              >
                                <UserPlus size={15} /> Connect
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
