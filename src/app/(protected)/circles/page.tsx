import dynamic from 'next/dynamic';

// Dynamic import for better code splitting - CirclesPage is heavy with drag-drop functionality
const CirclesPage = dynamic(
  () => import('@/components/circles/CirclesPage').then(mod => ({ default: mod.CirclesPage })),
  {
    loading: () => <div className="flex items-center justify-center min-h-screen">Loading circles...</div>,
    ssr: false
  }
);

/**
 * Circles Page Route
 * Route: /circles
 */
export default function CirclesRoute() {
  return <CirclesPage />;
} 