'use client';

import React, { useState, useEffect } from 'react';
import { PageLoadingSpinner } from './LoadingSpinner';

interface LoadingWrapperProps {
  children: React.ReactNode;
  loadingText?: string;
  minLoadingTime?: number; // Minimum time to show loading (in ms)
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ 
  children, 
  loadingText = 'Loading...',
  minLoadingTime = 1000 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const timer = setTimeout(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= minLoadingTime) {
        setIsLoading(false);
      } else {
        // If not enough time has passed, wait for the remaining time
        const remainingTime = minLoadingTime - elapsed;
        setTimeout(() => setIsLoading(false), remainingTime);
      }
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [startTime, minLoadingTime]);

  if (isLoading) {
    return <PageLoadingSpinner text={loadingText} />;
  }

  return <>{children}</>;
};
