import React from 'react';
import { Filter, RotateCcw, Calendar, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { JOB_TYPES, WORK_MODES, EXPERIENCE_RANGES } from '../../utils/constants';

export default function JobFilters({
  filters,
  onChange,
  onReset,
  className = '',
}) {
  // Count active non-default filters
  let activeCount = 0;
  if (filters.isWalkinOnly) activeCount++;
  if (filters.isVerifiedOnly) activeCount++;
  if (filters.jobType && filters.jobType !== 'All') activeCount++;
  if (filters.workMode && filters.workMode !== 'All') activeCount++;
  if (filters.experience && filters.experience !== 'All') activeCount++;
  if (filters.minSalary) activeCount++;

  return (
    <div
      className={className}
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '22px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* Filters Card Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '14px',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Filter size={16} />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#0f172a' }}>Filters</span>
            {activeCount > 0 && (
              <span
                style={{
                  marginLeft: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '999px',
                }}
              >
                {activeCount}
              </span>
            )}
          </div>
        </div>

        {activeCount > 0 && (
          <button
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#dc2626',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '4px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <RotateCcw size={12} /> Clear All
          </button>
        )}
      </div>

      {/* Prominent Toggles: Walk-ins & Verified */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
        <div
          onClick={() => onChange('isWalkinOnly', !filters.isWalkinOnly)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: '10px',
            border: filters.isWalkinOnly ? '1.5px solid #ef4444' : '1px solid #e2e8f0',
            background: filters.isWalkinOnly ? '#fef2f2' : '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color={filters.isWalkinOnly ? '#dc2626' : '#64748b'} />
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: filters.isWalkinOnly ? '#b91c1c' : '#334155' }}>
              Walk-in Drives Only
            </span>
          </div>
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              border: filters.isWalkinOnly ? '2px solid #dc2626' : '2px solid #cbd5e1',
              background: filters.isWalkinOnly ? '#dc2626' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            {filters.isWalkinOnly && <Check size={12} strokeWidth={3} />}
          </div>
        </div>

        <div
          onClick={() => onChange('isVerifiedOnly', !filters.isVerifiedOnly)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: '10px',
            border: filters.isVerifiedOnly ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
            background: filters.isVerifiedOnly ? '#eff6ff' : '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color={filters.isVerifiedOnly ? '#2563eb' : '#64748b'} />
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: filters.isVerifiedOnly ? '#1d4ed8' : '#334155' }}>
              Verified Employers Only
            </span>
          </div>
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              border: filters.isVerifiedOnly ? '2px solid #2563eb' : '2px solid #cbd5e1',
              background: filters.isVerifiedOnly ? '#2563eb' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            {filters.isVerifiedOnly && <Check size={12} strokeWidth={3} />}
          </div>
        </div>
      </div>

      {/* Work Mode */}
      <div style={{ marginBottom: '22px' }}>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
          Work Mode
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {WORK_MODES.map((mode) => {
            const isSelected = (filters.workMode || 'All') === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onChange('workMode', mode)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#2563eb' : '#475569',
                  background: isSelected ? '#eff6ff' : '#f8fafc',
                  border: isSelected ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Type */}
      <div style={{ marginBottom: '22px' }}>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
          Job Type
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {JOB_TYPES.map((type) => {
            const isSelected = (filters.jobType || 'All') === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange('jobType', type)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#2563eb' : '#475569',
                  background: isSelected ? '#eff6ff' : '#f8fafc',
                  border: isSelected ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience */}
      <div style={{ marginBottom: '22px' }}>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
          Experience
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {EXPERIENCE_RANGES.map((exp) => {
            const isSelected = (filters.experience || 'All') === exp;
            return (
              <label
                key={exp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  color: isSelected ? '#0f172a' : '#475569',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  background: isSelected ? '#f8fafc' : 'transparent',
                }}
              >
                <input
                  type="radio"
                  name="experience"
                  checked={isSelected}
                  onChange={() => onChange('experience', exp)}
                  style={{ accentColor: '#2563eb', cursor: 'pointer' }}
                />
                <span>{exp}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Minimum Annual Salary */}
      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
          Min Annual CTC
        </label>
        <select
          value={filters.minSalary || ''}
          onChange={(e) => onChange('minSalary', e.target.value)}
          style={{
            width: '100%',
            padding: '9px 12px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            fontSize: '0.86rem',
            color: '#0f172a',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="">Any Salary</option>
          <option value="300000">₹3,00,000+ (3 LPA+)</option>
          <option value="600000">₹6,00,000+ (6 LPA+)</option>
          <option value="1000000">₹10,00,000+ (10 LPA+)</option>
          <option value="1500000">₹15,00,000+ (15 LPA+)</option>
          <option value="2500000">₹25,00,000+ (25 LPA+)</option>
        </select>
      </div>
    </div>
  );
}
