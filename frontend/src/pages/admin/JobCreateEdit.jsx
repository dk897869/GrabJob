import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { jobService } from '../../services/jobService';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

export default function JobCreateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    responsibilities: '',
    skills: '',
    salaryMin: 400000,
    salaryMax: 800000,
    experience: '1-3 Years',
    jobType: 'Full Time',
    workMode: 'On-site',
    city: 'Chandigarh',
    state: 'Punjab',
    address: '',
    latitude: 30.7333,
    longitude: 76.7794,
    isWalkin: false,
    walkinDate: '',
    walkinDateDisplay: '',
    walkinStartTime: '10:00 AM',
    walkinEndTime: '4:00 PM',
    walkinVenue: '',
    source: 'employer',
    sourceName: 'GrabJob Direct',
    isVerified: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      jobService.getJobById(id).then((res) => {
        if (res.data) {
          const j = res.data;
          setFormData({
            title: j.title || '',
            company: j.company || '',
            description: j.description || '',
            requirements: (j.requirements || []).join('\n'),
            responsibilities: (j.responsibilities || []).join('\n'),
            skills: (j.skills || []).join(', '),
            salaryMin: j.salaryMin || 0,
            salaryMax: j.salaryMax || 0,
            experience: j.experience || '1-3 Years',
            jobType: j.jobType || 'Full Time',
            workMode: j.workMode || 'On-site',
            city: j.city || '',
            state: j.state || '',
            address: j.address || '',
            latitude: j.location?.coordinates?.[1] || 30.7333,
            longitude: j.location?.coordinates?.[0] || 76.7794,
            isWalkin: Boolean(j.isWalkin),
            walkinDate: j.walkinDate ? new Date(j.walkinDate).toISOString().split('T')[0] : '',
            walkinDateDisplay: j.walkinDateDisplay || '',
            walkinStartTime: j.walkinStartTime || '10:00 AM',
            walkinEndTime: j.walkinEndTime || '4:00 PM',
            walkinVenue: j.walkinVenue || '',
            source: j.source || 'employer',
            sourceName: j.sourceName || 'GrabJob Direct',
            isVerified: Boolean(j.isVerified),
          });
        }
      });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        requirements: formData.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
        responsibilities: formData.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean),
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      };

      if (isEditing) {
        await adminService.updateJob(id, payload);
        toast.success('Job listing updated successfully!');
      } else {
        await adminService.createJob(payload);
        toast.success('New job posted successfully!');
      }
      navigate('/admin/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link to="/admin/jobs" style={{ color: '#94a3b8' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
          {isEditing ? 'Edit Job Posting' : 'Create New Job Listing'}
        </h1>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '32px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Job Title</label>
              <input
                type="text"
                required
                className="form-input"
                style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Company Name</label>
              <input
                type="text"
                required
                className="form-input"
                style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Job Description</label>
            <textarea
              rows={4}
              required
              className="form-input"
              style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Responsibilities (one per line)</label>
              <textarea
                rows={3}
                className="form-input"
                style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Requirements (one per line)</label>
              <textarea
                rows={3}
                className="form-input"
                style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Required Skills (comma separated)</label>
            <input
              type="text"
              className="form-input"
              style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Min Salary (₹/Yr)</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Max Salary (₹/Yr)</label>
              <input
                type="number"
                className="form-input"
                style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Experience</label>
              <input
                type="text"
                className="form-input"
                style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>City</label>
              <input
                type="text"
                required
                className="form-input"
                style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>State</label>
              <input
                type="text"
                required
                className="form-input"
                style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
          </div>

          {/* Coordinates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Latitude (for Map)</label>
              <input
                type="number"
                step="0.0001"
                className="form-input"
                style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Longitude (for Map)</label>
              <input
                type="number"
                step="0.0001"
                className="form-input"
                style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              />
            </div>
          </div>

          {/* Walk-in Section */}
          <div style={{ background: '#0f172a', padding: '18px', borderRadius: '8px', margin: '20px 0', border: '1px solid #334155' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '14px' }}>
              <input
                type="checkbox"
                checked={formData.isWalkin}
                onChange={(e) => setFormData({ ...formData, isWalkin: e.target.checked })}
              />
              <span style={{ fontWeight: 700, color: '#f87171' }}>This is a Walk-in Interview Event</span>
            </label>

            {formData.isWalkin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Walk-in Date Display (e.g. Today / 25 Sep)</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#1e293b', color: '#ffffff', borderColor: '#475569' }}
                    value={formData.walkinDateDisplay}
                    onChange={(e) => setFormData({ ...formData, walkinDateDisplay: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Walk-in Venue Address</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#1e293b', color: '#ffffff', borderColor: '#475569' }}
                    value={formData.walkinVenue}
                    onChange={(e) => setFormData({ ...formData, walkinVenue: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="submit" variant="primary" loading={loading}>
              <Save size={16} /> {isEditing ? 'Update Job' : 'Publish Job'}
            </Button>
            <Link to="/admin/jobs" className="btn btn-outline" style={{ color: '#ffffff', borderColor: '#475569' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
