'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { GardenProfile } from '@/types/garden';
import { useUser } from '@/hooks/useUser';

/**
 * MyPublicGarden - User's public profile view (how others see your garden)
 * Based on the Amara public profile design
 */
export const MyPublicGarden = () => {
  const [profile, setProfile] = useState<GardenProfile | null>(null);
  const [isEditingWhy, setIsEditingWhy] = useState(false);
  const [whyText, setWhyText] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const { user: userData, loading: userLoading, updateUser, refreshUser } = useUser();

  // Update profile with real user data when available
  useEffect(() => {
    if (userData) {
      console.log('🔄 Updating public profile with real user data:', userData);
      setProfile({
        id: userData.id,
        name: userData.name || userData.username || 'User',
        worldId: userData.username ? `@${userData.username}` : '',
        profileImage: userData.profilePictureUrl || '',
        nftImage: '',
        bio: userData.userWhy || userData.personalitySummary || '',
        essence: userData.essenceKeywords ? [userData.essenceKeywords] : [],
        isPublic: true,
        socialLinks: {}
      });
      setWhyText(userData.userWhy || userData.personalitySummary || '');
    } else if (session?.user) {
      console.log('🔄 Updating public profile with World ID data:', session.user);
      setProfile({
        id: session.user.id || '',
        name: session.user.name || session.user.username || 'User',
        worldId: session.user.username ? `@${session.user.username}` : '',
        profileImage: session.user.profilePictureUrl || '',
        nftImage: '',
        bio: '',
        essence: [],
        isPublic: true,
        socialLinks: {}
      });
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

  const handleMyWallet = () => {
    console.log('💰 Navigating to my wallet');
    router.push('/garden/wallet');
  };

  const handleEditWhy = () => {
    setIsEditingWhy(true);
  };

  const handleSaveWhy = async () => {
    if (!session?.user?.id || !profile) return;
    
    try {
      await updateUser({ userWhy: whyText });
      
      // Refresh user data to get the latest information
      await refreshUser();
      
      setProfile({ ...profile, bio: whyText });
      setIsEditingWhy(false);
      console.log('✅ Why section updated successfully');
    } catch (error) {
      console.error('❌ Error updating why section:', error);
    }
  };

  const handleCancelEditWhy = () => {
    setWhyText(userData?.userWhy || userData?.personalitySummary || '');
    setIsEditingWhy(false);
  };

  if (userLoading || !profile) {
    return (
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/garden_background.png)',
            filter: 'brightness(0.3) contrast(1.2)'
          }}
        />
        
        {/* Dark Overlay */}
        <div className="fixed inset-0 bg-black/40" />
        
        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white text-lg">Loading your public garden...</div>
          </div>
        </div>
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
              src={userData?.profilePictureUrl || session?.user?.profilePictureUrl || '/profilePictureDefault-2.png'}
              alt={`${profile.name}'s garden`}
              className="w-full h-64 object-cover rounded-lg"
            />
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">MY WHY</h3>
            {!isEditingWhy && (
              <button
                onClick={handleEditWhy}
                className="text-green-400 text-sm hover:text-green-300"
              >
                Edit
              </button>
            )}
          </div>
          <div>
            {isEditingWhy ? (
              <div className="space-y-3">
                <textarea
                  value={whyText}
                  onChange={(e) => setWhyText(e.target.value)}
                  placeholder="Add your personal mission or what drives you..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-green-400 transition-colors resize-none"
                  rows={4}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveWhy}
                    className="bg-green-400 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-300 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEditWhy}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-white text-sm leading-relaxed">
                {profile.bio || 'Add your personal mission or what drives you...'}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-3 mb-6">
          <button 
            onClick={handleEditProfile}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-full text-left border border-white/20 hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">MY PRIVATE GARDEN</span>
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
              <span className="text-white font-medium">MY REFLECTIONS</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </button>

          <button 
            onClick={handleMyWallet}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-full text-left border border-white/20 hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">MY WALLET</span>
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
