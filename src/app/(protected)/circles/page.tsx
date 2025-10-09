'use client';

import dynamic from 'next/dynamic';
import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';
import { LoadingWrapper } from '@/components/ui/LoadingWrapper';

// Dynamic import for better code splitting - CirclesPage is heavy with drag-drop functionality
const CirclesPage = dynamic(
  () => import('@/components/circles/CirclesPage').then(mod => ({ default: mod.CirclesPage })),
  {
    loading: () => <PageLoadingSpinner text="Loading your circles..." />
  }
);

/**
 * Circles Page Route
 * Route: /circles
 */
export default function CirclesRoute() {
  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <LoadingWrapper loadingText="Loading your circles..." minLoadingTime={1000}>
        <CirclesPage />
      </LoadingWrapper>
    </ErrorBoundary>
  );
} 