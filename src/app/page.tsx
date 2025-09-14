import { AuthButton } from '../components/AuthButton';
import { ResonanceLogo } from '../components/ui/ResonanceLogo';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-stone-900 to-orange-900 flex flex-col items-center justify-center p-4" style={{backgroundColor: 'var(--resonance-dark-bg)'}}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.1)_0%,transparent_70%)]"></div>
      
      {/* Logo/Brand */}
      <div className="relative z-10 text-center mb-12">
        <div className="flex flex-col items-center justify-center mb-6">
          <ResonanceLogo size="lg" showText={false} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          RESONANCE
        </h1>
        <p className="text-xl text-amber-200 max-w-md mx-auto leading-relaxed">
          Connect authentically with others through meaningful conversations
        </p>
      </div>
      
      {/* Main Actions */}
      <div className="relative z-10 w-full max-w-sm space-y-6">
        {/* Primary Auth Button */}
        <div className="space-y-4">
          <AuthButton />
        </div>
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-900 px-4 text-gray-400 uppercase tracking-wider">
              For Development
            </span>
          </div>
        </div>
        
        {/* Guest Mode */}
        <div className="space-y-3">
          <Link
            href="/onboarding"
            className="w-full flex items-center justify-center py-4 px-6 bg-gray-800/50 hover:bg-gray-700/50 text-white text-center rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200 backdrop-blur-sm group"
          >
            <span className="mr-2">🚀</span>
            Continue as Guest
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </Link>
          
          <p className="text-sm text-gray-400 text-center leading-relaxed">
            Guest mode provides full app access for testing and development
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="relative z-10 mt-16 text-center">
        <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Deployment Active
          </span>
          <span>•</span>
          <span>Build: {process.env.NODE_ENV}</span>
        </div>
      </div>
    </div>
  );
}
