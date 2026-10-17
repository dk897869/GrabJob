import React from 'react';
import { Calendar, MapPin, CheckCircle } from 'lucide-react';

export function WalkinBadge({ dateDisplay, timeDisplay }) {
  return (
    <span className="badge badge-walkin">
      <Calendar size={12} />
      WALK-IN {dateDisplay ? `• ${dateDisplay}` : ''} {timeDisplay ? `(${timeDisplay})` : ''}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span className="badge badge-verified">
      <CheckCircle size={12} />
      Verified
    </span>
  );
}

export function SourceBadge({ sourceName, isDemo }) {
  return (
    <span className="badge badge-source">
      {isDemo ? 'Demo Job' : (sourceName || 'Direct Employer')}
    </span>
  );
}
