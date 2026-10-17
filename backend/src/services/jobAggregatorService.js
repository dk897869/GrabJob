const Job = require('../models/Job');
const JobSource = require('../models/JobSource');

/**
 * Base Interface for Compliant Job Source Adapters
 */
class JobSourceAdapter {
  constructor(sourceConfig) {
    this.name = sourceConfig.name;
    this.type = sourceConfig.type;
    this.apiUrl = sourceConfig.apiUrl;
  }

  async fetchJobs() {
    throw new Error('fetchJobs method must be implemented by adapter');
  }

  normalizeJob(rawJob) {
    throw new Error('normalizeJob method must be implemented by adapter');
  }
}

/**
 * Employer Direct Submission Adapter
 */
class EmployerAdapter extends JobSourceAdapter {
  normalizeJob(jobData, employerUser) {
    return {
      title: jobData.title,
      company: jobData.company,
      companyLogo: jobData.companyLogo || '',
      companyWebsite: jobData.companyWebsite || '',
      description: jobData.description,
      responsibilities: jobData.responsibilities || [],
      requirements: jobData.requirements || [],
      skills: jobData.skills || [],
      benefits: jobData.benefits || [],
      salaryMin: Number(jobData.salaryMin) || 0,
      salaryMax: Number(jobData.salaryMax) || 0,
      salaryDisplay: jobData.salaryDisplay || (jobData.salaryMin ? `₹${jobData.salaryMin.toLocaleString('en-IN')} - ₹${jobData.salaryMax.toLocaleString('en-IN')}` : 'Best in Industry'),
      experience: jobData.experience || '0-2 Years',
      jobType: jobData.jobType || 'Full Time',
      workMode: jobData.workMode || 'On-site',
      category: jobData.category || 'IT & Software',
      city: jobData.city,
      state: jobData.state,
      address: jobData.address || '',
      location: {
        type: 'Point',
        coordinates: [Number(jobData.longitude) || 76.7794, Number(jobData.latitude) || 30.7333],
      },
      isWalkin: Boolean(jobData.isWalkin),
      walkinDate: jobData.walkinDate ? new Date(jobData.walkinDate) : undefined,
      walkinDateDisplay: jobData.walkinDateDisplay || '',
      walkinStartTime: jobData.walkinStartTime || '',
      walkinEndTime: jobData.walkinEndTime || '',
      walkinVenue: jobData.walkinVenue || '',
      walkinAddress: jobData.walkinAddress || '',
      source: 'employer',
      sourceName: jobData.company || 'Direct Employer',
      sourceUrl: jobData.sourceUrl || '',
      sourceJobId: jobData.sourceJobId || `emp_${Date.now()}`,
      isVerified: true,
      isDemo: false,
      status: 'active',
      postedBy: employerUser?._id,
    };
  }
}

/**
 * Official Partner API Adapter (Compliant feeds only)
 */
class OfficialApiAdapter extends JobSourceAdapter {
  normalizeJob(apiJob, sourceName = 'Official Partner API') {
    return {
      title: apiJob.title || apiJob.job_title,
      company: apiJob.company || apiJob.company_name,
      description: apiJob.description || apiJob.job_description || 'Verified job opportunity.',
      skills: Array.isArray(apiJob.skills) ? apiJob.skills : [],
      city: apiJob.city || apiJob.location || 'Pan India',
      state: apiJob.state || 'India',
      jobType: apiJob.jobType || 'Full Time',
      workMode: apiJob.workMode || 'On-site',
      source: 'official_api',
      sourceName: sourceName,
      sourceUrl: apiJob.apply_url || apiJob.url || '',
      sourceJobId: String(apiJob.id || apiJob.job_id || Date.now()),
      isVerified: true,
      isDemo: false,
      status: 'active',
    };
  }
}

/**
 * Aggregator Service Manager
 */
class JobAggregatorService {
  constructor() {
    this.adapters = new Map();
    this.adapters.set('employer', new EmployerAdapter({ name: 'Employer Submission', type: 'employer' }));
    this.adapters.set('official_api', new OfficialApiAdapter({ name: 'Partner Feeds', type: 'official_api' }));
  }

  getAdapter(type) {
    return this.adapters.get(type) || this.adapters.get('employer');
  }

  async importVerifiedJob(jobData, user = null) {
    const adapter = this.getAdapter(jobData.source || 'employer');
    const normalized = adapter.normalizeJob(jobData, user);
    return await Job.create(normalized);
  }

  async getRegisteredSources() {
    return await JobSource.find().sort({ createdAt: -1 });
  }
}

module.exports = new JobAggregatorService();
