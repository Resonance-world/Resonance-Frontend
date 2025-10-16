export interface CircleProfile {
  id: string;
  name: string;
  profileImage: string;
  lastActivity: Date;
  conversationId?: string;
  hasUnreadMessages?: boolean;
  isOnline?: boolean;
  mutualInterests?: string[];
}

export interface Circle {
  id: string;
  name: string;
  type: 'all' | 'friendship' | 'collaborators' | 'custom';
  profiles: CircleProfile[];
  color?: string;
}

export const NOTIFICATION_INDICATOR = '⚠️'; 