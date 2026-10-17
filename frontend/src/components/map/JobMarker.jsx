import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { formatSalary } from '../../utils/formatters';

// Fix default Leaflet icon paths in Vite
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const walkinIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function JobMarker({ job, onSelect }) {
  if (!job.location || !job.location.coordinates || job.location.coordinates.length < 2) {
    return null;
  }

  // GeoJSON coordinates are [longitude, latitude], Leaflet takes [latitude, longitude]
  const [lng, lat] = job.location.coordinates;

  return (
    <Marker
      position={[lat, lng]}
      icon={job.isWalkin ? walkinIcon : defaultIcon}
      eventHandlers={{
        click: () => {
          if (onSelect) onSelect(job);
        },
      }}
    >
      <Popup>
        <div style={{ padding: '4px', minWidth: '180px' }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: job.isWalkin ? '#dc2626' : '#2563eb',
              textTransform: 'uppercase',
            }}
          >
            {job.isWalkin ? 'Walk-in Interview' : 'Job Opportunity'}
          </span>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '4px 0 2px', color: '#0f172a' }}>
            {job.title}
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>{job.company}</p>
          <p style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, marginTop: '4px' }}>
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryDisplay)}
          </p>
          <div style={{ marginTop: '8px' }}>
            <Link
              to={`/jobs/${job._id}`}
              style={{
                display: 'inline-block',
                background: '#2563eb',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              View Details
            </Link>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
