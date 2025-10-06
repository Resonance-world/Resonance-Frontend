'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ProfileCard } from './ProfileCard';
// import { useGetAllUsers } from '@/api/users/useGetAllUsers/useGetAllUsers';
import { useMatchedUsers } from '@/api/matches/useMatchedUsers';
import { useGetUnreadMessages } from '@/api/messages/useGetUnreadMessages';
import { relationshipsService } from '@/services/relationshipsService';
/**
 * CirclesPage - Main circles interface with drag-drop
 * Features: Multiple circles, profile management, drag-drop between circles
 */
export const CirclesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [privateUsers, setPrivateUsers] = useState<string[]>([]); // Array of user IDs in private circle
  // const {data: circles, isFetching, error} = useGetAllUsers(session?.user?.id);
  const {data: matchedUsersData, isFetching, error} = useMatchedUsers(session?.user?.id);
  
  // Handle relationshipId parameter from confirmed matches
  const relationshipId = searchParams.get('relationshipId');
  
  // Get user IDs from matched users (excluding current user)
  const userIds = matchedUsersData?.users?.filter((user: any) => user.id !== session?.user?.id).map((user: any) => user.id) || [];
  const {data: unreadData} = useGetUnreadMessages(session?.user?.id, userIds);
  
  // Load private relationships on component mount
  useEffect(() => {
    const loadPrivateRelationships = async () => {
      if (session?.user?.id) {
        try {
          const response = await relationshipsService.getPrivateRelationships(session.user.id);
          const privateUserIds = response.relationships.map(rel => rel.relatedUserId);
          setPrivateUsers(privateUserIds);
          console.log('✅ Loaded private relationships:', privateUserIds);
        } catch (error) {
          console.error('❌ Error loading private relationships:', error);
        }
      }
    };

    loadPrivateRelationships();
  }, [session?.user?.id]);

  // Handle relationshipId parameter from confirmed matches
  useEffect(() => {
    if (relationshipId) {
      console.log('🎉 User came from confirmed match with relationship:', relationshipId);
      
      // Show success message (you could integrate with a toast library here)
      console.log('✅ New connection added to your circles!');
      
      // Optionally scroll to or highlight the new connection
      // You could add logic here to highlight the new user in the circles
      
      // Clean up the URL parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('relationshipId');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [relationshipId]);

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

  // Modal state and handlers
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToAdd, setUserToAdd] = useState<any>(null);

  const handleAddToPrivate = (user: any) => {
    setUserToAdd(user);
    setShowAddModal(true);
  };

  const confirmAddToPrivate = async () => {
    if (userToAdd && !privateUsers.includes(userToAdd.id)) {
      try {
        await relationshipsService.addToPrivateCircle(userToAdd.id, session?.user?.id!);
        setPrivateUsers(prev => [...prev, userToAdd.id]);
        console.log('✅ User added to private circle successfully');
      } catch (error) {
        console.error('❌ Error adding to private circle:', error);
        // You could add a toast notification here
      }
    }
    setShowAddModal(false);
    setUserToAdd(null);
  };

  const handleRemoveFromPrivate = async (userId: string) => {
    try {
      await relationshipsService.removeFromPrivateCircle(userId, session?.user?.id!);
      setPrivateUsers(prev => prev.filter(id => id !== userId));
      console.log('✅ User removed from private circle successfully');
    } catch (error) {
      console.error('❌ Error removing from private circle:', error);
      // You could add a toast notification here
    }
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
          filter: 'brightness(0.3) contrast(1.2)' // Darker filter for better consistency
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
                    {matchedUsersData?.users?.filter((user: any) => user.id !== session?.user?.id).length === 0 ? (
                        <div className="bg-white/10 border border-white/20 rounded-lg p-6 text-center">
                            <p className="text-white text-lg font-medium mb-2">
                                Add more people to your private circle
                            </p>
                        </div>
                    ) : (
                        // Show private users in grid
                        <div className="grid grid-cols-3 gap-4">
                            {matchedUsersData?.users
                                ?.filter(user => user.id !== session?.user?.id && privateUsers.includes(user.id))
                                .map((user) => (
                                    <ProfileCard
                                        key={user.id}
                                        profile={user}
                                        onClick={() => handleProfileClick(user.id)}
                                        hasUnreadMessages={unreadMessagesMap.get(user.id) || false}
                                        showActions={true}
                                        isInPrivate={true}
                                        onAddToPrivate={handleAddToPrivate}
                                        onRemoveFromPrivate={handleRemoveFromPrivate}
                                    />
                                ))}
                        </div>
                    )}
                    
                    {/* Note - always displayed in a box for consistency */}
                    <div className="mt-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                            <p className="text-white/80 text-sm">
                                People in your private circle can see your private garden
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                // All tab - existing grid layout
                <div className="max-w-sm mx-auto">
                    {matchedUsersData?.users?.filter(user => user.id !== session?.user?.id).length === 0 ? (
                        <div className="bg-white/10 border border-white/20 rounded-lg p-6 text-center">
                            <p className="text-white text-lg font-medium mb-2">
                                No matches yet! Stay tuned - Great conversations will show up here soon!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {matchedUsersData?.users?.filter(user => user.id !== session?.user?.id).map((user) => (
                                <ProfileCard
                                    key={user.id}
                                    profile={user}
                                    onClick={() => handleProfileClick(user.id)}
                                    hasUnreadMessages={unreadMessagesMap.get(user.id) || false}
                                    showActions={true}
                                    isInPrivate={privateUsers.includes(user.id)}
                                    onAddToPrivate={handleAddToPrivate}
                                    onRemoveFromPrivate={handleRemoveFromPrivate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>}
      </div>

      {/* Add to Private Confirmation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 border border-white/20 rounded-lg p-6 max-w-sm mx-4 backdrop-blur-sm">
            <h3 className="text-white text-lg font-medium mb-4">Add to Private Circle</h3>
            <p className="text-white/80 text-sm mb-6">
              People in your private circle can see your Private Garden
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddToPrivate}
                className="flex-1 bg-orange-500 hover:bg-orange-600 rounded-lg px-4 py-2 text-white transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 