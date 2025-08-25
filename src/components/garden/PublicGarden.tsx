'use client';

import { useRouter } from 'next/navigation';
import { GardenProfile } from '@/types/garden';

interface PublicGardenProps {
  profile: GardenProfile;
}

/**
 * PublicGarden - View other users' public profiles
 * Accessed from conversation interface
 */
export const PublicGarden = ({ profile }: PublicGardenProps) => {
  const router = useRouter();
  console.log('🌻 Public Garden initialized for:', profile.name);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="innerview-dark min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <button 
          onClick={handleBack}
          className="text-white/60 hover:text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m7-7l-7 7 7 7"/>
          </svg>
        </button>
        
        <h1 className="text-white font-medium">My public garden</h1>
        
        <div className="w-6" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <img 
              src={profile.profileImage} 
              alt={profile.name}
              className="w-full h-full rounded-full object-cover border-2 border-[#2081E2]"
            />
          </div>
          
          <div>
            <h2 className="text-white text-xl font-medium">{profile.name}</h2>
            <p className="text-white/60 text-sm">{profile.worldId}</p>
          </div>
        </div>

        {/* NFT */}
        <div className="space-y-3">
          <h3 className="text-white/80 text-sm font-medium">NFT</h3>
          <div className="aspect-square rounded-lg bg-gray-800 overflow-hidden max-w-sm mx-auto">
            <img 
              src={profile.nftImage} 
              alt={`${profile.name}'s NFT`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Essence Tags */}
        <div className="space-y-3">
          <h3 className="text-white/80 text-sm font-medium">My essence</h3>
          <div className="flex flex-wrap gap-2">
            {profile.essence.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-3">
          <h3 className="text-white/80 text-sm font-medium">Bio</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* Social Links */}
        {profile.socialLinks && (
          <div className="space-y-3">
            <h3 className="text-white/80 text-sm font-medium">My socials</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(profile.socialLinks).map(([platform, username]) => 
                username ? (
                  <div key={platform} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {platform.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm capitalize">{platform}</p>
                      <p className="text-white/60 text-xs">@{username}</p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 