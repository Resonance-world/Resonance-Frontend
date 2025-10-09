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
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoData, setInfoData] = useState({
    name: '',
    dateOfBirth: '',
    sex: '',
    essenceKeywords: '',
    communicationTone: '',
    motivationForConnection: ''
  });
  const router = useRouter();
  const { data: session } = useSession();
  const { user: userData, loading: userLoading, updateUser, refreshUser } = useUser();

  console.log('🌱 Private Garden initialized for:', profile.name);
  console.log('👤 Session data:', session?.user);

  // Update profile with real user data when available
  useEffect(() => {
    if (userData) {
      console.log('🔄 Updating profile with real user data:', userData);
      console.log('🖼️ Private profile picture URL:', userData.privateProfilePictureUrl);
      console.log('🖼️ Public profile picture URL:', userData.profilePictureUrl);
      
      const profileImageUrl = userData.privateProfilePictureUrl || userData.profilePictureUrl || '/profilePictureDefault-2.png';
      console.log('🖼️ Final profile image URL:', profileImageUrl);
      
      setProfile(prev => ({
        ...prev,
        name: userData.name || userData.username || prev.name,
        worldId: userData.username ? `@${userData.username}` : prev.worldId,
        profileImage: profileImageUrl,
        bio: userData.personalitySummary || prev.bio,
        essence: userData.essenceKeywords ? [userData.essenceKeywords] : prev.essence,
        socialLinks: {
          telegram: userData.telegramHandle || undefined,
          instagram: userData.instagramHandle || undefined,
          baseFarcaster: userData.baseFarcasterHandle || undefined,
          zora: userData.zoraHandle || undefined,
          linkedin: userData.linkedinHandle || undefined,
          x: userData.xHandle || undefined,
          website: userData.websiteUrl || undefined
        }
      }));
      
      // Update info data
      setInfoData({
        name: userData.name || '',
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
        sex: userData.sex || '',
        essenceKeywords: userData.essenceKeywords || '',
        communicationTone: userData.communicationTone || '',
        motivationForConnection: userData.motivationForConnection || ''
      });
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
    console.log('🖼️ New image URL type:', newImageUrl.startsWith('data:') ? 'base64' : newImageUrl.startsWith('blob:') ? 'blob' : 'url');
    console.log('🖼️ New image URL length:', newImageUrl.length);
    
    setProfile(prev => ({
      ...prev,
      profileImage: newImageUrl
    }));

    try {
      console.log('🖼️ Sending to backend:', { privateProfilePictureUrl: newImageUrl.substring(0, 100) + '...' });
      
      const result = await updateUser({
        privateProfilePictureUrl: newImageUrl
      });
      
      console.log('🖼️ Backend response:', result);
      
      // Refresh user data to ensure consistency
      await refreshUser();
      
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

  const handleEditInfo = () => {
    setIsEditingInfo(true);
  };

  const handleSaveInfo = async () => {
    if (!session?.user?.id) return;
    
    try {
      await updateUser({
        name: infoData.name,
        dateOfBirth: infoData.dateOfBirth,
        sex: infoData.sex,
        essenceKeywords: infoData.essenceKeywords,
        communicationTone: infoData.communicationTone,
        motivationForConnection: infoData.motivationForConnection
      });
      
      // Refresh user data to get the latest information including calculated age
      await refreshUser();
      
      setProfile(prev => ({ ...prev, name: infoData.name }));
      setIsEditingInfo(false);
      console.log('✅ Info section updated successfully');
    } catch (error) {
      console.error('❌ Error updating info section:', error);
    }
  };

  const handleCancelEditInfo = () => {
    setInfoData({
      name: userData?.name || '',
      dateOfBirth: userData?.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
      sex: userData?.sex || '',
      essenceKeywords: userData?.essenceKeywords || '',
      communicationTone: userData?.communicationTone || '',
      motivationForConnection: userData?.motivationForConnection || ''
    });
    setIsEditingInfo(false);
  };

  if (userLoading) {
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
            <div className="text-white text-lg">Loading your private garden...</div>
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
          filter: 'brightness(0.4) contrast(1.1)',
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
        <h1 className="text-white text-lg font-medium">My Private Garden</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">

        {/* Profile Image */}
        <div className="mb-6">
          <ProfilePictureUpload
            currentImage={profile.profileImage || '/profilePictureDefault-2.png'}
            onImageChange={handleProfileImageChange}
          />
        </div>

        {/* INFO Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">INFO</h3>
            {!isEditingInfo && (
              <button
                onClick={handleEditInfo}
                className="text-green-400 text-sm hover:text-green-300"
              >
                Edit
              </button>
            )}
          </div>
          
          {isEditingInfo ? (
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={infoData.name}
                  onChange={(e) => setInfoData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={infoData.dateOfBirth}
                  onChange={(e) => setInfoData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Sex</label>
                <select
                  value={infoData.sex}
                  onChange={(e) => setInfoData(prev => ({ ...prev, sex: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-400 transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Essence Keywords</label>
                <input
                  type="text"
                  value={infoData.essenceKeywords}
                  onChange={(e) => setInfoData(prev => ({ ...prev, essenceKeywords: e.target.value }))}
                  placeholder="e.g., Creative, Intuitive"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Communication Tone</label>
                <select
                  value={infoData.communicationTone}
                  onChange={(e) => setInfoData(prev => ({ ...prev, communicationTone: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-400 transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="thoughtful">Thoughtful</option>
                  <option value="playful">Playful</option>
                  <option value="direct">Direct</option>
                  <option value="poetic">Poetic</option>
                  <option value="neutral">Neutral</option>
                  <option value="all_above">All Above</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Motivation for Connection</label>
                <select
                  value={infoData.motivationForConnection}
                  onChange={(e) => setInfoData(prev => ({ ...prev, motivationForConnection: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-400 transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="new_connection">New Connection</option>
                  <option value="intellectual">Intellectual</option>
                  <option value="co_creation">Co-creation</option>
                  <option value="romantic">Romantic</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleSaveInfo}
                  className="bg-green-400 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-300 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEditInfo}
                  className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
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
                <span className="text-white text-sm">{userData?.age || 'Not set'}</span>
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
          )}
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