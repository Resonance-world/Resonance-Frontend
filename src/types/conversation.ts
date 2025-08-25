export interface ConversationMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'reflection_prompt';
}

export interface ConversationReflection {
  id: string;
  conversationId: string;
  userId: string;
  prompt: string;
  response: string;
  date: Date;
  isAwesome?: boolean;
}

export interface ConversationRating {
  conversationId: string;
  rating: 'great' | 'good' | 'okay' | 'poor';
  feedback?: string;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  prompt: string;
  theme: string;
  startedAt: Date;
  lastMessageAt?: Date;
  status: 'active' | 'completed' | 'archived';
  reflections: ConversationReflection[];
  rating?: ConversationRating;
}

export interface ConversationParticipant {
  userId: string;
  name: string;
  profileImage?: string;
  isOnline?: boolean;
}

// Mock data for development
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participants: [
      { userId: 'user-1', name: 'Amara', profileImage: '/api/placeholder/40/40' },
      { userId: 'user-2', name: 'Tessa', profileImage: '/api/placeholder/40/40' }
    ],
    prompt: 'Computer mind vs Human mind?',
    theme: 'Philosophy & Meaning',
    startedAt: new Date('2025-08-13'),
    lastMessageAt: new Date('2025-08-13'),
    status: 'active',
    reflections: []
  }
];

export const MOCK_MESSAGES: ConversationMessage[] = [
  {
    id: 'msg-1',
    senderId: 'user-2',
    senderName: 'Tessa',
    content: 'Interesting prompt... my first instinct is that computer minds are fast and precise, but kind of hollow. Human minds are messy, but full of meaning.',
    timestamp: new Date('2025-08-13T10:00:00'),
    type: 'text'
  },
  {
    id: 'msg-2',
    senderId: 'user-1',
    senderName: 'Amara',
    content: 'Yeah, totally. Computers calculate. We interpret. The same data point can spark nothing to a machine, but to us it can trigger a whole memory or feeling.',
    timestamp: new Date('2025-08-13T10:05:00'),
    type: 'text'
  },
  {
    id: 'msg-3',
    senderId: 'user-2',
    senderName: 'Tessa',
    content: 'Exactly. I think that\'s why creativity is so uniquely human. A machine might remix patterns, but it doesn\'t feel the spark that makes something truly new.',
    timestamp: new Date('2025-08-13T10:10:00'),
    type: 'text'
  },
  {
    id: 'msg-4',
    senderId: 'user-1',
    senderName: 'Amara',
    content: 'Though part of me wonders... if a computer trained on enough human experience could simulate that spark, would it still count as creativity?',
    timestamp: new Date('2025-08-13T10:15:00'),
    type: 'text'
  },
  {
    id: 'msg-5',
    senderId: 'user-2',
    senderName: 'Tessa',
    content: 'Good question. Maybe creativity isn\'t just about the output, but about the intention behind it. We create because we\'re alive, finite, searching.',
    timestamp: new Date('2025-08-13T10:20:00'),
    type: 'text'
  },
  {
    id: 'msg-6',
    senderId: 'user-1',
    senderName: 'Amara',
    content: 'I like that. Maybe what makes the human mind different is that we care. A computer can compute, but it doesn\'t care what happens next.',
    timestamp: new Date('2025-08-13T10:25:00'),
    type: 'text'
  },
  {
    id: 'msg-7',
    senderId: 'user-2',
    senderName: 'Tessa',
    content: 'That\'s beautiful. Care is the thing. Without it, the mind is just circuitry.',
    timestamp: new Date('2025-08-13T10:30:00'),
    type: 'text'
  }
]; 