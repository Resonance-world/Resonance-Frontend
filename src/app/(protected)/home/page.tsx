import { auth } from '@/auth';
import { LivingRoom } from '@/components/home/LivingRoom';

/**
 * Home page - Main living room interface
 * Based on Figma wireframes with prompt system and matching
 */
export default async function HomePage() {
  const session = await auth();

  // For guest mode (development), create a mock session
  const guestSession = {
    user: {
      name: 'Guest User',
      username: 'guest',
      profilePictureUrl: null
    }
  };

  // Use real session if available, otherwise use guest session for development
  const activeSession = session || guestSession;

  return <LivingRoom session={activeSession} />;
}
