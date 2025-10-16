import { auth } from '@/auth';
import dynamic from 'next/dynamic';
import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';

// Dynamic import for better code splitting - LivingRoom is a heavy component
const LivingRoom = dynamic(
  () => import('@/components/home/LivingRoom').then(mod => ({ default: mod.LivingRoom })),
  {
    loading: () => <PageLoadingSpinner text="Loading your space..." />
  }
);

/**
 * Home page - Main living room interface
 * Based on Figma wireframes with prompt system and matching
 */
export default async function HomePage() {
  const session = await auth();

  // Redirect to login if no session
  if (!session) {
    return <div>Please log in to access this page.</div>;
  }

  return <LivingRoom session={session} />;
}
