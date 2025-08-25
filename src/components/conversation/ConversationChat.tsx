'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ConversationMessage, MOCK_MESSAGES } from '@/types/conversation';

interface ConversationChatProps {
  conversationId: string;
  participantName: string;
  conversationPrompt: string;
  currentUserId: string;
}

/**
 * ConversationChat - Main chat interface with conversation rating
 * Implements the conversation screen from Figma wireframes
 */
export const ConversationChat = ({ 
  conversationId, 
  participantName, 
  conversationPrompt,
  currentUserId 
}: ConversationChatProps) => {
  const [messages, setMessages] = useState<ConversationMessage[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  console.log('💬 Conversation Chat initialized for:', conversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    console.log('📤 Sending message:', newMessage);
    
    const message: ConversationMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: 'You',
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    try {
      // TODO: Send message to backend
      // await sendMessage(conversationId, message);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConversationRating = () => {
    console.log('⭐ Opening conversation rating');
    setShowRating(true);
  };

  const handleRating = async (rating: 'awesome' | 'good' | 'okay' | 'meh') => {
    console.log('📊 Rating conversation:', rating);
    
    try {
      // TODO: Submit rating to backend
      // await rateConversation(conversationId, rating);
      
      // Navigate to reflection
      router.push(`/conversation/${conversationId}/reflection`);
    } catch (error) {
      console.error('❌ Failed to submit rating:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (showRating) {
    return (
      <div className="innerview-dark min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <button 
            onClick={() => setShowRating(false)}
            className="text-white/60 hover:text-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5m7-7l-7 7 7 7"/>
            </svg>
          </button>
          
          <h1 className="text-white font-medium">Rate Conversation</h1>
          
          <div className="w-6"></div>
        </div>

        {/* Rating Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💛</span>
              <h2 className="text-white text-lg">How did this conversation go?</h2>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-3">
            <button
              onClick={() => handleRating('awesome')}
              className="innerview-button w-full py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🔥</span>
                <span>Awesome</span>
              </div>
            </button>
            
            <button
              onClick={() => handleRating('good')}
              className="innerview-button w-full py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">😊</span>
                <span>Good</span>
              </div>
            </button>
            
            <button
              onClick={() => handleRating('okay')}
              className="innerview-button w-full py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">😐</span>
                <span>Okay</span>
              </div>
            </button>
            
            <button
              onClick={() => handleRating('meh')}
              className="innerview-button w-full py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">😕</span>
                <span>Meh</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        
        <button 
          onClick={() => window.location.href = `/garden/public/${participantName.toLowerCase()}`}
          className="flex items-center gap-2 hover:bg-white/5 rounded-lg px-2 py-1 transition-colors"
        >
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">{participantName[0]}</span>
          </div>
          <span className="text-white font-medium">{participantName}</span>
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">IV</span>
          </div>
        </div>
      </div>

      {/* Conversation Prompt */}
      <div className="p-4 bg-gray-800/30 border-b border-gray-700">
        <div className="text-center">
          <div className="text-gray-400 text-xs mb-1">Philosophy & Meaning</div>
          <div className="text-white text-sm font-medium">&ldquo;{conversationPrompt}&rdquo;</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.senderId === currentUserId
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Conversation Rating Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleConversationRating}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <span className="text-xl">💛</span>
          <span className="text-white text-sm">How did this conversation go?</span>
        </button>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700 innerview-safe-bottom">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message"
            className="innerview-input flex-1"
            disabled={isSubmitting}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSubmitting}
            className="innerview-button px-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}; 