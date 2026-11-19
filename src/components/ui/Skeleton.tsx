import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`} />
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner Skeleton */}
      <Skeleton className="h-20 rounded-2xl w-full" />

      {/* Hero row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-around py-6 gap-6">
            <Skeleton className="h-44 w-44 rounded-full" />
            <div className="space-y-3 w-full max-w-xs">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
