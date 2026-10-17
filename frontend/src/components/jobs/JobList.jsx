import React from 'react';
import JobCard from '../common/JobCard';
import { SkeletonJobCard, EmptyState } from '../common/Loading';

export default function JobList({
  jobs = [],
  loading = false,
  onResetFilters,
  onApply,
}) {
  if (loading) {
    return (
      <div>
        <SkeletonJobCard />
        <SkeletonJobCard />
        <SkeletonJobCard />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No jobs matched your criteria"
        description="Try clearing some filters or searching for broader skills or locations."
        onReset={onResetFilters}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} onApply={onApply} />
      ))}
    </div>
  );
}
