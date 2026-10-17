import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Users, GraduationCap, Star } from 'lucide-react';

export default function HeroShowcase() {
  const [imageError, setImageError] = useState(false);

  // High quality photo of professional Indian youth holding laptop/books
  const candidatePhotoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80";

  return (
    <div className="hero-showcase-wrapper">
      {/* Soft circular glowing background */}
      <div className="hero-glow-circle" />
      <div className="hero-glow-ring" />

      {/* Candidate Center Visual */}
      <div className="hero-candidate-container">
        {!imageError ? (
          <img
            src={candidatePhotoUrl}
            alt="GrabJob Job Seeker"
            className="hero-candidate-img"
            onError={() => setImageError(true)}
          />
        ) : (
          /* SVG Vector Illustrated Candidate fallback if offline */
          <div className="hero-candidate-svg-fallback">
            <svg viewBox="0 0 320 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect width="320" height="380" rx="24" fill="#eff6ff" />
              <circle cx="160" cy="120" r="55" fill="#3b82f6" />
              <path d="M160 85 C140 85 130 95 130 115 C130 135 145 155 160 155 C175 155 190 135 190 115 C190 95 180 85 160 85 Z" fill="#fcd34d" />
              <path d="M140 85 C145 75 175 75 180 85 C185 92 180 100 180 100 C175 90 145 90 140 100 Z" fill="#1e293b" />
              <path d="M105 210 C105 175 130 160 160 160 C190 160 215 175 215 210 L225 380 L95 380 Z" fill="#1d4ed8" />
              <path d="M145 160 L160 210 L175 160 Z" fill="#ffffff" />
              <rect x="110" y="270" width="100" height="60" rx="8" fill="#334155" />
              <rect x="115" y="275" width="90" height="50" rx="4" fill="#0284c7" />
            </svg>
          </div>
        )}
      </div>

      {/* Floating Badge 1: Top-Left (10,000+ Active Jobs) */}
      <div className="hero-floating-badge badge-top-left">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="font-extrabold text-slate-900 text-sm leading-tight">10,000+</p>
          <p className="text-xs text-slate-500 font-medium">Active Jobs</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Verified Listings</span>
        </div>
      </div>

      {/* Floating Badge 2: Bottom-Left (1,000+ Walk-in Jobs) */}
      <div className="hero-floating-badge badge-bottom-left">
        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Users size={18} />
        </div>
        <div>
          <p className="font-extrabold text-slate-900 text-sm leading-tight">1,000+</p>
          <p className="text-xs text-slate-500 font-medium">Walk-in Jobs</p>
          <span className="text-[10px] text-purple-600 font-semibold">Updated Daily</span>
        </div>
      </div>

      {/* Floating Badge 3: Center-Right (Better Skills, Brighter Future) */}
      <div className="hero-floating-badge badge-center-right">
        <div className="flex items-center gap-1.5 text-blue-700">
          <Sparkles size={14} className="text-blue-500" />
          <span className="font-bold text-xs tracking-wide">Better Skills, Brighter Future</span>
        </div>
      </div>

      {/* Floating Badge 4: Top-Right (50+ Cities in India) */}
      <div className="hero-floating-badge badge-top-right">
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <GraduationCap size={18} />
        </div>
        <div>
          <p className="font-extrabold text-slate-900 text-sm leading-tight">50+</p>
          <p className="text-xs text-slate-500 font-medium">Cities in India</p>
          <span className="text-[10px] text-blue-600 font-semibold">Opportunities Near You</span>
        </div>
      </div>

      {/* Floating Badge 5: Bottom-Right (4.9 / 5 Candidate Rating) */}
      <div className="hero-floating-badge badge-bottom-right">
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <Star size={18} fill="#f59e0b" color="#f59e0b" />
        </div>
        <div>
          <p className="font-extrabold text-slate-900 text-sm leading-tight">4.9 / 5</p>
          <p className="text-xs text-slate-500 font-medium">Candidate Rating</p>
          <span className="text-[10px] text-amber-600 font-semibold">From 10,000+ users</span>
        </div>
      </div>
    </div>
  );
}
