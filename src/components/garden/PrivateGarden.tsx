'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { GardenProfile, MOCK_USER_PROFILE } from '@/types/garden';
import { ProfilePictureUpload } from './ProfilePictureUpload';
import { useUser } from '@/hooks/useUser';

/**
 * PrivateGarden - User's private profile management
 * Implements the private garden from Figma wireframes
 */
export const PrivateGarden = () => {
  const [profile, setProfile] = useState<GardenProfile>(MOCK_USER_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { user: userData, loading: userLoading, updateUser } = useUser();

  console.log('🌱 Private Garden initialized for:', profile.name);
  console.log('👤 Session data:', session?.user);

  // Update profile with real user data when available
  useEffect(() => {
    if (userData) {
      console.log('🔄 Updating profile with real user data:', userData);
      setProfile(prev => ({
        ...prev,
        name: userData.name || userData.username || prev.name,
        worldId: userData.username ? `@${userData.username}` : prev.worldId,
        profileImage: userData.profilePictureUrl || prev.profileImage,
        bio: userData.personalitySummary || prev.bio,
        essence: userData.essenceKeywords ? [userData.essenceKeywords] : prev.essence,
        socialLinks: {
          telegram: userData.telegramHandle,
          instagram: userData.instagramHandle,
          baseFarcaster: userData.baseFarcasterHandle,
          zora: userData.zoraHandle,
          linkedin: userData.linkedinHandle,
          x: userData.xHandle,
          website: userData.websiteUrl
        }
      }));
    } else if (session?.user) {
      console.log('🔄 Updating profile with World ID data:', session.user);
      setProfile(prev => ({
        ...prev,
        name: session.user.name || session.user.username || prev.name,
        worldId: session.user.username ? `@${session.user.username}` : prev.worldId,
        profileImage: session.user.profilePictureUrl || prev.profileImage
      }));
    }
  }, [userData, session]);

  const handleEditProfile = () => {
    console.log('✏️ Opening profile editor');
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    console.log('💾 Saving profile changes to database');
    setIsEditing(false);
    
    try {
      await updateUser({
        username: profile.name,
        profilePictureUrl: profile.profileImage
      });
      console.log('✅ Profile saved successfully');
    } catch (error) {
      console.error('❌ Error saving profile:', error);
    }
  };

  // Note: handleSocialLinksUpdate removed as it was unused
  // If needed in the future, it can be re-added when SocialLinksEditor is integrated

  const handleProfileImageUpdate = async (newImageUrl: string) => {
    console.log('🖼️ Updating profile image in database');
    
    setProfile(prev => ({
      ...prev,
      profileImage: newImageUrl
    }));

    try {
      await updateUser({
        profilePictureUrl: newImageUrl
      });
      console.log('✅ Profile image updated successfully');
    } catch (error) {
      console.error('❌ Error updating profile image:', error);
    }
  };

  const handleSocialLinkEdit = () => {
    console.log('🔗 Opening social links editor');
    router.push('/garden/social-links');
  };

  const handleProfileImageChange = async (newImageUrl: string) => {
    console.log('🖼️ Profile image changed:', newImageUrl);
    await handleProfileImageUpdate(newImageUrl);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading your garden...</div>
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
        <h1 className="text-white text-lg font-medium">{profile.name}&apos;s Private Garden</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">

        {/* Profile Image */}
        <div className="mb-6">
          <div className="relative">
            <img
              src={profile.nftImage}
              alt={`${profile.name}'s profile`}
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={handleProfileImageUpdate}
              className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors"
            >
              Set new photo
            </button>
          </div>
        </div>

        {/* INFO Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">INFO</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-green-400 text-sm hover:text-green-300"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-gray-400 text-sm">Name:</span>
              <span className="text-white text-sm">{profile.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-gray-400 text-sm">World ID:</span>
              <span className="text-white text-sm">{profile.worldId}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-gray-400 text-sm">Age:</span>
              <span className="text-white text-sm">{userData?.dateOfBirth ? new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear() : 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-gray-400 text-sm">Sex:</span>
              <span className="text-white text-sm">{userData?.sex || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-gray-400 text-sm">Essences:</span>
              <span className="text-white text-sm">{userData?.essenceKeywords || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-gray-400 text-sm">Communication tone:</span>
              <span className="text-white text-sm">{userData?.communicationTone || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Intention:</span>
              <span className="text-white text-sm">{userData?.motivationForConnection || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* MY SOCIALS Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">MY SOCIALS</h3>
            <button
              onClick={handleSocialLinkEdit}
              className="text-green-400 text-sm hover:text-green-300"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2">
            {[
              { key: 'telegram', label: 'Telegram', value: userData?.telegramHandle || profile.socialLinks?.telegram },
              { key: 'instagram', label: 'Instagram', value: userData?.instagramHandle || profile.socialLinks?.instagram },
              { key: 'baseFarcaster', label: 'Base/Farcaster', value: userData?.baseFarcasterHandle || profile.socialLinks?.baseFarcaster },
              { key: 'zora', label: 'Zora', value: userData?.zoraHandle || profile.socialLinks?.zora },
              { key: 'x', label: 'X', value: userData?.xHandle || profile.socialLinks?.x },
              { key: 'website', label: 'Website', value: userData?.websiteUrl || profile.socialLinks?.website }
            ].map(({ key, label, value }) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{label}:</span>
                <span className="text-white text-sm">{value || 'Not set'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}; 

oints are already working for other pages 