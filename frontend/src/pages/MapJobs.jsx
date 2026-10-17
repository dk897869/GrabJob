import React, { useState } from 'react';
import { Compass, Navigation, Sliders, MapPin, ExternalLink, Calendar } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import { useNearbyJobs, useJobs } from '../hooks/useJobs';
import JobMap from '../components/map/JobMap';
import { formatSalary } from '../utils/formatters';
import { Link } from 'react-router-dom';

export default function MapJobs() {
  const { coordinates, loading: locLoading, requestLocation, hasLocation } = useLocation();
  const [radiusKm, setRadiusKm] = useState(25);
  const [selectedJob, setSelectedJob] = useState(null);
  const [walkinOnly, setWalkinOnly] = useState(false);

  // If user has location, use nearby query; otherwise fallback to standard job list
  const { data: nearbyData, isLoading: nearbyLoading } = useNearbyJobs({
    lat: coordinates.lat,
    lng: coordinates.lng,
    radius: radiusKm,
    isWalkin: walkinOnly ? 'true' : undefined,
  });

  const { data: allJobsData, isLoading: allLoading } = useJobs({
    isWalkin: walkinOnly ? 'true' : undefined,
    limit: 40,
  });

  const jobsToDisplay = nearbyData?.data || allJobsData?.data || [];
  const mapCenter = [coordinates.lat, coordinates.lng];

  return (
    <div style={{ height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Map Filter Controls */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)', margin: 0 }}>
            Interactive Job Map
          </h2>

          {/* Current Location Trigger */}
          <button
            onClick={requestLocation}
            disabled={locLoading}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Compass size={16} />
            {locLoading ? 'Locating...' : hasLocation ? 'Update My Location' : 'Detect My Location'}
          </button>

          {/* Walk-in Only Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={walkinOnly}
              onChange={(e) => setWalkinOnly(e.target.checked)}
            />
            <span style={{ fontWeight: 600, color: '#dc2626' }}>Walk-in Interviews Only</span>
          </label>
        </div>

        {/* Radius Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Radius:</span>
          {[5, 10, 25, 50, 100].map((r) => (
            <button
              key={r}
              onClick={() => setRadiusKm(r)}
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: `1px solid ${radiusKm === r ? 'var(--primary)' : '#cbd5e1'}`,
                background: radiusKm === r ? 'var(--primary-light)' : '#ffffff',
                color: radiusKm === r ? 'var(--primary)' : '#475569',
              }}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Body with Split Sidebar */}
      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Left Floating Job Card List */}
        <div
          style={{
            width: '380px',
            background: '#ffffff',
            borderRight: '1px solid var(--border-color)',
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
            {jobsToDisplay.length} opportunities located within {radiusKm} km
          </div>

          {jobsToDisplay.map((job) => (
            <div
              key={job._id}
              onClick={() => setSelectedJob(job)}
              style={{
                padding: '14px',
                borderRadius: '10px',
                border: `1.5px solid ${selectedJob?._id === job._id ? 'var(--primary)' : '#e2e8f0'}`,
                background: selectedJob?._id === job._id ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--secondary)', margin: 0 }}>
                  {job.title}
                </h4>
                {job.isWalkin && <span className="badge badge-walkin">WALK-IN</span>}
              </div>
              <p style={{ fontSize: '0.84rem', color: '#475569', marginTop: '2px' }}>{job.company}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '0.84rem', color: '#16a34a', fontWeight: 700 }}>
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryDisplay)}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>📍 {job.city}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Map View */}
        <div style={{ flex: 1, position: 'relative' }}>
          <JobMap
            jobs={jobsToDisplay}
            center={mapCenter}
            zoom={radiusKm <= 10 ? 13 : radiusKm <= 25 ? 11 : 9}
            radiusKm={radiusKm}
            onSelectJob={(job) => setSelectedJob(job)}
          />

          {/* Selected Job Card Overlay */}
          {selectedJob && (
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                right: '24px',
                width: '340px',
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
                border: '1px solid var(--border-color)',
                zIndex: 1000,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedJob.isWalkin ? '#dc2626' : '#2563eb' }}>
                  {selectedJob.isWalkin ? 'WALK-IN INTERVIEW' : 'VERIFIED OPENING'}
                </span>
                <button onClick={() => setSelectedJob(null)} style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  ✕
                </button>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '6px 0 2px', color: 'var(--secondary)' }}>
                {selectedJob.title}
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#475569' }}>{selectedJob.company}</p>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
                📍 {selectedJob.address || selectedJob.city}
              </p>

              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <Link to={`/jobs/${selectedJob._id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  View Details
                </Link>
                {selectedJob.location?.coordinates && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedJob.location.coordinates[1]},${selectedJob.location.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Navigation size={13} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
