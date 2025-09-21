'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { GardenProfile, MOCK_USER_PROFILE } from '@/types/garden';
import { useUser } from '@/hooks/useUser';

/**
 * MyPublicGarden - User's public profile view (how others see your garden)
 * Based on the Amara public profile design
 */
export const MyPublicGarden = () => {
  const [profile, setProfile] = useState<GardenProfile>(MOCK_USER_PROFILE);
  const router = useRouter();
  const { data: session } = useSession();
  const { user: userData, loading: userLoading } = useUser();

  // Update profile with real user data when available
  useEffect(() => {
    if (userData) {
      console.log('🔄 Updating public profile with real user data:', userData);
      setProfile(prev => ({
        ...prev,
        name: userData.name || userData.username || prev.name,
        worldId: userData.username ? `@${userData.username}` : prev.worldId,
        profileImage: userData.profilePictureUrl || prev.profileImage,
        bio: userData.personalitySummary || prev.bio,
        essence: userData.essenceKeywords ? [userData.essenceKeywords] : prev.essence
      }));
    } else if (session?.user) {
      console.log('🔄 Updating public profile with World ID data:', session.user);
      setProfile(prev => ({
        ...prev,
        name: session.user.name || session.user.username || prev.name,
        worldId: session.user.username ? `@${session.user.username}` : prev.worldId,
        profileImage: session.user.profilePictureUrl || prev.profileImage
      }));
    }
  }, [userData, session]);

  const handleEditProfile = () => {
    console.log('✏️ Navigating to private garden');
    router.push('/garden/private');
  };

  const handleMyReflection = () => {
    console.log('📅 Navigating to my reflections');
    router.push('/garden/reflections');
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading your public garden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/garden_background.png)',
          filter: 'brightness(0.3) contrast(1.2)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/40" />
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/20 backdrop-blur-sm">
        <button
          onClick={() => router.back()}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-white text-lg font-medium">{profile.name}</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">

        {/* Profile Image */}
        <div className="mb-6">
          <div className="relative">
            <img
              src={profile.nftImage}
              alt={`${profile.name}'s garden`}
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={handleEditProfile}
              className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors"
            >
              Set new photo
            </button>
          </div>
        </div>

        {/* Essences Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
          <div className="text-center mb-4">
            <div className="text-gray-400 text-sm mb-2">My essences are rooted in...</div>
            <div className="flex justify-center gap-2 mb-4">
              {profile.essence.map((essence, index) => (
                <span
                  key={index}
                  className="bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                >
                  {essence}
                </span>
              ))}
              {userData?.zodiacSign && (
                <span className="bg-amber-600/80 text-white px-3 py-1 rounded-full text-sm">
                  {userData.zodiacSign}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* My Why Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-white font-medium">MY WHY</h3>
          </div>
          <div>
            <p className="text-white text-sm leading-relaxed mb-3">
              {profile.bio || 'Add your personal mission or what drives you...'}
            </p>
            <button
              onClick={handleEditProfile}
              className="text-green-400 text-sm hover:text-green-300"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-3 mb-6">
          <button 
            onClick={handleEditProfile}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-full text-left border border-white/20 hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">MY PROFILE</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </button>
          
          <button 
            onClick={handleMyReflection}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-full text-left border border-white/20 hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">MY REFLECTION</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
