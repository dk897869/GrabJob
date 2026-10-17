import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function JobSourceBadge({ source, sourceName, isVerified, isDemo }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      {isVerified && (
        <span className="badge badge-verified">
          <ShieldCheck size={12} /> Verified
        </span>
      )}
      <span className="badge badge-source">
        {isDemo ? 'Demo Listing' : (sourceName || 'Direct Employer')}
      </span>
    </div>
  );
}
