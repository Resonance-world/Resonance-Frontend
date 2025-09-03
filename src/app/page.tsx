import { Page } from '@/components/PageLayout';
import { AuthButton } from '../components/AuthButton';
import Link from 'next/link';

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center gap-6 min-h-screen p-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to InnerView</h1>
          <p className="text-white/80">Connect authentically with others</p>
        </div>
        
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <AuthButton />
          
          {/* Guest mode for development/testing */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-white/60">For Testing & Development</span>
            </div>
          </div>
          
                     <Link
             href="/onboarding"
             className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white text-center rounded-lg border border-white/20 transition-colors"
           >
             Continue as Guest
           </Link>
          
                     <p className="text-xs text-white/50 text-center">
             Guest mode gives you full app access for development
           </p>
        </div>
        
        {/* Debug info for development */}
        <div className="mt-8 text-xs text-white/40 text-center">
          <p>Build: {process.env.NODE_ENV}</p>
          <p>Deployment working ✅</p>
        </div>
      </Page.Main>
    </Page>
  );
}
