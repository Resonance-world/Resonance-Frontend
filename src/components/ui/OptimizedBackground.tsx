'use client';

import Image from 'next/image';

interface OptimizedBackgroundProps {
  imageSrc: string;
  filter?: string;
  overlay?: string;
  className?: string;
  priority?: boolean;
}

/**
 * OptimizedBackground - Reusable component for background images
 * Uses Next.js Image component with lazy loading and optimization
 */
export const OptimizedBackground = ({ 
  imageSrc, 
  filter = 'brightness(0.4) contrast(1.1)', 
  overlay = 'bg-black/40',
  className = '',
  priority = false
}: OptimizedBackgroundProps) => {
  return (
    <div className={`fixed inset-0 ${className}`}>
      {/* Optimized Background Image */}
      <Image
        src={imageSrc}
        alt="Background"
        fill
        className="object-cover"
        style={{ filter }}
        priority={priority}
        quality={75}
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
      
      {/* Dark overlay for better text readability */}
      <div className={`absolute inset-0 ${overlay}`} />
    </div>
  );
};
