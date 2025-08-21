import { auth } from '@/auth';
import { ChatbotOnboarding } from '@/components/onboarding/ChatbotOnboarding';
import { redirect } from 'next/navigation';

/**
 * Main onboarding page with conversational chatbot interface
 * Based on Figma wireframes - dark theme chat experience
 */
export default async function OnboardingPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/');
  }

  return <ChatbotOnboarding />;
} 