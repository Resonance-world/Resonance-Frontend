import { AuthButton } from '../components/AuthButton';
import { ResonanceLogo } from '../components/ui/ResonanceLogo';

export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
      {/* Garden Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/garden_background.png)',
          filter: 'brightness(0.4) sepia(0.2) saturate(1.2)'
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Logo/Brand */}
      <div className="relative z-10 text-center mb-16">
        <div className="flex justify-center mb-8">
          <div className="scale-150">
            <ResonanceLogo size="lg" showText={false} />
          </div>
        </div>
        <p className="text-xl text-amber-100 max-w-lg mx-auto leading-relaxed drop-shadow-md">
          Connect through meaningful conversation you actually want to have
        </p>
      </div>
      
      {/* Main Sign In Action */}
      <div className="relative z-10 w-full max-w-md">
        <AuthButton />
      </div>
    </div>
  );
}
