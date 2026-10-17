import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bookmark, ArrowRight } from 'lucide-react';
import { jobService } from '../services/jobService';
import { LoadingSpinner, EmptyState } from '../components/common/Loading';
import JobCard from '../components/common/JobCard';
import { Link } from 'react-router-dom';

export default function SavedJobs() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-saved-jobs'],
    queryFn: () => jobService.getSavedJobs(),
  });

  const jobs = data?.data || [];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>
          Saved Job Bookmarks
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Opportunities you have bookmarked for later review and application
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading saved jobs..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No saved jobs found"
          description="Click the bookmark icon on any job card to save opportunities you're interested in."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} isSavedInit={true} />
          ))}
        </div>
      )}
    </div>
  );
}
