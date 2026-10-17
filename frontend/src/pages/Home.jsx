import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  Star,
  Users,
  Building2,
  TrendingUp,
  Laptop,
  PhoneCall,
  UserCheck,
  Calculator,
  HeartPulse,
  GraduationCap,
  Megaphone,
  Radio,
  MoreHorizontal,
} from 'lucide-react';
import { useJobStore } from '../store/jobStore';
import { useLocation } from '../hooks/useLocation';
import { useJobs, useWalkinJobs } from '../hooks/useJobs';
import { TOP_CITIES } from '../utils/constants';
import HeroShowcase from '../components/home/HeroShowcase';
import JobCard from '../components/common/JobCard';
import { SkeletonJobCard } from '../components/common/Loading';
import { formatSalary } from '../utils/formatters';

export default function Home() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, selectedCity, setSelectedCity } = useJobStore();
  const { requestLocation, loading: locLoading } = useLocation();

  // Queries for live preview data
  const { data: walkinData, isLoading: walkinLoading } = useWalkinJobs({ timeframe: 'today' });
  const { data: recentJobsData, isLoading: jobsLoading } = useJobs({ limit: 4 });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCity && selectedCity !== 'All India') params.append('city', selectedCity);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleFindNearMe = async () => {
    const coords = await requestLocation();
    if (coords) {
      navigate('/map');
    }
  };

  const categories = [
    { name: 'IT & Software', count: '2,500+ jobs', icon: Laptop, color: '#2563eb', bg: '#eff6ff' },
    { name: 'Customer Support', count: '1,800+ jobs', icon: PhoneCall, color: '#7c3aed', bg: '#f5f3ff' },
    { name: 'Sales & Business', count: '1,600+ jobs', icon: TrendingUp, color: '#16a34a', bg: '#f0fdf4' },
    { name: 'HR & Recruitment', count: '800+ jobs', icon: UserCheck, color: '#db2777', bg: '#fdf2f8' },
    { name: 'Finance & Accounting', count: '700+ jobs', icon: Calculator, color: '#d97706', bg: '#fffbeb' },
    { name: 'Healthcare', count: '650+ jobs', icon: HeartPulse, color: '#dc2626', bg: '#fef2f2' },
    { name: 'Education', count: '600+ jobs', icon: GraduationCap, color: '#0891b2', bg: '#ecfeff' },
    { name: 'Marketing', count: '500+ jobs', icon: Megaphone, color: '#9333ea', bg: '#faf5ff' },
    { name: 'Telecom', count: '450+ jobs', icon: Radio, color: '#0284c7', bg: '#f0f9ff' },
    { name: 'More Categories', count: 'Explore all', icon: MoreHorizontal, color: '#475569', bg: '#f1f5f9' },
  ];

  return (
    <div className="home-page-container">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Column Content */}
            <div className="hero-left-content">
              <div className="hero-trust-badge">
                <ShieldCheck size={16} color="#2563eb" />
                <span>India's Trusted Job Platform</span>
              </div>

              <h1 className="hero-headline">
                Find your next opportunity <span className="text-highlight-blue">with confidence</span>
              </h1>

              <p className="hero-subtext">
                Discover verified jobs, walk-in interviews and freelance opportunities across India. Your next career step is closer than you think.
              </p>

              {/* High-Fidelity Big Search Card */}
              <div className="hero-search-card">
                <form onSubmit={handleSearch} className="hero-search-form">
                  {/* Query Input */}
                  <div className="search-input-group flex-1">
                    <Search size={18} className="search-input-icon" />
                    <input
                      type="text"
                      placeholder="Job title, skill or company"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input-field"
                    />
                  </div>

                  <div className="search-input-divider" />

                  {/* Location Selector */}
                  <div className="search-input-group location-group">
                    <MapPin size={18} className="search-input-icon" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="search-select-field"
                    >
                      {TOP_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Primary Search Submit Button */}
                  <button type="submit" className="btn-hero-search">
                    Search Jobs
                  </button>
                </form>

                {/* Sub-search actions and quick filter chips */}
                <div className="hero-search-footer">
                  <button
                    onClick={handleFindNearMe}
                    disabled={locLoading}
                    className="btn-near-me"
                  >
                    <Compass size={16} />
                    <span>{locLoading ? 'Locating...' : 'Find jobs near me'}</span>
                  </button>

                  <div className="hero-quick-chips">
                    <button
                      type="button"
                      onClick={() => navigate('/jobs?workMode=Remote')}
                      className="quick-chip"
                    >
                      Remote
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/walkin-jobs')}
                      className="quick-chip chip-walkin"
                    >
                      Walk-in
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/jobs?jobType=Full+Time')}
                      className="quick-chip"
                    >
                      Full Time
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/jobs?jobType=Part+Time')}
                      className="quick-chip"
                    >
                      Part Time
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/freelance')}
                      className="quick-chip"
                    >
                      Freelance
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Showcase */}
            <div className="hero-right-showcase">
              <HeroShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="stats-strip">
        <div className="container">
          <div className="stats-strip-grid">
            <div className="stat-strip-item">
              <div className="stat-icon-wrapper bg-blue-50 text-blue-600">
                <Briefcase size={20} />
              </div>
              <div className="stat-text-box">
                <h3 className="stat-number">10,000+</h3>
                <p className="stat-label">Jobs (Demo)</p>
              </div>
            </div>

            <div className="stat-strip-item">
              <div className="stat-icon-wrapper bg-rose-50 text-rose-600">
                <MapPin size={20} />
              </div>
              <div className="stat-text-box">
                <h3 className="stat-number">1,000+</h3>
                <p className="stat-label">Walk-ins (Demo)</p>
              </div>
            </div>

            <div className="stat-strip-item">
              <div className="stat-icon-wrapper bg-emerald-50 text-emerald-600">
                <Building2 size={20} />
              </div>
              <div className="stat-text-box">
                <h3 className="stat-number">50+</h3>
                <p className="stat-label">Cities (Demo)</p>
              </div>
            </div>

            <div className="stat-strip-item">
              <div className="stat-icon-wrapper bg-purple-50 text-purple-600">
                <Users size={20} />
              </div>
              <div className="stat-text-box">
                <h3 className="stat-number">100+</h3>
                <p className="stat-label">Partner Sources</p>
              </div>
            </div>

            <div className="stat-strip-item">
              <div className="stat-icon-wrapper bg-amber-50 text-amber-600">
                <ShieldCheck size={20} />
              </div>
              <div className="stat-text-box">
                <h3 className="stat-number">Fast & Trusted</h3>
                <p className="stat-label">Verified Listings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR JOB CATEGORIES */}
      <section className="section-padding">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <h2 className="section-main-heading">Popular Job Categories</h2>
              <p className="section-sub-heading">Explore jobs in top categories</p>
            </div>
            <Link to="/jobs" className="view-all-link">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="categories-grid-container">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() => {
                    if (cat.name === 'More Categories') {
                      navigate('/jobs');
                    } else {
                      navigate(`/jobs?category=${encodeURIComponent(cat.name)}`);
                    }
                  }}
                  className="category-tile-card"
                >
                  <div
                    className="category-icon-bubble"
                    style={{ backgroundColor: cat.bg, color: cat.color }}
                  >
                    <IconComp size={22} />
                  </div>
                  <h4 className="category-tile-title">{cat.name}</h4>
                  <p className="category-tile-count">{cat.count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. WALK-IN JOBS NEAR YOU */}
      <section className="section-padding bg-slate-50 border-y border-slate-200">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <h2 className="section-main-heading">Walk-in Jobs Near You</h2>
              <p className="section-sub-heading">Immediate hiring opportunities across top cities in India.</p>
            </div>
            <Link to="/walkin-jobs" className="view-all-link">
              View All Walk-in Jobs <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Flipkart */}
            <div className="walkin-job-preview-card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-amber-300 font-black flex items-center justify-center text-sm shadow-sm">
                    fk
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">Customer Support Executive</h4>
                    <p className="text-slate-500 text-xs font-medium">Flipkart</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded text-[11px] font-bold">
                  Walk-in
                </span>
              </div>
              <div className="space-y-1 my-2.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">Chandigarh, Punjab</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400 shrink-0" />
                  <span>Today, 10:00 AM - 4:00 PM</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded">Fresher Eligible</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded">Best in Industry</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Link to="/walkin-jobs" className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1">
                  View Details <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Card 2: Concentrix */}
            <div className="walkin-job-preview-card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-xs shadow-sm">
                    CNX
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">BPO International Voice</h4>
                    <p className="text-slate-500 text-xs font-medium">Concentrix</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded text-[11px] font-bold">
                  Walk-in
                </span>
              </div>
              <div className="space-y-1 my-2.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">Chandigarh, Punjab</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400 shrink-0" />
                  <span>Today, 10:00 AM - 4:00 PM</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded">Fresher Eligible</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded">Immediate Joining</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Link to="/walkin-jobs" className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1">
                  View Details <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Card 3: Amazon */}
            <div className="walkin-job-preview-card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-sm">
                    a
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">Warehouse Operations</h4>
                    <p className="text-slate-500 text-xs font-medium">Amazon</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded text-[11px] font-bold">
                  Walk-in
                </span>
              </div>
              <div className="space-y-1 my-2.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">Mohali, Punjab</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400 shrink-0" />
                  <span>Today, 09:00 AM - 5:00 PM</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded">12th Pass Eligible</span>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded">Good Incentives</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Link to="/walkin-jobs" className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1">
                  View Details <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Card 4: Teleperformance */}
            <div className="walkin-job-preview-card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-xs shadow-sm">
                    TP
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">Customer Care Executive</h4>
                    <p className="text-slate-500 text-xs font-medium">Teleperformance</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded text-[11px] font-bold">
                  Walk-in
                </span>
              </div>
              <div className="space-y-1 my-2.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">Panchkula, Haryana</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400 shrink-0" />
                  <span>Today, 10:00 AM - 3:00 PM</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded">Fresher Eligible</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded">Day Shift</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Link to="/walkin-jobs" className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1">
                  View Details <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE TWO BIG PROMO CARDS (₹100 Interview & ₹50 Resume Builder) */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: Interview Assistance */}
            <div className="promo-banner-card promo-blue-gradient">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <span className="promo-pill-tag">Interview Assistance</span>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-4xl font-extrabold text-white">₹100</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Get interview scheduled for eligible jobs
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed mb-4 max-w-sm">
                    Priority coordinator desk, checklist review and complete venue guidance.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">✓ Interview Scheduling</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">✓ Document Checklist</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">✓ Venue Guidance</span>
                  </div>
                </div>

                <div>
                  <Link
                    to="/interview-assistance"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold text-sm rounded-xl shadow-lg hover:bg-blue-50 transition"
                  >
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Decorative graphic background */}
              <div className="absolute -right-6 -bottom-6 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute right-6 top-8 text-white/20">
                <Briefcase size={96} strokeWidth={1} />
              </div>
            </div>

            {/* Right Card: ATS Resume Builder */}
            <div className="promo-banner-card promo-dark-gradient">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <span className="promo-pill-tag">ATS Resume Builder</span>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-4xl font-extrabold text-white">₹50</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Get an ATS-friendly resume with AI
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4 max-w-sm">
                    Upload your old CV, optimize keywords and download a clean PDF & DOCX.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">✓ ATS Optimized</span>
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">✓ AI Powered Suggestions</span>
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">✓ Clean PDF & DOCX</span>
                  </div>
                </div>

                <div>
                  <Link
                    to="/resume-builder"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg hover:bg-blue-700 transition"
                  >
                    Try Now <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Decorative graphic background */}
              <div className="absolute -right-6 -bottom-6 w-44 h-44 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />
              <div className="absolute right-6 top-8 text-white/20">
                <FileText size={96} strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW GRABJOB WORKS (4 Steps) */}
      <section className="section-padding bg-slate-50 border-t border-slate-200">
        <div className="container text-center">
          <h2 className="section-main-heading">How GrabJob Works</h2>
          <p className="section-sub-heading max-w-lg mx-auto">
            Get hired in 4 simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 text-left">
            <div className="how-step-card flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 font-black text-lg">
                1
              </div>
              <div>
                <h4 className="how-step-title mb-1">Search Jobs</h4>
                <p className="how-step-text text-xs">Find jobs by title, skill or company across India.</p>
              </div>
            </div>

            <div className="how-step-card flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 font-black text-lg">
                2
              </div>
              <div>
                <h4 className="how-step-title mb-1">Apply or Walk-in</h4>
                <p className="how-step-text text-xs">Apply online or attend walk-in interviews near you.</p>
              </div>
            </div>

            <div className="how-step-card flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 font-black text-lg">
                3
              </div>
              <div>
                <h4 className="how-step-title mb-1">Get Interviewed</h4>
                <p className="how-step-text text-xs">Get short-listed by top companies with our assistance.</p>
              </div>
            </div>

            <div className="how-step-card flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 font-black text-lg">
                4
              </div>
              <div>
                <h4 className="how-step-title mb-1">Build Your Career</h4>
                <p className="how-step-text text-xs">Start your new role and grow with better opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHAT OUR USERS SAY */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="section-main-heading">What Our Users Say</h2>
            <p className="section-sub-heading">Real stories from job seekers across India</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "I found a walk-in job near me within a day. Amazing platform!"
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  RS
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Rohit Sharma</h5>
                  <p className="text-slate-400 text-xs">Chandigarh</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "The resume builder is excellent. Got more interview calls."
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                  PM
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Priya Mehta</h5>
                  <p className="text-slate-400 text-xs">Mohali</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "Interview assistance helped me get an interview quickly."
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                  AV
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Aman Verma</h5>
                  <p className="text-slate-400 text-xs">Delhi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. READY TO FIND YOUR NEXT OPPORTUNITY? (CTA BANNER) */}
      <section className="section-padding pt-0 pb-16">
        <div className="container">
          <div className="cta-banner-wrapper">
            <div className="cta-banner-content">
              <h2 className="cta-heading">Ready to find your next opportunity?</h2>
              <p className="cta-subheading">
                Join thousands of job seekers already using GrabJob.
              </p>

              <div className="mt-8">
                <Link to="/register" className="btn-cta-action">
                  Create Free Account
                </Link>
              </div>

              {/* 4 Feature Checkmark Badges */}
              <div className="cta-badges-row">
                <div className="cta-badge-item">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>Secure & Trusted</span>
                </div>
                <div className="cta-badge-item">
                  <MapPin size={16} className="text-blue-500" />
                  <span>All India Coverage</span>
                </div>
                <div className="cta-badge-item">
                  <Sparkles size={16} className="text-purple-500" />
                  <span>AI Powered</span>
                </div>
                <div className="cta-badge-item">
                  <CheckCircle size={16} className="text-amber-500" />
                  <span>Easy to Use</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
