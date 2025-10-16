'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';

// Simple dynamic import without loading state - let the component handle its own loading
const CirclesPage = dynamic(
  () => import('@/components/circles/CirclesPage').then(mod => ({ default: mod.CirclesPage }))
);

/**
 * Circles Page Route
 * Route: /circles
 */
export default function CirclesRoute() {
  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <CirclesPage />
    </ErrorBoundary>
  );
} 