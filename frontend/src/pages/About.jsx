import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Compass,
  Briefcase,
  MapPin,
  Building2,
  CheckCircle2,
  FileCheck,
  Sparkles,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
  Target,
  Award,
  Lock,
  Globe,
  Bot
} from 'lucide-react';

export default function About() {
  const stats = [
    { value: '28+', label: 'States & UTs Covered', icon: MapPin, color: '#2563EB', bg: '#EFF6FF' },
    { value: '45,000+', label: 'Verified Openings', icon: Briefcase, color: '#16A34A', bg: '#F0FDF4' },
    { value: '1,200+', label: 'Walk-in Hiring Drives', icon: Building2, color: '#D97706', bg: '#FEF3C7' },
    { value: '99.2%', label: 'Source Provenance Accuracy', icon: ShieldCheck, color: '#7C3AED', bg: '#F5F3FF' },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      title: 'Strict Provenance & Anti-Scraping',
      description:
        'Unlike untrusted web scrapers, GrabJob strictly enforces data compliance. We only ingest verified listings from direct employers, licensed partner APIs, and physically audited walk-in recruitment drives.',
      badge: 'Zero Scraping',
    },
    {
      icon: Compass,
      iconColor: '#16A34A',
      iconBg: '#F0FDF4',
      title: 'Map-First Local Job Discovery',
      description:
        'Search opportunities anywhere across India with interactive geospatial radius filtering. From Tier 1 hubs like Bengaluru and Gurgaon to Tier 2 & 3 industrial corridors.',
      badge: 'Interactive Map',
    },
    {
      icon: Sparkles,
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
      title: 'Accessible AI Career Tooling',
      description:
        'Affordable ₹50 ATS Resume Generation and ₹100 Practice Mock Interviews for both IT and Non-IT domains. We eliminate exploitative ₹10,000+ consultancy charges.',
      badge: 'Affordable Tech',
    },
    {
      icon: HeartHandshake,
      iconColor: '#7C3AED',
      iconBg: '#F5F3FF',
      title: 'Transparent Candidate Protection',
      description:
        'We never make false placement guarantees. Every job listing displays employer contact verification, official location pins, and exact eligibility criteria.',
      badge: '100% Genuine',
    },
  ];

  const values = [
    {
      title: 'Radical Honesty',
      desc: 'No ghost jobs, no expired listings, and no fake salary ranges. Every opportunity has an authenticated paper trail.',
      icon: FileCheck,
    },
    {
      title: 'Bharat First',
      desc: 'Designed for accessibility on mobile devices with high speed, low bandwidth usage, and multi-tier city support.',
      icon: Globe,
    },
    {
      title: 'Data Privacy & Safety',
      desc: 'Your CV data and personal identifiers are strictly encrypted. We do not sell applicant databases to cold callers.',
      icon: Lock,
    },
    {
      title: 'Outcome-Driven Assistance',
      desc: 'Actionable interview questions, domain mock evaluations, and keyword ATS optimization that actually boost shortlisted rates.',
      icon: Target,
    },
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '70px 20px 80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(15,23,42,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(37, 99, 235, 0.25)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#93c5fd',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '20px',
            }}
          >
            <ShieldCheck size={16} />
            <span>India's Trusted Job Discovery & Career Network</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
            }}
          >
            Empowering India's Workforce With{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #60a5fa 0%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Honest Opportunities
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#cbd5e1',
              lineHeight: 1.7,
              maxWidth: '720px',
              margin: '0 auto 32px',
            }}
          >
            GrabJob bridges job seekers across Tier 1, 2, and 3 cities directly with authenticated employer
            openings, verified walk-in hiring drives, and state-of-the-art AI career tools.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/jobs"
              className="btn btn-primary"
              style={{
                padding: '12px 26px',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '10px',
              }}
            >
              <Briefcase size={18} />
              <span>Explore Verified Jobs</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/walkin-jobs"
              style={{
                padding: '12px 24px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
            >
              <Building2 size={18} />
              <span>Walk-in Interviews</span>
            </Link>

            <Link
              to="/resume-builder"
              style={{
                padding: '12px 24px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#93c5fd',
                background: 'rgba(37, 99, 235, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '10px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={18} />
              <span>ATS Resume Builder</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Stats Bar */}
      <div style={{ maxWidth: '1100px', margin: '-40px auto 50px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 12px 30px -10px rgba(15, 23, 42, 0.12)',
            border: '1px solid #e2e8f0',
            padding: '24px 28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '8px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: s.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: s.color,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500, marginTop: '3px' }}>
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        {/* Mission and Problem Statement */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '50px',
          }}
        >
          {/* Mission Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '36px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Target size={22} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
              Our Mission
            </h2>
            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.96rem', marginBottom: '14px' }}>
              Every week, thousands of qualified job seekers miss crucial hiring events because information is
              fragmented across closed social groups, expired message boards, and deceptive agencies.
            </p>
            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.96rem' }}>
              GrabJob consolidates authorized employer listings, verified walk-in hiring drives, and remote freelance
              projects into a unified, high-speed discovery engine with transparent candidate support.
            </p>
          </div>

          {/* Problem vs Solution Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '36px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#F0FDF4',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
              Strict Anti-Scraping Standard
            </h2>
            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.96rem', marginBottom: '14px' }}>
              Unlike automated scraping websites that compromise candidate data and violate portal terms, GrabJob
              operates strictly on authenticated feeds, authorized enterprise partners, and physically audited recruiters.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#16A34A" /> Direct Employer and Recruiter Verification
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#16A34A" /> Full provenance metadata for every job opening
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#16A34A" /> Zero unauthorized bot scraping or fake data
              </li>
            </ul>
          </div>
        </div>

        {/* Core Pillars */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#2563EB',
                textTransform: 'uppercase',
              }}
            >
              What Makes GrabJob Different
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
              Built For Genuine Candidate Success
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    padding: '28px',
                    border: '1px solid #e2e8f0',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: p.iconBg,
                        color: p.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: '#f1f5f9',
                        color: '#475569',
                      }}
                    >
                      {p.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transparent Pricing & Fair Access Breakdown */}
        <div
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid #bfdbfe',
            marginBottom: '50px',
          }}
        >
          <div style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center', marginBottom: '32px' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#2563EB',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Radical Candidate Affordability
            </span>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
              Micro-Priced Career Services
            </h2>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginTop: '8px' }}>
              We reject predatory placement consultancy models. Our career enhancement services are transparently priced
              for everyday job seekers.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Service 1 */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                padding: '28px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16A34A', background: '#F0FDF4', padding: '4px 10px', borderRadius: '6px' }}>
                  INSTANT DOWNLOAD
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>₹50</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                ATS Resume Builder
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '16px' }}>
                AI-driven keyword matching against target Job Descriptions, formatting fixes, score boost, and instant ATS-compliant PDF generation.
              </p>
              <Link
                to="/resume-builder"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#2563EB',
                  textDecoration: 'none',
                }}
              >
                <span>Try Resume Builder</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Service 2 */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                padding: '28px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '4px 10px', borderRadius: '6px' }}>
                  IT & NON-IT DOMAINS
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>₹100</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                Mock Interview Practice
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '16px' }}>
                Structured mock interview scheduling with top industry evaluation questions, model answers, and expert feedback across every domain.
              </p>
              <Link
                to="/interview-assistance"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#2563EB',
                  textDecoration: 'none',
                }}
              >
                <span>Book Practice Slot</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Guiding Values Grid */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#2563EB',
                textTransform: 'uppercase',
              }}
            >
              Our Commitments
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
              Values That Drive Us
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '20px',
            }}
          >
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: '#F1F5F9',
                      color: '#0F172A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    {v.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            borderRadius: '20px',
            padding: '44px 32px',
            color: '#ffffff',
            textAlign: 'center',
            boxShadow: '0 12px 30px -10px rgba(37, 99, 235, 0.4)',
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
            Ready to Discover Your Next Career Move?
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#dbeafe',
              maxWidth: '620px',
              margin: '0 auto 28px',
              lineHeight: 1.6,
            }}
          >
            Join thousands of active job seekers finding verified jobs and attending live walk-in drives across India.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/jobs"
              style={{
                background: '#ffffff',
                color: '#1e3a8a',
                padding: '12px 28px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Browse All Jobs</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/map"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <MapPin size={16} />
              <span>Explore Map View</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
