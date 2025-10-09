'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';

// Simple dynamic import without loading state - let the component handle its own loading
const TheirPrivateGarden = dynamic(
  () => import('@/components/garden/TheirPrivateGarden').then(mod => ({ default: mod.TheirPrivateGarden }))
);

export default function TheirPrivateGardenPage() {
  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <TheirPrivateGarden />
    </ErrorBoundary>
  );
}
