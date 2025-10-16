'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';

// Simple dynamic import without loading state - let the component handle its own loading
const TheirPublicGarden = dynamic(
  () => import('@/components/garden/TheirPublicGarden').then(mod => ({ default: mod.TheirPublicGarden }))
);

export default function TheirPublicGardenPage() {
  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <TheirPublicGarden />
    </ErrorBoundary>
  );
}
