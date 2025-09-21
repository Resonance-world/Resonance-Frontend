'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { GardenProfile } from '@/types/garden';
import { fetchUserProfile } from '@/services/circlesService';

/**
 * TheirPrivateGarden - Another user's private garden (for mutual friends/collaborators)
 * Similar to PrivateGarden but for viewing other users' private data
 */
export const TheirPrivateGarden = () => {
  const [profile, setProfile] = useState<GardenProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;

  // Fetch user data from backend API
  useEffect(() => {
    if (!userId) {
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
            isPublic: false,
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
          isPublic: false,
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
          isPublic: false,
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
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading private garden...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Private garden not accessible</div>
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
        <h1 className="text-white text-lg font-medium">{profile.name}'s Private Garden</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Profile Name with Collaborator Tag */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-white text-3xl font-light italic">{profile.name}</h1>
            <span className="bg-amber-600/80 text-white px-3 py-1 rounded-lg text-sm">
              Collaborator
            </span>
          </div>
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
            <div className="text-gray-400 text-sm mb-2">My essences are rooted in...</div>
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

        {/* INFO Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
          <h3 className="text-white font-medium mb-3">INFO</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="text-white">{profile.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">World ID:</span>
              <span className="text-white">{profile.worldId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Zodiac:</span>
              <span className="text-white">Virgo</span>
            </div>
          </div>
        </div>

        {/* My Why Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-white font-medium">MY WHY</h3>
          </div>
          <div>
            <p className="text-white text-sm leading-relaxed">
              {profile.bio || 'Add your personal mission or what drives you...'}
            </p>
          </div>
        </div>

        {/* Reflections Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-white font-medium">REFLECTIONS</h3>
            <span className="text-xl">👁️</span>
          </div>
          <div className="text-white text-sm leading-relaxed mb-3">
            <p>You and {profile.name} match on August 16th 2025 through prompt 'Computer mind vs Human mind?'</p>
            <p>The conversation went well and you find her intriguing. You discussed about creativity and output.</p>
          </div>
          <button className="bg-amber-600/80 hover:bg-amber-700/90 text-white border border-amber-500/50 hover:border-amber-400/70 rounded-lg px-4 py-2 w-full flex items-center justify-center gap-2 transition-all duration-300">
            <span>Reflection</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Social Links */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">MY SOCIALS</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { key: 'telegram', label: 'Telegram', value: 'tessla' },
              { key: 'instagram', label: 'Instagram', value: 'tessaractt_' },
              { key: 'baseFarcaster', label: 'Base', value: 'tessla.farcaster.eth' },
              { key: 'sora', label: 'Sora', value: 'tessaract' },
              { key: 'x', label: 'X', value: 'tesslaoxo' },
              { key: 'website', label: 'Website', value: 'www.tessla.me' }
            ].map(({ key, label, value }) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{label}</span>
                <span className="text-white text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
