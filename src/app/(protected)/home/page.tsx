import { auth } from '@/auth';
import dynamic from 'next/dynamic';

// Dynamic import for better code splitting - LivingRoom is a heavy component
const LivingRoom = dynamic(
  () => import('@/components/home/LivingRoom').then(mod => ({ default: mod.LivingRoom })),
  {
    loading: () => <div className="flex items-center justify-center min-h-screen">Loading home...</div>,
    ssr: false
  }
);

/**
 * Home page - Main living room interface
 * Based on Figma wireframes with prompt system and matching
 */
export default async function HomePage() {
  const session = await auth();

  // For guest mode (development), create a mock session
  const guestSession = {
    user: {
      id: 'guest-user-id',
      name: 'Guest User',
      username: 'guest',
      profilePictureUrl: null
    }
  };

  // Use real session if available, otherwise use guest session for development
  const activeSession = session || guestSession;

  return <LivingRoom session={activeSession} />;
}
