'use client';

import React from 'react';
import { Session } from 'next-auth';
import { InteractiveOnboarding } from './InteractiveOnboarding';

interface ChatbotOnboardingProps {
  session?: Session | null;
}

export function ChatbotOnboarding({ session }: ChatbotOnboardingProps) {
  return <InteractiveOnboarding session={session} />;
}