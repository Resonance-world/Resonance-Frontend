'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SocialLinks } from '@/types/garden';

/**
 * SocialLinksEditor - Edit social media links
 * Allows users to add/edit their social media profiles
 */
export const SocialLinksEditor = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    telegram: 'tessla',
    instagram: 'tessarwett', 
    baseFarcaster: 'tessla.farcaster.eth',
    sora: 'tessract',
    x: 'tesslaax0',
    website: 'www.tessla.me'
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  console.log('🔗 Social Links Editor initialized');

  const handleSave = async () => {
    setIsLoading(true);
    console.log('💾 Saving social links:', socialLinks);
    
    try {
      // TODO: Save to backend
      // await updateSocialLinks(socialLinks);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
    { key: 'sora' as keyof SocialLinks, label: 'Sora', placeholder: 'username' },
    { key: 'x' as keyof SocialLinks, label: 'X', placeholder: 'username' },
    { key: 'website' as keyof SocialLinks, label: 'Website', placeholder: 'www.example.com' }
  ];

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
        
        <h1 className="text-white font-medium">MY SOCIALS</h1>
        
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="text-green-400 hover:text-green-300 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 innerview-safe-bottom-large">
        <div className="space-y-4">
          {socialPlatforms.map((platform) => (
            <div key={platform.key} className="space-y-2">
              <label className="block text-white text-sm font-medium">
                {platform.label}
              </label>
              <input
                type="text"
                value={socialLinks[platform.key] || ''}
                onChange={(e) => handleChange(platform.key, e.target.value)}
                placeholder={platform.placeholder}
                className="innerview-input"
                disabled={isLoading}
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="innerview-card">
            <p className="text-gray-400 text-sm">
              💡 Your social links help others connect with you outside of InnerView. 
              Only add platforms you&apos;re comfortable sharing publicly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 