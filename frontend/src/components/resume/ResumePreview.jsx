import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import Button from '../common/Button';

export default function ResumePreview({
  parsedData,
  aiAnalysis,
  targetJob,
  onSaveData,
  onProceedToPayment,
}) {
  const [data, setData] = useState(parsedData);
  const [activeTab, setActiveTab] = useState('data'); // 'data' or 'analysis'

  const handleFieldChange = (field, value) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    if (onSaveData) onSaveData(updated);
  };

  return (
    <div>
      {/* Top Tab Bar */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('data')}
          style={{
            padding: '10px 16px',
            fontSize: '0.92rem',
            fontWeight: 700,
            borderBottom: `2px solid ${activeTab === 'data' ? 'var(--primary)' : 'transparent'}`,
            color: activeTab === 'data' ? 'var(--primary)' : '#64748b',
          }}
        >
          Review & Edit Extracted CV
        </button>

        <button
          onClick={() => setActiveTab('analysis')}
          style={{
            padding: '10px 16px',
            fontSize: '0.92rem',
            fontWeight: 700,
            borderBottom: `2px solid ${activeTab === 'analysis' ? 'var(--primary)' : 'transparent'}`,
            color: activeTab === 'analysis' ? 'var(--primary)' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Sparkles size={16} color="var(--primary)" />
          AI ATS Match Analysis
        </button>
      </div>

      {activeTab === 'data' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={data.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={data.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Summary</label>
            <textarea
              rows={3}
              className="form-input"
              value={data.summary || ''}
              onChange={(e) => handleFieldChange('summary', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Skills (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || ''}
              onChange={(e) =>
                handleFieldChange(
                  'skills',
                  e.target.value.split(',').map((s) => s.trim())
                )
              }
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <Button variant="primary" onClick={onProceedToPayment}>
              Proceed to ATS Optimization (₹50)
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {/* AI Analysis Cards */}
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--secondary)' }}>
                  ATS Match Score: {aiAnalysis?.matchScore || 78}%
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Target Role: {targetJob?.title || 'Software / Professional Role'}
                </p>
              </div>

              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {aiAnalysis?.matchScore || 78}%
              </div>
            </div>

            {/* Matching & Missing Skills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#166534', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Matching Keywords Found
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(aiAnalysis?.matchingSkills || ['JavaScript', 'React', 'Communication']).map((s, i) => (
                    <span key={i} style={{ background: '#ffffff', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#92400e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} /> Recommended Keywords to Highlight
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(aiAnalysis?.missingSkills || ['Cloud Architecture', 'Unit Testing', 'CI/CD']).map((s, i) => (
                    <span key={i} style={{ background: '#ffffff', color: '#92400e', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Improvement Tips */}
            <div style={{ marginTop: '20px' }}>
              <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lightbulb size={16} color="var(--primary)" /> AI Formatting & Presentation Tips
              </h5>
              <ul style={{ paddingLeft: '20px', fontSize: '0.86rem', color: '#334155', lineHeight: '1.6' }}>
                {(aiAnalysis?.improvementTips || [
                  'Quantify achievements with real metrics and outcomes.',
                  'Keep resume structure to a single-column layout for ATS parser readability.',
                ]).map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={onProceedToPayment}>
              Proceed to ATS Optimization (₹50)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
