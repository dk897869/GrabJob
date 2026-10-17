import React, { useState } from 'react';
import { Calendar, MapPin, Navigation, Clock, Search, Map as MapIcon, List } from 'lucide-react';
import { useWalkinJobs } from '../hooks/useJobs';
import { TOP_CITIES } from '../utils/constants';
import { formatSalary } from '../utils/formatters';
import { SkeletonJobCard, EmptyState } from '../components/common/Loading';
import JobMap from '../components/map/JobMap';
import { Link } from 'react-router-dom';

export default function WalkinJobs() {
  const [timeframe, setTimeframe] = useState('all'); // 'today', 'tomorrow', 'week', 'all'
  const [city, setCity] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  const { data, isLoading } = useWalkinJobs({
    timeframe: timeframe !== 'all' ? timeframe : undefined,
    city: city && city !== 'All India' ? city : undefined,
  });

  const walkins = data?.data || [];

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '30px 0 60px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-walkin">IMMEDIATE HIRING</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '8px' }}>
            Walk-in Jobs Near You
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748b' }}>
            Direct interview venues, same-day screening and spot offer letters across India
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Timeframe Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Dates' },
              { id: 'today', label: 'Today' },
              { id: 'tomorrow', label: 'Tomorrow' },
              { id: 'week', label: 'This Week' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={`btn btn-sm ${timeframe === tab.id ? 'btn-danger' : 'btn-outline'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* City filter & View toggle */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="search-field" style={{ minWidth: '160px', padding: '6px 10px' }}>
              <MapPin size={16} color="#94a3b8" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem' }}
              >
                {TOP_CITIES.map((c) => (
                  <option key={c} value={c === 'All India' ? '' : c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 10px',
                  background: viewMode === 'list' ? 'var(--primary)' : '#ffffff',
                  color: viewMode === 'list' ? '#ffffff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                }}
              >
                <List size={14} /> List
              </button>
              <button
                onClick={() => setViewMode('map')}
                style={{
                  padding: '6px 10px',
                  background: viewMode === 'map' ? 'var(--primary)' : '#ffffff',
                  color: viewMode === 'map' ? '#ffffff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                }}
              >
                <MapIcon size={14} /> Map
              </button>
            </div>
          </div>
        </div>

        {/* Content: List or Map */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            <SkeletonJobCard />
            <SkeletonJobCard />
            <SkeletonJobCard />
          </div>
        ) : walkins.length === 0 ? (
          <EmptyState
            title="No walk-in interviews found"
            description="Check back soon or select 'All Dates' to browse upcoming recruitment drives."
            onReset={() => {
              setTimeframe('all');
              setCity('');
            }}
          />
        ) : viewMode === 'map' ? (
          <div style={{ height: '560px', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <JobMap jobs={walkins} zoom={11} radiusKm={null} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {walkins.map((job) => {
              const [lng, lat] = job.location?.coordinates || [76.7794, 30.7333];
              const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

              return (
                <div
                  key={job._id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    borderLeft: '4px solid #dc2626',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span className="badge badge-walkin">WALK-IN DRIVE</span>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{job.city}</span>
                    </div>

                    <Link to={`/jobs/${job._id}`}>
                      <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '4px' }}>
                        {job.title}
                      </h3>
                    </Link>
                    <p style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600 }}>{job.company}</p>

                    {/* Venue & Timing Box */}
                    <div
                      style={{
                        background: '#fef2f2',
                        borderRadius: '8px',
                        padding: '12px',
                        margin: '14px 0',
                        fontSize: '0.84rem',
                        color: '#334155',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#b91c1c', marginBottom: '4px' }}>
                        <Calendar size={14} />
                        <span>{job.walkinDateDisplay || 'Upcoming'} • {job.walkinStartTime || '10:00 AM'} - {job.walkinEndTime || '4:00 PM'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '6px' }}>
                        <MapPin size={14} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span><strong>Venue:</strong> {job.walkinVenue || job.address || job.city}</span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.92rem', color: '#16a34a', fontWeight: 700, marginBottom: '8px' }}>
                      {formatSalary(job.salaryMin, job.salaryMax, job.salaryDisplay)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', borderColor: '#fca5a5', color: '#b91c1c' }}
                    >
                      <Navigation size={13} /> Get Directions
                    </a>

                    <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
                      View Walk-in Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
