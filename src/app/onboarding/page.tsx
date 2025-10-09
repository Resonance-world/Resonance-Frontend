'use client';

import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';

// Simple dynamic import without loading state - let the component handle its own loading
const ChatbotOnboarding = dynamic(
  () => import('@/components/onboarding/ChatbotOnboarding').then(mod => ({ default: mod.ChatbotOnboarding }))
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
  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <ChatbotOnboarding session={session} />
    </ErrorBoundary>
  );
} 