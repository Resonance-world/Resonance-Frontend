'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ProfileCard } from './ProfileCard';
import { useGetAllUsers } from '@/api/users/useGetAllUsers/useGetAllUsers';
/**
 * CirclesPage - Main circles interface with drag-drop
 * Features: Multiple circles, profile management, drag-drop between circles
 */
export const CirclesPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<string>('ALL');
    const {data: circles, isFetching, error} = useGetAllUsers(session?.user?.id);
    const relationCategories: { category: string, name: string }[] = [{
        category: "ALL",
        name: "All"
    }, {category: "COLLAB", name: "Collaborators"}, {
        category: "PRIVATE",
        name: "Friendship"
    }]
  console.log('🎯 CirclesPage: Current user session:', session?.user?.id);

  // Fetch real users from backend and add them to circles

  const handleProfileClick = (profileId: string) => {
    console.log('🔗 Navigating to conversation:', profileId);
    router.push(`/conversation/${profileId}`);
  };
  if (isFetching) {
    return <div>Loading...</div>;
  }
  return (
    <div className="resonance-dark min-h-screen flex flex-col"
            style={{backgroundColor: 'var(--resonance-dark-bg)'}}>
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
                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                    {circles.users.filter(circle => circle.id !== session?.user?.id).map((circle) => (
                        <ProfileCard
                            key={circle.id}
                            profile={circle}
                            onClick={() => handleProfileClick(circle.id)}
                        />
                    ))
                    }
                </div>
            </div>}
        </div>
  );
}; 