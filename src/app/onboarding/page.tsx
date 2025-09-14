import { auth } from '@/auth';
import { ChatbotOnboarding } from '@/components/onboarding/ChatbotOnboarding';

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