import { Page } from '@/components/PageLayout';
import Link from 'next/link';

/**
 * Guest Home Page - Demo experience for non-authenticated users
 * Route: /guest
 */
export default function GuestPage() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center gap-6 min-h-screen p-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to InnerView</h1>
                     <p className="text-white/80">You&apos;ve completed the onboarding as a guest!</p>
        </div>
        
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <div className="bg-white/10 rounded-lg p-6 border border-white/20">
            <h2 className="text-white font-semibold mb-3">🎉 Onboarding Complete</h2>
            <p className="text-white/80 text-sm mb-4">
                             You&apos;ve experienced the InnerView onboarding flow! In a real app, you would now:
            </p>
            <ul className="text-white/70 text-sm space-y-2">
              <li>• Connect with matched users</li>
              <li>• Start meaningful conversations</li>
              <li>• Build your personal garden</li>
              <li>• Explore social circles</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-3">
            <Link 
              href="/test"
              className="w-full py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 text-white text-center rounded-lg border border-blue-500/30 transition-colors"
            >
              Feature Validation Dashboard
            </Link>
            
            <Link 
              href="/"
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white text-center rounded-lg border border-white/20 transition-colors"
            >
              Back to Login
            </Link>
          </div>
          
          <p className="text-xs text-white/50 text-center mt-4">
            To access the full app experience, please authenticate with your World ID wallet
          </p>
        </div>
      </Page.Main>
    </Page>
  );
} 