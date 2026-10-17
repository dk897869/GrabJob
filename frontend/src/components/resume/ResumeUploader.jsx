import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { resumeService } from '../../services/resumeService';
import toast from 'react-hot-toast';

export default function ResumeUploader({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selected) => {
    const ext = selected.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc'].includes(ext)) {
      toast.error('Only PDF and DOCX documents are allowed');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const res = await resumeService.uploadResume(file);
      if (res.success) {
        toast.success('Resume parsed successfully!');
        onUploaded({
          resumeId: res.data.resumeId,
          parsedData: res.data.parsedData,
          fileName: file.name,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to parse resume document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? 'var(--primary)' : '#cbd5e1'}`,
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          background: dragActive ? '#eff6ff' : '#f8fafc',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={handleChange}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%',
          }}
        />

        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Upload size={28} />
        </div>

        {file ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#16a34a', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
              <CheckCircle2 size={18} />
              <span>{file.name}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
            </p>
          </div>
        ) : (
          <div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '6px' }}>
              Upload your existing resume
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '12px' }}>
              Drag and drop your PDF or DOCX file here, or click to browse
            </p>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', background: '#ffffff', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #e2e8f0' }}>
              Maximum file size: 5MB
            </span>
          </div>
        )}
      </div>

      {file && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={handleUpload}
            loading={loading}
            style={{ minWidth: '220px' }}
          >
            Extract & Continue
          </Button>
        </div>
      )}
    </div>
  );
}
