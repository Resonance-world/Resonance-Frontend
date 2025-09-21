export interface GardenProfile {
  id: string;
  name: string;
  profileImage: string;
  nftImage: string;
  essence: string[];
  bio?: string;
  isPublic: boolean;
  worldId?: string;
  socialLinks?: SocialLinks;
}

export interface SocialLinks {
  telegram?: string;
  instagram?: string;
  baseFarcaster?: string;
  zora?: string;
  linkedin?: string;
  x?: string;
  website?: string;
}

// Mock data for development
export const MOCK_USER_PROFILE: GardenProfile = {
  id: 'user-amara',
  name: 'Amara',
  profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  nftImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
  essence: ['Curiosity', 'Grounded'],
  bio: "I'm always exploring new ideas and places, and I try to stay connected to what matters — my practice, nature, and people I care about.",
  isPublic: true,
  worldId: '@amarakhan',
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

export const MOCK_PUBLIC_PROFILES: GardenProfile[] = [
  {
    id: 'profile-tessa',
    name: 'Tessa',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    nftImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
    essence: ['Creative', 'Intuitive'],
    isPublic: true,
    worldId: '@tessa'
  },
  {
    id: 'profile-markus',
    name: 'Markus',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    nftImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
    essence: ['Analytical', 'Builder'],
    isPublic: true,
    worldId: '@markus'
  }
]; 