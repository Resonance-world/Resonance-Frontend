'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ConversationMessage, MOCK_MESSAGES } from '@/types/conversation';
import {useUser} from "@/hooks/useUser";
import {useGetMessagesByConversation} from "@/api/messages/getMessagesByUser/useGetMessagesByConversation";
import {useWriteMessage} from "@/api/messages/writeMessage/useWriteMessage";
import { io, Socket } from 'socket.io-client';
import { useGetUserById } from '@/api/user/useGetUserById/useGetUserById';
import { useQueryClient } from '@tanstack/react-query';

interface ConversationChatProps {
  participantId: string;
  conversationPrompt: string;
}

/**
 * ConversationChat - Main chat interface with conversation rating
 * Implements the conversation screen from Figma wireframes
 */
export const ConversationChat = ({
  participantId,
  conversationPrompt,

}: ConversationChatProps) => {
  const { data: chatUser, isFetching, error } = useGetUserById(participantId);

  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user: userData, loading: userLoading, updateUser } = useUser();
  const queryClient = useQueryClient();

  const currentUserId = userData?.id;
  const { data: conversationMessages, isFetching: isFetchingConvMessages, error: convMessagesError, refetch } = useGetMessagesByConversation(participantId, currentUserId);
  const mutation = useWriteMessage(refetch);

  // Function to mark messages as read
  const markMessagesAsRead = async () => {
    if (!currentUserId || !participantId) return;
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      const response = await fetch(`${backendUrl}/api/messages/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          currentUserId,
          senderId: participantId,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Messages marked as read. Updated count:', result.updatedCount);
        // Invalidate unread messages query to trigger refetch
        queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
      } else {
        console.error('❌ Failed to mark messages as read:', response.status);
      }
    } catch (error) {
      console.error('❌ Failed to mark messages as read:', error);
    }
  };

  // Mark messages as read when conversation loads
  useEffect(() => {
    if (currentUserId && participantId) {
      markMessagesAsRead();
    }
  }, [currentUserId, participantId]);

  useEffect(() => {
    if (!currentUserId) {
      console.log('🔌 No currentUserId, skipping WebSocket connection');
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
    const newSocket = io(backendUrl, {
      query: {
        userId: currentUserId
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('🔌 Connected to WebSocket server');
      setIsConnected(true);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔌 WebSocket connection error:', error);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from WebSocket server, reason:', reason);
      setIsConnected(false);
    });

    newSocket.on('reply', (data) => {
      console.log('📨 Received reply:', data);
    });

    // Listen for new messages
    newSocket.on('newMessage', (message: ConversationMessage) => {
      console.log('📨 Received new message:', message);
      // Refetch messages to update the UI
      refetch();
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Cleaning up WebSocket connection');
      newSocket.disconnect();
    };
  }, [currentUserId, refetch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    console.log('📤 Sending message:', newMessage);

    const message: ConversationMessage = {
      id: Date.now().toString(),
      senderId: currentUserId!,
      senderName: 'You',
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    socket?.emit('wsMessage', {
      content: newMessage.trim(),
      receiverId: participantId,
    });

    setNewMessage('');

    try {
      mutation.mutate({
        receiverId: participantId,
        content: newMessage.trim(),
        userId: currentUserId!
      });

      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleBack = () => {
    router.back();
  };

  if (isFetching || isFetchingConvMessages || userLoading || !currentUserId){
    return "Fetching data...";
  }
  console.log(conversationMessages, "messages");
  console.log('chat User data logs:', chatUser);



  return (
    <div className="h-screen w-full relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/center_piece.png)',
          filter: 'brightness(0.3) contrast(1.2)'
        }}
      />
      <div className="fixed inset-0 bg-black/40" />

      {/* Fixed Header - Username and Theme */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        {/* Back Button and Username */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#4a342a]/80 border-b border-[#553c30]/50">
          <button
            onClick={handleBack}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5m7-7l-7 7 7 7"/>
            </svg>
          </button>

          <button
            onClick={() => {
              window.location.href = `/garden/their-public/${participantId}`;
            }}
            className="flex items-center gap-3 hover:bg-white/5 rounded-lg px-3 py-2 transition-colors"
          >
            {chatUser?.user?.profilePictureUrl ? (
              <img
                src={chatUser?.user?.profilePictureUrl}
                alt={chatUser?.user?.name || chatUser?.user?.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <img
                src="/profilePictureDefault-2.png"
                alt={chatUser?.user?.name || chatUser?.user?.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="text-white font-medium">{chatUser?.user?.name || chatUser?.user?.username}</span>
          </button>

          {/* Empty div to balance the layout */}
          <div className="w-6"></div>
        </div>

        {/* Conversation Prompt */}
        <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="text-center">
            <div className="text-gray-300 text-xs mb-1">Philosophy & Meaning</div>
            <div className="text-white text-sm font-medium">&ldquo;{conversationPrompt}&rdquo;</div>
          </div>
        </div>
      </div>

      {/* Fixed Footer - Message Input */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 border-t border-white/20 bg-white/10 backdrop-blur-sm innerview-safe-bottom">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message"
            className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-[#4a342a]/50 focus:bg-white/20 transition-all"
            disabled={isSubmitting}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSubmitting}
            className="px-4 py-3 bg-[#4a342a]/80 hover:bg-[#553c30]/90 text-white rounded-lg border border-[#553c30]/50 hover:border-[#4a342a]/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Messages Area - Independent */}
      <div 
        className="fixed left-0 right-0 overflow-y-auto p-4 space-y-4"
        style={{ 
          top: '140px', // Start below fixed header
          bottom: '100px' // End above fixed footer
        }}
      >
        {conversationMessages?.toReversed().map((message: ConversationMessage) => (
            <div
                key={message.id}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                  className={`max-w-[80%] p-3 rounded-lg backdrop-blur-sm border ${
                      message.senderId === currentUserId
                          ? 'bg-[#4a342a]/80 text-white border-[#553c30]/50'
                          : 'bg-white/10 text-white border-white/20'
                  }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

    </div>
  );
};
