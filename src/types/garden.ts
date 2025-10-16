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