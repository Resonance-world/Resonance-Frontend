'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { GardenProfile, MOCK_USER_PROFILE } from '@/types/garden';
import { BottomNavigation } from '../home/BottomNavigation';
import { ProfilePictureUpload } from './ProfilePictureUpload';

/**
 * PrivateGarden - User's private profile management
 * Implements the private garden from Figma wireframes
 */
export const PrivateGarden = () => {
  const [profile, setProfile] = useState<GardenProfile>(MOCK_USER_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  console.log('🌱 Private Garden initialized for:', profile.name);
  console.log('👤 Session data:', session?.user);

  // Update profile with World ID data when session is available
  useEffect(() => {
    if (session?.user) {
      console.log('🔄 Updating profile with World ID data:', session.user);
      setProfile(prev => ({
        ...prev,
        name: session.user.name || session.user.username || prev.name,
        worldId: session.user.username ? `@${session.user.username}` : prev.worldId,
        profileImage: session.user.profilePictureUrl || prev.profileImage
      }));
    }
  }, [session]);

  const handleEditProfile = () => {
    console.log('✏️ Opening profile editor');
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    console.log('💾 Saving profile changes to database');
    setIsEditing(false);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: profile.bio,
          socialLinks: profile.socialLinks,
          profileImage: profile.profileImage,
        }),
      });

      if (response.ok) {
        console.log('✅ Profile saved successfully');
        // Optionally refresh session data
      } else {
        console.error('❌ Failed to save profile:', response.statusText);
      }
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
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileImage: newImageUrl,
        }),
      });

      if (response.ok) {
        console.log('✅ Profile image updated successfully');
      } else {
        console.error('❌ Failed to update profile image:', response.statusText);
      }
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

  return (
    <div className="innerview-dark min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">IV</span>
          </div>
          <span className="text-white font-medium">InnerView</span>
        </div>
        
        <button className="text-white/60 hover:text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 innerview-safe-bottom-large">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <h1 className="text-white text-2xl font-light italic mb-4">{profile.name}&apos;s Private Garden</h1>
        </div>

        {/* NFT Image with Upload */}
        <div className="mb-6">
          <ProfilePictureUpload 
            currentImage={profile.nftImage}
            onImageChange={handleProfileImageChange}
          />
        </div>

        {/* Profile Info */}
        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="text-gray-400 text-sm mb-2">My essences are rooted in...</div>
            <div className="flex justify-center gap-2 mb-4">
              {profile.essence.map((essence, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                >
                  {essence}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* World ID */}
        <div className="mb-6 text-center">
          <div className="text-gray-400 text-sm mb-1">INFO</div>
          <div className="text-white">Name: {profile.name}</div>
          <div className="text-white">World ID: {profile.worldId}</div>
        </div>

        {/* My Why Section */}
        <div className="innerview-card mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-white font-medium">MY WHY</h3>
            <span className="text-xl">👑</span>
          </div>
          {isEditing ? (
            <div>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                className="innerview-textarea"
                rows={4}
                placeholder="Share what drives you..."
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSaveProfile}
                  className="innerview-button-primary flex-1"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="innerview-button flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
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
          )}
        </div>

        {/* Social Links */}
        <div className="innerview-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">MY SOCIALS</h3>
            <button
              onClick={handleSocialLinkEdit}
              className="text-green-400 text-sm hover:text-green-300"
            >
              Edit
            </button>
          </div>
          
          <div className="space-y-3">
            {profile.socialLinks && Object.entries(profile.socialLinks).map(([platform, handle]) => (
              <div key={platform} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm capitalize">{platform}</span>
                <span className="text-white text-sm">{handle}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-3">
          <button className="innerview-prompt-item w-full text-left">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">MY CIRCLES</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </button>
          
          <button className="innerview-prompt-item w-full text-left">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">MY PROFILE</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="garden" />
    </div>
  );
}; 