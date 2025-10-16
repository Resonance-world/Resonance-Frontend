'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GardenProfile } from '@/types/garden';
import { fetchUserProfile } from '@/services/circlesService';
import Image from 'next/image';

interface PublicGardenProps {
  userId: string;
}

/**
 * PublicGarden - View other users' public profiles
 * Accessed from conversation interface
 */
export const PublicGarden = ({ userId }: PublicGardenProps) => {
  const router = useRouter();
  const [profile, setProfile] = useState<GardenProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  console.log('🌻 Public Garden loading for user:', userId);

  // Fetch user data from backend API
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadUserProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch real user from backend
        console.log('🔄 Fetching user profile from backend:', userId);
        const userData = await fetchUserProfile(userId);
        
        if (userData) {
          console.log('✅ User data fetched successfully:', userData);
          const userProfile: GardenProfile = {
            id: userData.id,
            name: userData.name || userData.username || 'User',
            profileImage: userData.profilePictureUrl || '/profilePictureDefault-2.png',
            nftImage: '', // NFT not implemented yet
            essence: userData.essenceKeywords ? [userData.essenceKeywords] : [],
            bio: userData.personalitySummary || '',
            isPublic: true,
            worldId: userData.username ? `@${userData.username}` : '',
            socialLinks: {
              telegram: userData.telegramHandle ?? undefined,
              instagram: userData.instagramHandle ?? undefined,
              baseFarcaster: userData.baseFarcasterHandle ?? undefined,
              zora: userData.zoraHandle ?? undefined,
              linkedin: userData.linkedinHandle ?? undefined,
              x: userData.xHandle ?? undefined,
              website: userData.websiteUrl ?? undefined
            }
          };
          setProfile(userProfile);
        } else {
          console.error('❌ User not found');
        }
      } catch (error) {
        console.error('❌ Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);
  
  const handleBack = () => {
    router.back();
  };

  if (loading || !profile) {
    return (
      <div className="innerview-dark min-h-screen flex flex-col items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center max-w-md">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading public garden...</div>
        </div>
      </div>
    );
  }

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
        
        <h1 className="text-white font-medium">Public garden</h1>
        
        <div className="w-6" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <Image 
              src={profile.profileImage} 
              alt={profile.name}
              width={96}
              height={96}
              className="w-full h-full rounded-full object-cover border-2 border-[#2081E2]"
            />
          </div>
          
          <div>
            <h2 className="text-white text-xl font-medium">{profile.name}</h2>
            {profile.worldId && (
              <p className="text-white/60 text-sm">{profile.worldId}</p>
            )}
          </div>
        </div>

        {/* NFT - Only show if nftImage exists */}
        {profile.nftImage && (
          <div className="space-y-3">
            <h3 className="text-white/80 text-sm font-medium">NFT</h3>
            <div className="aspect-square rounded-lg bg-gray-800 overflow-hidden max-w-sm mx-auto">
              <Image 
                src={profile.nftImage} 
                alt={`${profile.name}'s NFT`}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Essence Tags - Only show if essence exists */}
        {profile.essence && profile.essence.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-white/80 text-sm font-medium">Essence</h3>
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
        )}

        {/* Bio - Only show if bio exists */}
        {profile.bio && (
          <div className="space-y-3">
            <h3 className="text-white/80 text-sm font-medium">Bio</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Social Links - Only show if socialLinks exist */}
        {profile.socialLinks && Object.values(profile.socialLinks).some(v => v) && (
          <div className="space-y-3">
            <h3 className="text-white/80 text-sm font-medium">Socials</h3>
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
