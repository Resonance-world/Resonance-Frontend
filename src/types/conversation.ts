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