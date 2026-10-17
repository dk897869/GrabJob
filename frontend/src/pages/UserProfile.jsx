import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  UserPlus,
  MessageSquare,
  MapPin,
  Briefcase,
  GraduationCap,
  ExternalLink,
  ShieldAlert,
  Check,
  Clock,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import networkService from '../services/networkService';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [connectNote, setConnectNote] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);

  const isSelf = currentUser?._id?.toString() === id?.toString();

  // 1. Fetch target user profile
  const { data: profileData, isLoading: loadingProfile } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => networkService.getUserProfile(id),
    enabled: Boolean(id),
  });

  // 2. Fetch connection status with target user
  const { data: statusData, isLoading: loadingStatus } = useQuery({
    queryKey: ['connectionStatus', id],
    queryFn: () => networkService.getConnectionStatus(id),
    enabled: Boolean(id) && !isSelf,
  });

  const targetUser = profileData?.user;
  const connectionStatus = statusData?.status || 'none'; // 'none' | 'pending' | 'accepted' | 'blocked'
  const isRequester = statusData?.isRequester;
  const connectionId = statusData?.connectionId;

  // Mutations
  const sendRequestMutation = useMutation({
    mutationFn: () => networkService.sendConnectionRequest(id, connectNote),
    onSuccess: (data) => {
      toast.success(data.message || 'Connection request sent successfully!');
      setShowNoteModal(false);
      queryClient.invalidateQueries({ queryKey: ['connectionStatus', id] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to send request');
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => networkService.acceptConnectionRequest(connectionId),
    onSuccess: () => {
      toast.success('Connection accepted!');
      queryClient.invalidateQueries({ queryKey: ['connectionStatus', id] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to accept');
    },
  });

  const blockMutation = useMutation({
    mutationFn: () => networkService.blockUser(id),
    onSuccess: () => {
      toast.success('User has been blocked.');
      queryClient.invalidateQueries({ queryKey: ['connectionStatus', id] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to block user');
    },
  });

  if (loadingProfile) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '80vh', padding: '60px 0', textAlign: 'center' }}>
        <p style={{ color: '#64748b' }}>Loading professional profile...</p>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '80vh', padding: '60px 0', textAlign: 'center' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '12px' }}>User Not Found</h2>
        <Link to="/network" style={{ color: '#2563eb', fontWeight: '600' }}>
          Back to Network
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '88vh', padding: '32px 0 64px' }}>
      <div className="container" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '0.88rem',
            marginBottom: '16px',
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Profile Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginBottom: '24px',
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              height: '140px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
            }}
          />

          {/* Profile Details Bar */}
          <div style={{ padding: '0 32px 32px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-60px', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
              {/* Avatar */}
              <div
                style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '4px solid #ffffff',
                  color: '#2563eb',
                  fontWeight: '700',
                  fontSize: '2.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  background: '#eff6ff',
                }}
              >
                {targetUser.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {isSelf ? (
                  <Link
                    to="/profile/edit"
                    style={{
                      padding: '9px 20px',
                      borderRadius: '8px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                    }}
                  >
                    Edit My Profile
                  </Link>
                ) : (
                  <>
                    {connectionStatus === 'accepted' ? (
                      <>
                        <button
                          onClick={() => navigate(`/messages?userId=${targetUser._id}`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '9px 20px',
                            borderRadius: '8px',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <MessageSquare size={16} /> Direct Message
                        </button>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            backgroundColor: '#ecfdf5',
                            color: '#059669',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                          }}
                        >
                          <Check size={16} /> Connected
                        </span>
                      </>
                    ) : connectionStatus === 'pending' ? (
                      isRequester ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '9px 18px',
                            borderRadius: '8px',
                            backgroundColor: '#f1f5f9',
                            color: '#64748b',
                            fontSize: '0.88rem',
                            fontWeight: '600',
                          }}
                        >
                          <Clock size={16} /> Request Pending
                        </span>
                      ) : (
                        <button
                          onClick={() => acceptMutation.mutate()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '9px 20px',
                            borderRadius: '8px',
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <Check size={16} /> Accept Invitation
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => setShowNoteModal(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '9px 22px',
                          borderRadius: '8px',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
                        }}
                      >
                        <UserPlus size={16} /> Connect
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`Block ${targetUser.name}?`)) {
                          blockMutation.mutate();
                        }
                      }}
                      title="Block user"
                      style={{
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #fee2e2',
                        backgroundColor: '#fff',
                        color: '#dc2626',
                        cursor: 'pointer',
                      }}
                    >
                      <ShieldAlert size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Name & Headline */}
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
                {targetUser.name}
              </h1>
              <p style={{ fontSize: '1.05rem', color: '#475569', margin: '0 0 10px', lineHeight: 1.4 }}>
                {targetUser.headline || `${targetUser.currentRole || 'Professional'} ${targetUser.company ? `at ${targetUser.company}` : ''}`}
              </p>

              <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center', color: '#64748b', fontSize: '0.88rem' }}>
                {(targetUser.city || targetUser.state) && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={16} /> {targetUser.city ? `${targetUser.city}, ` : ''}{targetUser.state || 'India'}
                  </span>
                )}

                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', fontWeight: '600' }}>
                  <Users size={16} /> {targetUser.connectionsCount || 0} connections
                </span>

                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {targetUser.followersCount || 0} followers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio / About Section */}
        {targetUser.bio && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px 32px',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: '0 0 12px' }}>
              About
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
              {targetUser.bio}
            </p>
          </div>
        )}

        {/* Skills Section */}
        {targetUser.skills && targetUser.skills.length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px 32px',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: '0 0 14px' }}>
              Skills & Endorsements
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {targetUser.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.86rem',
                    fontWeight: '600',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience & Education Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} color="#2563eb" /> Experience
            </h3>
            <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#1e293b' }}>
              {targetUser.currentRole || 'Professional Role'}
            </p>
            <p style={{ margin: '0 0 6px', color: '#64748b', fontSize: '0.88rem' }}>
              {targetUser.company || 'Enterprise'} • {targetUser.experienceYears ? `${targetUser.experienceYears} Years Experience` : 'Experienced'}
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={18} color="#2563eb" /> Education
            </h3>
            <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#1e293b' }}>
              {targetUser.education || 'Graduate Degree'}
            </p>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
              Verified Candidate Profile on GrabJob
            </p>
          </div>
        </div>

        {/* Connect Note Modal */}
        {showNoteModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '16px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                maxWidth: '480px',
                width: '100%',
                padding: '24px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', margin: '0 0 8px' }}>
                Connect with {targetUser.name}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 16px' }}>
                You can add a personalized note to introduce yourself and state how you'd like to collaborate.
              </p>

              <textarea
                rows={3}
                placeholder="Hi, I noticed your profile on GrabJob and would love to connect..."
                value={connectNote}
                onChange={(e) => setConnectNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                  marginBottom: '18px',
                  outline: 'none',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => setShowNoteModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => sendRequestMutation.mutate()}
                  disabled={sendRequestMutation.isPending}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {sendRequestMutation.isPending ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
