import React from 'react';
import { Download, Mail, CheckCircle2, FileText } from 'lucide-react';
import Button from '../common/Button';
import { API_BASE_URL } from '../../utils/constants';

export default function ResumeResult({ result, onStartNew }) {
  const backendBase = API_BASE_URL.replace('/api', '');
  const pdfFullUrl = result.pdfUrl ? `${backendBase}${result.pdfUrl}` : '#';
  const docxFullUrl = result.docxUrl ? `${backendBase}${result.docxUrl}` : '#';

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '30px 20px' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#dcfce7',
          color: '#16a34a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}
      >
        <CheckCircle2 size={36} />
      </div>

      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '8px' }}>
        Your ATS Resume Is Ready!
      </h2>
      <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '28px', lineHeight: '1.6' }}>
        We have optimized your formatting and keywords for applicant tracking systems. A copy has also been sent to your registered email address.
      </p>

      {/* Download Action Box */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '28px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <a
            href={pdfFullUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="btn btn-primary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={18} /> Download PDF
          </a>

          <a
            href={docxFullUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="btn btn-outline btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FileText size={18} /> Download DOCX
          </a>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '20px',
            fontSize: '0.84rem',
            color: '#16a34a',
            background: '#f0fdf4',
            padding: '8px 14px',
            borderRadius: '8px',
          }}
        >
          <Mail size={16} />
          <span>Email attachment delivered to your inbox</span>
        </div>
      </div>

      <button onClick={onStartNew} className="btn btn-outline btn-sm">
        Optimize Another Resume
      </button>
    </div>
  );
}
