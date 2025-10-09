'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';

// Dynamic import for better bundle splitting
const MyPublicGarden = dynamic(
  () => import('@/components/garden/MyPublicGarden').then(mod => ({ default: mod.MyPublicGarden }))
);

/**
 * Garden Page Route - Public garden (default)
 * Route: /garden
 * This is the main garden page that users see when clicking the garden nav item
 */
export default function GardenRoute() {
  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <MyPublicGarden />
    </ErrorBoundary>
  );
}


