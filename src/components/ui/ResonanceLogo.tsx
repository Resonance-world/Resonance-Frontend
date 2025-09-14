import Image from 'next/image';

interface ResonanceLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const ResonanceLogo = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}: ResonanceLogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <Image
          src="/logo2x.png"
          alt="RESONANCE Logo"
          width={80}
          height={80}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {showText && (
        <span className={`text-white font-medium ${textSizeClasses[size]}`}>
          RESONANCE
        </span>
      )}
    </div>
  );
};

