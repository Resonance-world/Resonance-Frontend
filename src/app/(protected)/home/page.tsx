import { auth } from '@/auth';
import { LivingRoom } from '@/components/home/LivingRoom';

/**
 * Home page - Main living room interface
 * Based on Figma wireframes with prompt system and matching
 */
export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return <div>Please log in</div>;
  }

  return <LivingRoom session={session} />;
}
