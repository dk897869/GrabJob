export const formatSalary = (min, max, display) => {
  if (display) return display;
  if (!min && !max) return 'Best in Industry';
  if (min && !max) return `₹${min.toLocaleString('en-IN')} / Yr`;
  return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')} / Yr`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const timeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const diff = (new Date() - new Date(dateString)) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return formatDate(dateString);
};
