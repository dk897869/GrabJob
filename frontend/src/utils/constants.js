export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '188962680735-u57he0umbhp9juopsct28iinm6v0ifvi.apps.googleusercontent.com';
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

export const JOB_CATEGORIES = [
  { id: 'it', name: 'IT & Software', count: '2,500+ jobs', icon: 'Code' },
  { id: 'support', name: 'Customer Support', count: '1,800+ jobs', icon: 'Headphones' },
  { id: 'sales', name: 'Sales & Business', count: '1,600+ jobs', icon: 'Briefcase' },
  { id: 'hr', name: 'HR & Recruitment', count: '800+ jobs', icon: 'Users' },
  { id: 'finance', name: 'Finance & Accounting', count: '700+ jobs', icon: 'FileSpreadsheet' },
  { id: 'healthcare', name: 'Healthcare', count: '650+ jobs', icon: 'HeartPulse' },
  { id: 'education', name: 'Education', count: '600+ jobs', icon: 'GraduationCap' },
  { id: 'marketing', name: 'Marketing', count: '500+ jobs', icon: 'Megaphone' },
  { id: 'telecom', name: 'Telecom', count: '450+ jobs', icon: 'Radio' },
];

export const TOP_CITIES = [
  'All India',
  'Chandigarh',
  'Mohali',
  'Delhi',
  'Gurgaon',
  'Noida',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Mumbai',
  'Chennai',
  'Kolkata',
  'Jaipur',
];

export const JOB_TYPES = ['All', 'Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'];
export const WORK_MODES = ['All', 'On-site', 'Hybrid', 'Remote'];
export const EXPERIENCE_RANGES = ['All', 'Freshers (0-1 Yrs)', '1-3 Years', '3-5 Years', '5+ Years'];
