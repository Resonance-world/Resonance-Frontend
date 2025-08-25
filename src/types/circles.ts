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

// Mock data for development  
export const MOCK_CIRCLES: Circle[] = [
  {
    id: 'all',
    name: 'All',
    type: 'all',
    profiles: [
      {
        id: 'profile-1',
        name: 'Tessa',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        lastActivity: new Date('2025-01-15T10:30:00'),
        conversationId: 'conv-1',
        hasUnreadMessages: true,
        isOnline: false
      },
      {
        id: 'profile-2', 
        name: 'Markus',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        lastActivity: new Date('2025-01-15T09:15:00'),
        conversationId: 'conv-2',
        hasUnreadMessages: true,
        isOnline: true
      },
      {
        id: 'profile-3',
        name: 'Jenna',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        lastActivity: new Date('2025-01-14T16:45:00'),
        conversationId: 'conv-3',
        hasUnreadMessages: false,
        isOnline: false
      },
      {
        id: 'profile-4',
        name: 'Timber',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        lastActivity: new Date('2025-01-14T14:20:00'),
        hasUnreadMessages: false,
        isOnline: false
      },
      {
        id: 'profile-5',
        name: 'Zach',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        lastActivity: new Date('2025-01-14T12:10:00'),
        hasUnreadMessages: false,
        isOnline: true
      },
      {
        id: 'profile-6',
        name: 'Gem',
        profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face',
        lastActivity: new Date('2025-01-13T18:30:00'),
        hasUnreadMessages: false,
        isOnline: false
      }
    ]
  },
  {
    id: 'friendship',
    name: 'Friendship',
    type: 'friendship',
    profiles: [
      {
        id: 'profile-1',
        name: 'Tessa', 
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        lastActivity: new Date('2025-01-15T10:30:00'),
        conversationId: 'conv-1',
        hasUnreadMessages: true
      }
    ]
  },
  {
    id: 'collaborators',
    name: 'Collaborators',
    type: 'collaborators', 
    profiles: [
      {
        id: 'profile-2',
        name: 'Markus',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        lastActivity: new Date('2025-01-15T09:15:00'),
        conversationId: 'conv-2',
        hasUnreadMessages: true
      }
    ]
  }
];

export const NOTIFICATION_INDICATOR = '⚠️'; 