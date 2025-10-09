'use client';

import dynamic from 'next/dynamic';
import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';
import { LoadingWrapper } from '@/components/ui/LoadingWrapper';

// Dynamic import for better bundle splitting
const TheirPrivateGarden = dynamic(
  () => import('@/components/garden/TheirPrivateGarden').then(mod => ({ default: mod.TheirPrivateGarden })),
  {
    loading: () => <PageLoadingSpinner text="Loading private garden..." />
  }
);

export default function TheirPrivateGardenPage() {
  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <LoadingWrapper loadingText="Loading private garden..." minLoadingTime={1500}>
        <TheirPrivateGarden />
      </LoadingWrapper>
    </ErrorBoundary>
  );
}
