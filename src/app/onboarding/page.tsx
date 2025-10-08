import { auth } from '@/auth';
import dynamic from 'next/dynamic';

// Dynamic import for better bundle splitting - onboarding is heavy with chatbot logic
const ChatbotOnboarding = dynamic(
  () => import('@/components/onboarding/ChatbotOnboarding').then(mod => ({ default: mod.ChatbotOnboarding })),
  {
    loading: () => <div className="flex items-center justify-center min-h-screen">Loading onboarding...</div>
  }
);

/**
 * Main onboarding page with conversational chatbot interface
 * Based on Figma wireframes - dark theme chat experience
 * Supports both authenticated users and guest mode for development
 */
export default async function OnboardingPage() {
  const session = await auth();

  // Allow both authenticated users and guests to access onboarding
  // This enables development/testing without requiring World App authentication
  return <ChatbotOnboarding session={session} />;
} 