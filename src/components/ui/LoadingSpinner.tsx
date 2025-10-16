'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-white/20 border-t-white rounded-full animate-spin`} />
      {text && (
        <p className="text-white/70 text-sm animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const PageLoadingSpinner = ({ text = 'Loading page...' }: { text?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-black/40">
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  </div>
);

export const ComponentLoadingSpinner = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="md" text={text} />
  </div>
);
