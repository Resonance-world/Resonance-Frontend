'use client';

import dynamic from 'next/dynamic';
import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';

// Dynamic import for better code splitting - CirclesPage is heavy with drag-drop functionality
const CirclesPage = dynamic(
  () => import('@/components/circles/CirclesPage').then(mod => ({ default: mod.CirclesPage })),
  {
    loading: () => <PageLoadingSpinner text="Loading your circles..." />,
    ssr: false // Disable SSR to prevent hydration issues
  }
);

/**
 * Circles Page Route
 * Route: /circles
 */
export default function CirclesRoute() {
  return <CirclesPage />;
} 