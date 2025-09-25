import { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
}

/**
 * Onboarding layout provides a clean, focused environment for the multi-step onboarding flow
 * This layout removes navigation and other distractions to guide users through setup
 */
export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 