'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SocialLinks } from '@/types/garden';
import { useUser } from '@/hooks/useUser';

/**
 * SocialLinksEditor - Edit social media links
 * Allows users to add/edit their social media profiles
 */
export const SocialLinksEditor = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    telegram: '',
    instagram: '', 
    baseFarcaster: '',
    zora: '',
    x: '',
    website: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { user: userData, updateUser } = useUser();

  console.log('🔗 Social Links Editor initialized');

  // Load user's current social links
  useEffect(() => {
    if (userData) {
      setSocialLinks({
        telegram: userData.telegramHandle || '',
        instagram: userData.instagramHandle || '',
        baseFarcaster: userData.baseFarcasterHandle || '',
        zora: userData.zoraHandle || '',
        x: userData.xHandle || '',
        website: userData.websiteUrl || ''
      });
    }
  }, [userData]);

  const handleSave = async () => {
    if (!session?.user?.id) {
      console.error('❌ User not authenticated');
      return;
    }

    setIsLoading(true);
    console.log('💾 Saving social links:', socialLinks);
    
    try {
      await updateUser({
        telegramHandle: socialLinks.telegram || null,
        instagramHandle: socialLinks.instagram || null,
        baseFarcasterHandle: socialLinks.baseFarcaster || null,
        zoraHandle: socialLinks.zora || null,
        xHandle: socialLinks.x || null,
        websiteUrl: socialLinks.website || null
      });
      
      console.log('✅ Social links saved successfully');
      router.back();
    } catch (error) {
      console.error('❌ Failed to save social links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value.trim()
    }));
  };

  const handleBack = () => {
    router.back();
  };

  const socialPlatforms = [
    { key: 'telegram' as keyof SocialLinks, label: 'Telegram', placeholder: 'username' },
    { key: 'instagram' as keyof SocialLinks, label: 'Instagram', placeholder: 'username' },
    { key: 'baseFarcaster' as keyof SocialLinks, label: 'Base/Farcaster', placeholder: 'username.farcaster.eth' },
    { key: 'zora' as keyof SocialLinks, label: 'Zora', placeholder: 'username' },
    { key: 'x' as keyof SocialLinks, label: 'X', placeholder: 'username' },
    { key: 'website' as keyof SocialLinks, label: 'Website', placeholder: 'www.example.com' }
  ];

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
          onClick={handleBack}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <h1 className="text-white text-lg font-medium">MY SOCIALS</h1>
        
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="text-green-400 hover:text-green-300 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="space-y-4">
          {socialPlatforms.map((platform) => (
            <div key={platform.key} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <label className="block text-white text-sm font-medium mb-2">
                {platform.label}
              </label>
              <input
                type="text"
                value={socialLinks[platform.key] || ''}
                onChange={(e) => handleChange(platform.key, e.target.value)}
                placeholder={platform.placeholder}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-green-400 transition-colors"
                disabled={isLoading}
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-white/70 text-sm">
              💡 Your social links help others connect with you outside of Resonance. 
              Only add platforms you&apos;re comfortable sharing publicly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 