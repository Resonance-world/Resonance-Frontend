'use client';

import dynamic from 'next/dynamic';
import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useSession } from 'next-auth/react';

// Dynamic import for better bundle splitting - onboarding is heavy with chatbot logic
const ChatbotOnboarding = dynamic(
  () => import('@/components/onboarding/ChatbotOnboarding').then(mod => ({ default: mod.ChatbotOnboarding })),
  {
    loading: () => <PageLoadingSpinner text="Loading onboarding..." />,
    ssr: false // Disable SSR to prevent hydration issues
  }
);

/**
 * Main onboarding page with conversational chatbot interface
 * Based on Figma wireframes - dark theme chat experience
 * Supports both authenticated users and guest mode for development
 */
export default function OnboardingPage() {
  const { data: session } = useSession();

  // Allow both authenticated users and guests to access onboarding
  // This enables development/testing without requiring World App authentication
  return <ChatbotOnboarding session={session} />;
} 