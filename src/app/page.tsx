import { AuthButton } from '../components/AuthButton';
import { ResonanceLogo } from '../components/ui/ResonanceLogo';
import { OptimizedBackground } from '../components/ui/OptimizedBackground';

export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
      {/* Optimized Garden Background Image */}
      <OptimizedBackground 
        imageSrc="/garden_background.png"
        filter="brightness(0.3) sepia(0.2) saturate(1.2)"
        priority={true}
      />
      
      {/* Glass Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30 backdrop-blur-[1px]"></div>
      
      {/* Main Content Container with Glass Effect */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Logo/Brand Section with Glass Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="scale-150">
                <ResonanceLogo size="lg" showText={false} />
              </div>
            </div>
            <p className="text-lg text-amber-100/90 leading-relaxed">
              Connect through meaningful conversation you actually want to have
            </p>
          </div>
        </div>
        
        {/* Sign In Section */}
        <div className="w-full max-w-sm">
          <AuthButton />
        </div>
        
        {/* Subtle Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-white/60">
            Powered by World ID
          </p>
        </div>
      </div>
    </div>
  );
}
