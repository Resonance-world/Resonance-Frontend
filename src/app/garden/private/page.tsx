'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';

// Dynamic import for better bundle splitting
const PrivateGarden = dynamic(
  () => import('@/components/garden/PrivateGarden').then(mod => ({ default: mod.PrivateGarden }))
);

export default function PrivateGardenPage() {
  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <PrivateGarden />
    </ErrorBoundary>
  );
}
