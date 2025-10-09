'use client';

import dynamic from 'next/dynamic';
import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';

// Dynamic import for better bundle splitting
const TheirPrivateGarden = dynamic(
  () => import('@/components/garden/TheirPrivateGarden').then(mod => ({ default: mod.TheirPrivateGarden })),
  {
    loading: () => <PageLoadingSpinner text="Loading private garden..." />,
    ssr: false // Disable SSR to prevent hydration issues
  }
);

export default function TheirPrivateGardenPage() {
  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <TheirPrivateGarden />
    </ErrorBoundary>
  );
}
