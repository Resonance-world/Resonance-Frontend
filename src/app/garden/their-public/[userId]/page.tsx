'use client';

import dynamic from 'next/dynamic';
import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';
import { LoadingWrapper } from '@/components/ui/LoadingWrapper';

// Dynamic import for better bundle splitting
const TheirPublicGarden = dynamic(
  () => import('@/components/garden/TheirPublicGarden').then(mod => ({ default: mod.TheirPublicGarden })),
  {
    loading: () => <PageLoadingSpinner text="Loading public garden..." />
  }
);

export default function TheirPublicGardenPage() {
  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <LoadingWrapper loadingText="Loading public garden..." minLoadingTime={1500}>
        <TheirPublicGarden />
      </LoadingWrapper>
    </ErrorBoundary>
  );
}
