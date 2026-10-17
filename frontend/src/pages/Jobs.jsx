import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  Calendar,
  ShieldCheck,
  Briefcase,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import JobFilters from '../components/jobs/JobFilters';
import JobList from '../components/jobs/JobList';
import { TOP_CITIES } from '../utils/constants';

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [filters, setFilters] = useState({
    jobType: searchParams.get('jobType') || 'All',
    workMode: searchParams.get('workMode') || 'All',
    experience: searchParams.get('experience') || 'All',
    category: searchParams.get('category') || 'All',
    minSalary: searchParams.get('minSalary') || '',
    isWalkinOnly: searchParams.get('isWalkin') === 'true',
    isVerifiedOnly: searchParams.get('isVerified') === 'true',
  });
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (city && city !== 'All India') params.set('city', city);
    if (filters.jobType && filters.jobType !== 'All') params.set('jobType', filters.jobType);
    if (filters.workMode && filters.workMode !== 'All') params.set('workMode', filters.workMode);
    if (filters.experience && filters.experience !== 'All') params.set('experience', filters.experience);
    if (filters.category && filters.category !== 'All') params.set('category', filters.category);
    if (filters.minSalary) params.set('minSalary', filters.minSalary);
    if (filters.isWalkinOnly) params.set('isWalkin', 'true');
    if (filters.isVerifiedOnly) params.set('isVerified', 'true');
    setSearchParams(params, { replace: true });
  }, [search, city, filters, setSearchParams]);

  const queryParams = {
    search: search || undefined,
    city: city && city !== 'All India' ? city : undefined,
    jobType: filters.jobType !== 'All' ? filters.jobType : undefined,
    workMode: filters.workMode !== 'All' ? filters.workMode : undefined,
    experience: filters.experience !== 'All' ? filters.experience : undefined,
    category: filters.category !== 'All' ? filters.category : undefined,
    minSalary: filters.minSalary || undefined,
    isWalkin: filters.isWalkinOnly ? 'true' : undefined,
    isVerified: filters.isVerifiedOnly ? 'true' : undefined,
    page,
    limit: 15,
  };

  const { data, isLoading } = useJobs(queryParams);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCity('');
    setFilters({
      jobType: 'All',
      workMode: 'All',
      experience: 'All',
      category: 'All',
      minSalary: '',
      isWalkinOnly: false,
      isVerifiedOnly: false,
    });
    setPage(1);
  };

  const totalJobs = data?.pagination?.total || data?.data?.length || 0;

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)', padding: '24px 0 60px' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* Top Search Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '20px 24px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search query input */}
            <div className="search-field" style={{ flex: '1.8', minWidth: '240px' }}>
              <Search size={18} color="#2563eb" />
              <input
                type="text"
                placeholder="Search by job title, skill (e.g. React, Java), or company..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{ color: '#94a3b8', padding: '2px', cursor: 'pointer' }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* City Location Dropdown */}
            <div className="search-field" style={{ flex: '1.1', minWidth: '180px' }}>
              <MapPin size={18} color="#16a34a" />
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
              >
                {TOP_CITIES.map((c) => (
                  <option key={c} value={c === 'All India' ? '' : c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="btn btn-outline"
              style={{
                padding: '11px 16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '10px',
              }}
            >
              <SlidersHorizontal size={16} color="#2563eb" />
              <span>Filters</span>
            </button>
          </div>

          {/* Quick Filter Pills Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              marginTop: '16px',
              paddingTop: '14px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>
              Quick Filters:
            </span>

            {/* Walkin Pill */}
            <button
              type="button"
              onClick={() => handleFilterChange('isWalkinOnly', !filters.isWalkinOnly)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '5px 12px',
                borderRadius: '999px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: filters.isWalkinOnly ? '#fef2f2' : '#f8fafc',
                color: filters.isWalkinOnly ? '#b91c1c' : '#475569',
                border: filters.isWalkinOnly ? '1px solid #fecaca' : '1px solid #e2e8f0',
              }}
            >
              <Calendar size={13} color={filters.isWalkinOnly ? '#dc2626' : '#64748b'} />
              <span>Walk-in Interviews</span>
            </button>

            {/* Verified Pill */}
            <button
              type="button"
              onClick={() => handleFilterChange('isVerifiedOnly', !filters.isVerifiedOnly)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '5px 12px',
                borderRadius: '999px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: filters.isVerifiedOnly ? '#eff6ff' : '#f8fafc',
                color: filters.isVerifiedOnly ? '#1d4ed8' : '#475569',
                border: filters.isVerifiedOnly ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              }}
            >
              <ShieldCheck size={13} color={filters.isVerifiedOnly ? '#2563eb' : '#64748b'} />
              <span>Verified Employers</span>
            </button>

            {/* Remote / Hybrid */}
            <button
              type="button"
              onClick={() =>
                handleFilterChange('workMode', filters.workMode === 'Remote' ? 'All' : 'Remote')
              }
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '5px 12px',
                borderRadius: '999px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: filters.workMode === 'Remote' ? '#f0fdf4' : '#f8fafc',
                color: filters.workMode === 'Remote' ? '#15803d' : '#475569',
                border: filters.workMode === 'Remote' ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
              }}
            >
              <span>Work from Home</span>
            </button>

            {/* Full Time */}
            <button
              type="button"
              onClick={() =>
                handleFilterChange('jobType', filters.jobType === 'Full Time' ? 'All' : 'Full Time')
              }
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '5px 12px',
                borderRadius: '999px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: filters.jobType === 'Full Time' ? '#eff6ff' : '#f8fafc',
                color: filters.jobType === 'Full Time' ? '#2563eb' : '#475569',
                border: filters.jobType === 'Full Time' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              }}
            >
              <span>Full Time</span>
            </button>

            {(search || city || filters.isWalkinOnly || filters.isVerifiedOnly || filters.workMode !== 'All' || filters.jobType !== 'All') && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  color: '#dc2626',
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <RotateCcw size={12} /> Reset all
              </button>
            )}
          </div>
        </div>

        {/* Layout: Filters Sidebar + Job List */}
        <div className="jobs-layout-grid">
          
          {/* Left Filters Sidebar (Desktop) */}
          <aside style={{ display: mobileFiltersOpen ? 'block' : undefined }}>
            <JobFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Right Job Content Column */}
          <div>
            {/* Header Result Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                padding: '4px 0',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {city ? `Jobs in ${city}` : 'Explore All Verified Jobs'}
                </h2>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '3px 0 0' }}>
                  Showing <strong style={{ color: '#0f172a' }}>{totalJobs}</strong> opportunities
                  {search ? ` for "${search}"` : ''}
                </p>
              </div>
            </div>

            {/* Job List Container */}
            <JobList
              jobs={data?.data || []}
              loading={isLoading}
              onResetFilters={handleResetFilters}
            />

            {/* Modern Pagination Bar */}
            {data?.pagination && data.pagination.pages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '36px',
                }}
              >
                <button
                  disabled={page === 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ opacity: page === 1 ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#475569' }}>
                  Page {page} of {data.pagination.pages}
                </span>

                <button
                  disabled={page === data.pagination.pages}
                  onClick={() => {
                    setPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ opacity: page === data.pagination.pages ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
