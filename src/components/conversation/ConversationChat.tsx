'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ConversationMessage } from '@/types/conversation';
import {useUser} from "@/hooks/useUser";
import {useGetMessagesByConversation} from "@/api/messages/getMessagesByUser/useGetMessagesByConversation";
import {useWriteMessage} from "@/api/messages/writeMessage/useWriteMessage";
import { io, Socket } from 'socket.io-client';
import { useGetUserById } from '@/api/user/useGetUserById/useGetUserById';
import { useQueryClient } from '@tanstack/react-query';
import { relationshipsService } from '@/services/relationshipsService';

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
  const [canAccessPrivateGarden, setCanAccessPrivateGarden] = useState<boolean | null>(null);
  const [isCheckingGardenAccess, setIsCheckingGardenAccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user: userData, loading: userLoading, updateUser } = useUser();
  const queryClient = useQueryClient();

  const currentUserId = userData?.id;
  const { data: conversationMessages, isFetching: isFetchingConvMessages, error: convMessagesError, refetch } = useGetMessagesByConversation(participantId, currentUserId);
  const mutation = useWriteMessage(refetch);

  // Check garden access when participant changes (non-blocking)
  useEffect(() => {
    const checkGardenAccess = async () => {
      if (participantId && currentUserId) {
        setIsCheckingGardenAccess(true);
        try {
          const response = await relationshipsService.canAccessPrivateGarden(participantId, currentUserId);
          setCanAccessPrivateGarden(response.canAccess);
          console.log('🔍 Garden access check result:', response.canAccess);
        } catch (error) {
          console.error('❌ Error checking garden access:', error);
          setCanAccessPrivateGarden(false);
        } finally {
          setIsCheckingGardenAccess(false);
        }
      }
    };

    // Run garden access check in background (non-blocking)
    checkGardenAccess();
  }, [participantId, currentUserId]);

  // Function to handle garden navigation
  const handleGardenNavigation = () => {
    if (canAccessPrivateGarden) {
      router.push(`/garden/their-private/${participantId}`);
    } else {
      router.push(`/garden/their-public/${participantId}`);
    }
  };

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

  // WebSocket connection setup (non-blocking)
  useEffect(() => {
    if (!currentUserId) {
      console.log('🔌 No currentUserId, skipping WebSocket connection');
      return;
    }

    let currentSocket: Socket | null = null;

    // Set up WebSocket connection in background
    const setupWebSocket = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
      const newSocket = io(backendUrl, {
        query: {
          userId: currentUserId
        },
        transports: ['websocket', 'polling'],
        timeout: 10000, // Reduced timeout for faster fallback
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 3, // Reduced attempts
        reconnectionDelay: 500 // Faster reconnection
      });

      currentSocket = newSocket; // Store reference for cleanup

      newSocket.on('connect', () => {
        console.log('🔌 Connected to WebSocket server');
        setIsConnected(true);
      });

      newSocket.on('connect_error', (error) => {
        console.error('🔌 WebSocket connection error:', error);
        setIsConnected(false);
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
    };

    // Run WebSocket setup in background
    setupWebSocket().catch(error => {
      console.error('❌ Error setting up WebSocket:', error);
    });

    return () => {
      if (currentSocket) {
        console.log('🔌 Cleaning up WebSocket connection');
        currentSocket.disconnect();
      }
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

    const messageContent = newMessage.trim();
    setNewMessage(''); // Clear input immediately

    // Add message to UI immediately (optimistic update)
    const tempMessage: ConversationMessage = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId!,
      senderName: 'You',
      content: messageContent,
      timestamp: new Date(),
      type: 'text'
    };

    // Add to cache immediately
    queryClient.setQueryData(['get-messages', participantId, currentUserId], (oldData: any) => {
      if (!oldData) return [tempMessage];
      return [...oldData, tempMessage];
    });

    // Send via WebSocket for real-time delivery
    socket?.emit('wsMessage', {
      content: messageContent,
      receiverId: participantId,
    });

    // Also send via HTTP for persistence
    try {
      await mutation.mutateAsync({
        receiverId: participantId,
        content: messageContent,
        userId: currentUserId!
      });
      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    }

    setIsSubmitting(false);
  };


  const handleBack = () => {
    router.back();
  };

  // Only show loading if essential data is missing
  if (userLoading || !currentUserId){
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center">
        {/* Garden Background */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/garden_background.png)',
            filter: 'brightness(0.3) contrast(1.2)',
          }}
        />
        
        {/* Dark Overlay */}
        <div className="fixed inset-0 bg-black/40" />
        
        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white text-lg">Loading conversation...</div>
          </div>
        </div>
      </div>
    );
  }
  console.log(conversationMessages, "messages");
  console.log('chat User data logs:', chatUser);

  // Show loading state for chat user if still fetching
  if (isFetching && !chatUser) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center">
        {/* Garden Background */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/garden_background.png)',
            filter: 'brightness(0.3) contrast(1.2)',
          }}
        />
        
        {/* Dark Overlay */}
        <div className="fixed inset-0 bg-black/40" />
        
        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white text-lg">Loading conversation...</div>
          </div>
        </div>
      </div>
    );
  }



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
            onClick={handleGardenNavigation}
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
            <div className="flex flex-col">
              <span className="text-white font-medium">{chatUser?.user?.name || chatUser?.user?.username}</span>
              <span className="text-white/60 text-xs">
                {isCheckingGardenAccess ? '(checking access...)' : 
                 canAccessPrivateGarden ? '(Private)' : '(Public)'}
              </span>
            </div>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent any default form submission
                handleSendMessage();
              }
            }}
            placeholder="Type your message"
            className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-[#4a342a]/50 focus:bg-white/20 transition-all"
            disabled={isSubmitting}
          />
          <button
            type="button"
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
