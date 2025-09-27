'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ProfileCard } from './ProfileCard';
import { useGetAllUsers } from '@/api/users/useGetAllUsers/useGetAllUsers';
import { useGetUnreadMessages } from '@/api/messages/useGetUnreadMessages';
/**
 * CirclesPage - Main circles interface with drag-drop
 * Features: Multiple circles, profile management, drag-drop between circles
 */
export const CirclesPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const {data: circles, isFetching, error} = useGetAllUsers(session?.user?.id);
  
  // Get user IDs from circles (excluding current user)
  const userIds = circles?.users?.filter(circle => circle.id !== session?.user?.id).map(circle => circle.id) || [];
  const {data: unreadData} = useGetUnreadMessages(session?.user?.id, userIds);
    const relationCategories: { category: string, name: string }[] = [{
        category: "ALL",
        name: "All"
    }, 
    // {category: "COLLAB", name: "Collaborators"}, // Commented out
    {
        category: "PRIVATE",
        name: "Private"
    }]
  console.log('🎯 CirclesPage: Current user session:', session?.user?.id);

  // Fetch real users from backend and add them to circles

  const handleProfileClick = (profileId: string) => {
    console.log('🔗 Navigating to conversation:', profileId);
    router.push(`/conversation/${profileId}`);
  };

  // Create a map of sender IDs to unread status
  const unreadMessagesMap = new Map<string, boolean>();
  if (unreadData?.unreadMessages) {
    console.log('🔍 Unread messages data:', unreadData.unreadMessages);
    unreadData.unreadMessages.forEach((unread: { senderId: string; hasUnread: boolean }) => {
      unreadMessagesMap.set(unread.senderId, unread.hasUnread);
    });
  }
  console.log('🔍 Unread messages map:', Array.from(unreadMessagesMap.entries()));

  if (isFetching) {
    return <div>Loading...</div>;
  }
  return (
    <div className="resonance-dark min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/circles_background.png)',
          filter: 'brightness(0.4) contrast(1.1)' // Less dark than onboarding (0.4)
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Page Title */}
        <div className="p-4">
            <h1 className="text-white text-2xl font-bold">MY CIRCLES</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b px-4" style={{borderColor: 'var(--resonance-border-subtle)'}}>
            {relationCategories.map(relationType => (
                <button
                    key={relationType.category}
                    onClick={() => setActiveTab(relationType.category)}
                    className={`py-3 px-1 text-sm font-medium mr-6 ${
                        activeTab === relationType.category
                            ? 'text-white border-b-2 border-orange-500'
                            : 'text-gray-400 hover:text-gray-300'
                    }`}
                >
                    {relationType.name}
                </button>
            ))}
        </div>

        {/* Content */}
        {isFetching ? <div className="flex items-center justify-center h-64">
            <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p>Loading users...</p>
            </div>
        </div> : <div className="flex-1 p-4 pb-24">
            {activeTab === 'PRIVATE' ? (
                // Private section with empty state
                <div className="max-w-sm mx-auto">
                    {/* Empty state - only show when private circle is empty */}
                    {circles.users.filter(circle => circle.id !== session?.user?.id).length === 0 ? (
                        <div className="bg-white/10 border border-white/20 rounded-lg p-6 text-center">
                            <p className="text-white text-lg font-medium mb-2">
                                Add more people to your private circle
                            </p>
                        </div>
                    ) : (
                        // Show private users in grid
                        <div className="grid grid-cols-3 gap-4">
                            {circles.users.filter(circle => circle.id !== session?.user?.id).map((circle) => (
                                <ProfileCard
                                    key={circle.id}
                                    profile={circle}
                                    onClick={() => handleProfileClick(circle.id)}
                                    hasUnreadMessages={unreadMessagesMap.get(circle.id) || false}
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* Note - always displayed */}
                    <div className="mt-4 text-center">
                        <p className="text-white/70 text-sm">
                            People in your private circle can see your private garden
                        </p>
                    </div>
                </div>
            ) : (
                // All tab - existing grid layout
                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                    {circles.users.filter(circle => circle.id !== session?.user?.id).map((circle) => (
                        <ProfileCard
                            key={circle.id}
                            profile={circle}
                            onClick={() => handleProfileClick(circle.id)}
                            hasUnreadMessages={unreadMessagesMap.get(circle.id) || false}
                        />
                    ))}
                </div>
            )}
        </div>}
      </div>
    </div>
  );
}; 