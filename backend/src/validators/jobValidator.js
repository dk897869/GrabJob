const { z } = require('zod');

const jobCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  company: z.string().min(2, 'Company name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  experience: z.string().optional(),
  jobType: z.enum(['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance']).optional(),
  workMode: z.enum(['On-site', 'Hybrid', 'Remote']).optional(),
  category: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isWalkin: z.boolean().optional(),
  walkinDate: z.string().optional(),
  walkinStartTime: z.string().optional(),
  walkinEndTime: z.string().optional(),
  walkinVenue: z.string().optional(),
  walkinAddress: z.string().optional(),
  source: z.enum(['employer', 'official_api', 'licensed_feed', 'manual_verified']).optional(),
  sourceUrl: z.string().optional(),
});

module.exports = { jobCreateSchema };
