'use client';

interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
}

export const SkeletonLoader = ({ className = '', lines = 1 }: SkeletonLoaderProps) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-white/20 rounded mb-2 last:mb-0"
          style={{
            width: `${Math.random() * 40 + 60}%` // Random width between 60-100%
          }}
        />
      ))}
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 animate-pulse">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-12 h-12 bg-white/20 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-white/20 rounded w-3/4 mb-2" />
        <div className="h-3 bg-white/20 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-white/20 rounded w-full" />
      <div className="h-3 bg-white/20 rounded w-5/6" />
      <div className="h-3 bg-white/20 rounded w-4/6" />
    </div>
  </div>
);

export const MatchCardSkeleton = () => (
  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-white/20 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-white/20 rounded w-2/3 mb-1" />
        <div className="h-3 bg-white/20 rounded w-1/2" />
      </div>
      <div className="w-16 h-8 bg-white/20 rounded" />
    </div>
  </div>
);

export const PromptSkeleton = () => (
  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 animate-pulse">
    <div className="h-6 bg-white/20 rounded w-1/3 mb-4" />
    <div className="space-y-2">
      <div className="h-4 bg-white/20 rounded w-full" />
      <div className="h-4 bg-white/20 rounded w-4/5" />
      <div className="h-4 bg-white/20 rounded w-3/5" />
    </div>
    <div className="mt-4 flex space-x-2">
      <div className="h-8 bg-white/20 rounded w-20" />
      <div className="h-8 bg-white/20 rounded w-16" />
    </div>
  </div>
);

