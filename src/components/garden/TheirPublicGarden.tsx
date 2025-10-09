'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { GardenProfile } from '@/types/garden';
import { fetchUserProfile } from '@/services/circlesService';
import { relationshipsService } from '@/services/relationshipsService';
import { matchService, UserMatch } from '@/services/matchService';

/**
 * TheirPublicGarden - Another user's public profile view
 * Based on the Tessa public profile design
 */
export const TheirPublicGarden = () => {
  const [profile, setProfile] = useState<GardenProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMutualFriend, setIsMutualFriend] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingToPrivate, setAddingToPrivate] = useState(false);
  const [matchData, setMatchData] = useState<UserMatch | null>(null);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const userId = params?.userId as string;

  // Fetch user data based on userId
  useEffect(() => {
    console.log('🔍 TheirPublicGarden: userId from params:', userId);
    if (!userId) {
      console.log('❌ No userId provided');
      setLoading(false);
      return;
    }

    const loadUserProfile = async () => {
      try {
        setLoading(true);
        
        // Handle Tessa mockup separately
        if (userId === 'tessa') {
          const tessaProfile: GardenProfile = {
            id: 'profile-tessa',
            name: 'Tessa',
            profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
            nftImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
            essence: ['Curiosity', 'Grounded'],
            bio: "I'm always exploring new ideas and places, and I try to stay connected to what matters — my practice, nature, and people I care about.",
            isPublic: true,
            worldId: '@tessachup',
            socialLinks: {
              telegram: 'tessla',
              instagram: 'tessaractt_',
              baseFarcaster: 'tessla.farcaster.eth',
              zora: 'tessaract',
              linkedin: 'tessla',
              x: 'tesslaoxo',
              website: 'www.tessla.me'
            }
          };
          setProfile(tessaProfile);
          setIsMutualFriend(true);
          setLoading(false);
          return;
        }

        // Fetch real user from backend
        console.log('🔄 Fetching user profile from backend:', userId);
        const userData = await fetchUserProfile(userId);
        console.log('✅ Fetched user data:', userData);

        // Convert backend user data to GardenProfile
        const userProfile: GardenProfile = {
          id: userData.id,
          name: userData.name || userData.username,
          profileImage: userData.profilePictureUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
          nftImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
          essence: userData.essenceKeywords ? userData.essenceKeywords.split(',').map(s => s.trim()) : ['Creative', 'Thoughtful'],
          bio: userData.personalitySummary || "Building meaningful connections and exploring new possibilities.",
          isPublic: true,
          worldId: `@${userData.username}`,
          socialLinks: {
            telegram: userData.telegramHandle,
            instagram: userData.instagramHandle,
            baseFarcaster: userData.baseFarcasterHandle,
            zora: userData.zoraHandle,
            linkedin: userData.linkedinHandle,
            x: userData.xHandle,
            website: userData.websiteUrl
          }
        };

        setProfile(userProfile);
        
        // Fetch match data if we have a current user session
        if (session?.user?.id) {
          await fetchMatchData(session.user.id, userData.id);
        }
        
        // Check if user is mutual friend (mock logic for now)
        // In real app, this would check the circles/relationships
        setIsMutualFriend(true);
        
      } catch (error) {
        console.error('❌ Error loading user profile:', error);
        // Fallback to Tessa profile on error
        const fallbackProfile: GardenProfile = {
          id: 'profile-tessa',
          name: 'Tessa',
          profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
          nftImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
          essence: ['Curiosity', 'Grounded'],
          bio: "I'm always exploring new ideas and places, and I try to stay connected to what matters — my practice, nature, and people I care about.",
          isPublic: true,
          worldId: '@tessachup',
          socialLinks: {
            telegram: 'tessla',
            instagram: 'tessaractt_',
            baseFarcaster: 'tessla.farcaster.eth',
            zora: 'tessaract',
            linkedin: 'tessla',
            x: 'tesslaoxo',
            website: 'www.tessla.me'
          }
        };
        setProfile(fallbackProfile);
        setIsMutualFriend(true);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  const handleAddToCircle = () => {
    console.log('➕ Adding to private circle');
    setShowAddModal(true);
  };

  const confirmAddToPrivate = async () => {
    if (!session?.user?.id || !profile) return;
    
    try {
      setAddingToPrivate(true);
      await relationshipsService.addToPrivateCircle(profile.id, session.user.id);
      console.log('✅ User added to private circle successfully');
      setShowAddModal(false);
      // You could add a success toast here
    } catch (error) {
      console.error('❌ Error adding to private circle:', error);
      // You could add an error toast here
    } finally {
      setAddingToPrivate(false);
    }
  };

  // Fetch match data between current user and the profile user
  const fetchMatchData = async (currentUserId: string, profileUserId: string) => {
    try {
      console.log('🔍 Fetching match data between users:', currentUserId, profileUserId);
      const matches = await matchService.getUserMatches(currentUserId);
      
      // Find match between current user and profile user
      const match = matches.find(m => 
        m.userProfile.id === profileUserId && m.status === 'CONFIRMED'
      );
      
      if (match) {
        console.log('✅ Found match data:', match);
        console.log('🔍 Match category:', match.category);
        console.log('🔍 Match question:', match.question);
        setMatchData(match);
      } else {
        console.log('ℹ️ No confirmed match found between users');
      }
    } catch (error) {
      console.error('❌ Error fetching match data:', error);
    }
  };

  const handleViewReflection = () => {
    console.log('👁️ Viewing reflection');
    setShowReflectionModal(true);
  };

  const handleViewPrivateGarden = () => {
    console.log('🔒 Viewing private garden');
    router.push(`/garden/their-private/${userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/circles_background.png)',
            filter: 'brightness(0.3) contrast(1.2)'
          }}
        />
        
        {/* Dark Overlay */}
        <div className="fixed inset-0 bg-black/40" />
        
        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white text-lg">Loading public garden...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Profile not found</div>
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
        <h1 className="text-white text-lg font-medium">{profile.name}</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Profile Name */}
        <div className="text-center mb-6">
          <h1 className="text-white text-3xl font-light italic mb-4">{profile.name}</h1>
        </div>

        {/* Add to Private Circle Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleAddToCircle}
            className="bg-[#4a342a]/80 hover:bg-[#553c30]/90 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 mx-auto border border-[#553c30]/50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Add To Private Circle
          </button>
        </div>

        {/* Profile Image */}
        <div className="mb-6">
          <div className="relative">
            <img
              src={profile.nftImage}
              alt={`${profile.name}'s garden`}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
              <div className="w-2 h-1 bg-white rounded-full"></div>
              <div className="w-2 h-1 bg-white/50 rounded-full"></div>
              <div className="w-2 h-1 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Essences Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
          <div className="text-center mb-4">
            <div className="text-gray-400 text-sm mb-2">{profile.name}'s essences are rooted in...</div>
            <div className="flex justify-center gap-2 mb-4">
              {profile.essence.map((essence, index) => (
                <span
                  key={index}
                  className="bg-amber-600/80 text-white px-3 py-1 rounded-full text-sm"
                >
                  {essence}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reflections Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-white font-medium">REFLECTIONS</h3>
            <span className="text-xl">👁️</span>
          </div>
          <div className="text-white text-sm leading-relaxed mb-3">
            <p>Reflect on this encounter to uncover more layers of your connection.</p>
          </div>
          <button
            onClick={handleViewReflection}
            className="bg-[#4a342a]/80 hover:bg-[#553c30]/90 text-white border border-[#553c30]/50 hover:border-[#4a342a]/70 rounded-lg px-4 py-2 w-full flex items-center justify-center gap-2 transition-all duration-300"
          >
            <span>Reflection</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>


        {/* Private Garden Access (if mutual friends)
        {isMutualFriend && (
          <div className="text-center">
            <button
              onClick={handleViewPrivateGarden}
              className="bg-amber-600/80 hover:bg-amber-700/90 text-white border border-amber-500/50 hover:border-amber-400/70 rounded-lg px-4 py-2 transition-all duration-300"
            >
              View Private Garden
            </button>
          </div>
        )} */}
      </div>

      {/* Add to Private Circle Confirmation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 border border-white/20 rounded-lg p-6 max-w-sm mx-4 backdrop-blur-sm">
            <h3 className="text-white text-lg font-medium mb-4">Add to Private Circle</h3>
            <p className="text-white/80 text-sm mb-6">
              People in your private circle can see your Private Garden
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddToPrivate}
                disabled={addingToPrivate}
                className="flex-1 bg-[#4a342a]/80 hover:bg-[#553c30]/90 disabled:opacity-50 rounded-lg px-4 py-2 text-white transition-colors"
              >
                {addingToPrivate ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reflection Modal */}
      {showReflectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 border border-white/20 rounded-lg p-6 max-w-sm mx-4 backdrop-blur-sm">
            <h3 className="text-white text-lg font-medium mb-4">Coming Soon</h3>
            <p className="text-white/80 text-sm mb-6">
              The reflection feature is currently under development. Stay tuned for updates!
            </p>
            <button
              onClick={() => setShowReflectionModal(false)}
              className="w-full bg-[#4a342a]/80 hover:bg-[#553c30]/90 text-white rounded-lg px-4 py-2 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
