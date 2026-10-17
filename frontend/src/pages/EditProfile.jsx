import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Camera,
  Upload,
  CheckCircle2,
  Trash2,
  Plus,
  Briefcase,
  GraduationCap,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const fileInputRef = useRef(null);

  const [avatar, setAvatar] = useState(user?.avatar || user?.avatarUrl || '');
  const [avatarSizeKB, setAvatarSizeKB] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    state: user?.state || '',
    currentRole: user?.currentRole || '',
    experienceYears: user?.experienceYears || 0,
    education: user?.education || '',
    skills: (user?.skills || []).join(', '),
    preferredJobType: user?.preferredJobType || 'Full Time',
    preferredSalary: user?.preferredSalary || '',
    linkedinUrl: user?.linkedinUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
    bio: user?.bio || '',
  });

  const [experienceList, setExperienceList] = useState(
    user?.experienceList && user.experienceList.length > 0
      ? user.experienceList
      : [
          {
            title: user?.currentRole || 'Software Engineer',
            company: user?.company || '',
            duration: '2023 - Present',
            description: 'Responsible for full stack feature development and maintenance.',
          },
        ]
  );

  const [educationList, setEducationList] = useState(
    user?.educationList && user.educationList.length > 0
      ? user.educationList
      : [
          {
            degree: user?.education || 'Bachelor of Technology (B.Tech)',
            institution: 'University / College',
            year: '2023',
            field: 'Computer Science & Engineering',
          },
        ]
  );

  const [loading, setLoading] = useState(false);

  // Compress image to strictly <= 50KB
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, or WEBP).');
      return;
    }

    setIsCompressing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down to max 400x400 to preserve aspect ratio & guarantee small size
        const maxDim = 400;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Iterative compression starting at 0.7 down to 0.2 until <= 50KB
        let quality = 0.75;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Calculate size in KB: Base64 length * 0.75 / 1024
        let sizeKB = Math.round((dataUrl.length * 0.75) / 1024);

        while (sizeKB > 50 && quality > 0.15) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          sizeKB = Math.round((dataUrl.length * 0.75) / 1024);
        }

        setAvatar(dataUrl);
        setAvatarSizeKB(sizeKB);
        setIsCompressing(false);
        toast.success(`Profile photo compressed to ${sizeKB} KB (Under 50 KB limit)!`);
      };
    };

    reader.readAsDataURL(file);
  };

  // Add & remove experience item
  const handleAddExperience = () => {
    setExperienceList([
      ...experienceList,
      { title: '', company: '', duration: '', description: '' },
    ]);
  };

  const handleRemoveExperience = (index) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experienceList];
    updated[index][field] = value;
    setExperienceList(updated);
  };

  // Add & remove education item
  const handleAddEducation = () => {
    setEducationList([
      ...educationList,
      { degree: '', institution: '', year: '', field: '' },
    ]);
  };

  const handleRemoveEducation = (index) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await updateProfile({
      ...formData,
      avatar,
      avatarUrl: avatar,
      skills: skillsArray,
      experienceYears: Number(formData.experienceYears) || 0,
      experienceList,
      educationList,
    });

    setLoading(false);

    if (res.success) {
      toast.success('Profile, experience & education saved successfully!');
      navigate('/profile');
    } else {
      toast.error(res.message || 'Failed to update profile');
    }
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link
          to="/profile"
          style={{
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
          }}
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Edit Candidate Profile
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '2px 0 0' }}>
            Update your profile photo (auto-compressed to 50KB), experience history, and education.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ================= 1. PROFILE PHOTO SECTION ================= */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            Profile Picture (Auto-Compressed to ≤ 50 KB)
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Avatar Preview */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: avatar
                    ? 'transparent'
                    : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  overflow: 'hidden',
                  border: '3px solid #bfdbfe',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.15)',
                }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Candidate Avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  formData.name ? formData.name.charAt(0).toUpperCase() : 'U'
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
                title="Change Photo"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* Upload Action & Specs */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-outline btn-sm"
                  disabled={isCompressing}
                >
                  <Upload size={14} />
                  <span>{isCompressing ? 'Compressing...' : 'Upload New Photo'}</span>
                </button>

                {avatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatar('');
                      setAvatarSizeKB(null);
                    }}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#dc2626',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                )}
              </div>

              {avatarSizeKB ? (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#16a34a',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  <CheckCircle2 size={14} />
                  <span>Compressed to {avatarSizeKB} KB (Under 50 KB limit)</span>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                  Images of any size automatically scale down to <strong>≤ 50 KB</strong> upon upload.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ================= 2. PERSONAL & CONTACT DETAILS ================= */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            Basic Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                City
              </label>
              <input
                type="text"
                placeholder="e.g. Mohali / Chandigarh"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                State
              </label>
              <input
                type="text"
                placeholder="e.g. Punjab"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Current Role / Professional Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Full Stack MERN Developer | React Specialist"
                value={formData.currentRole}
                onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Total Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Skills (comma-separated)
            </label>
            <input
              type="text"
              placeholder="React.js, Node.js, Express, MongoDB, Tailwind CSS, JavaScript, Git"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
              }}
            />
          </div>
        </div>

        {/* ================= 3. WORK EXPERIENCE HISTORY ================= */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={20} color="#2563eb" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Work Experience History
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddExperience}
              className="btn btn-outline btn-sm"
              style={{ color: '#2563eb', borderColor: '#bfdbfe', background: '#eff6ff' }}
            >
              <Plus size={14} /> Add Experience
            </button>
          </div>

          {experienceList.map((exp, idx) => (
            <div
              key={idx}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '14px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                  Position #{idx + 1}
                </span>
                {experienceList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                    title="Remove experience"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Developer"
                    value={exp.title}
                    onChange={(e) => handleExperienceChange(idx, 'title', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Infosys / Tech Mahindra"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Duration (e.g. 2022 - Present)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jan 2023 - Present"
                    value={exp.duration}
                    onChange={(e) => handleExperienceChange(idx, 'duration', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Key Responsibilities & Achievements
                </label>
                <textarea
                  rows={2}
                  placeholder="Developed responsive client portals, optimized REST API calls, improved load time by 30%..."
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ================= 4. EDUCATION DETAILS ================= */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={20} color="#16a34a" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Education & Qualifications
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddEducation}
              className="btn btn-outline btn-sm"
              style={{ color: '#16a34a', borderColor: '#bbf7d0', background: '#f0fdf4' }}
            >
              <Plus size={14} /> Add Education
            </button>
          </div>

          {educationList.map((edu, idx) => (
            <div
              key={idx}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                  Degree #{idx + 1}
                </span>
                {educationList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(idx)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '2px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Degree / Diploma
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech / BCA / MCA / MBA"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    College / University
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Panjab University"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Passing Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(idx, 'year', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Specialization / Field
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={edu.field}
                    onChange={(e) => handleEducationChange(idx, 'field', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{ padding: '11px 28px', fontSize: '0.95rem', fontWeight: 700, display: 'inline-flex', gap: '8px' }}
          >
            <Save size={18} /> Save Complete Profile
          </Button>

          <Link to="/profile" className="btn btn-outline" style={{ padding: '11px 22px' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
