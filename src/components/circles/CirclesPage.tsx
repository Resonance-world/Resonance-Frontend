'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { Circle, MOCK_CIRCLES, CircleProfile } from '@/types/circles';
import { ProfileCard } from './ProfileCard';
import { fetchCircleProfiles } from '@/services/circlesService';

/**
 * CirclesPage - Main circles interface with drag-drop
 * Features: Multiple circles, profile management, drag-drop between circles
 */
export const CirclesPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [circles, setCircles] = useState<Circle[]>(MOCK_CIRCLES);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeProfile, setActiveProfile] = useState<CircleProfile | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('🎯 CirclesPage: Component rendered, initial circles:', circles);
  console.log('🎯 CirclesPage: Current user session:', session?.user?.id);

  // Fetch real users from backend and add them to circles
  useEffect(() => {
    console.log('🚀 CirclesPage: useEffect triggered - starting to load users');
    
    const loadUsers = async () => {
      try {
        setLoading(true);
        console.log('🔄 CirclesPage: Fetching real users from backend...');
        
        // Pass current user ID to filter out self from circles
        const currentUserId = session?.user?.id;
        const realUsers = await fetchCircleProfiles(currentUserId);
        console.log('✅ CirclesPage: Fetched real users (excluding self):', realUsers.length, realUsers);
        
        // Update circles with real users (no mockup conversations)
        setCircles(prevCircles => {
          console.log('🔄 CirclesPage: Updating circles, current circles:', prevCircles);
          const updatedCircles = prevCircles.map(circle => {
            if (circle.id === 'all') {
              // Only add real users to "All" circle (no Tessa mockup)
              const newCircle = {
                ...circle,
                profiles: realUsers
              };
              console.log('🔄 CirclesPage: Updated "all" circle:', newCircle);
              return newCircle;
            } else if (circle.id === 'collaborators') {
              // Add real users to "Collaborators" circle
              const newCircle = {
                ...circle,
                profiles: realUsers
              };
              console.log('🔄 CirclesPage: Updated "collaborators" circle:', newCircle);
              return newCircle;
            } else if (circle.id === 'friendship') {
              // Keep friendship circle empty for now (no mockup conversations)
              const newCircle = {
                ...circle,
                profiles: []
              };
              console.log('🔄 CirclesPage: Updated "friendship" circle (empty):', newCircle);
              return newCircle;
            }
            return circle;
          });
          
          console.log('🎯 CirclesPage: Final updated circles:', updatedCircles);
          return updatedCircles;
        });
      } catch (error) {
        console.error('❌ CirclesPage: Error loading users:', error);
        // Keep using mock data if API fails
      } finally {
        setLoading(false);
      }
    };

    // Only load users if we have a session
    if (session?.user?.id) {
      loadUsers();
    } else {
      console.log('⏳ CirclesPage: No session yet, waiting...');
      setLoading(false);
    }
  }, [session?.user?.id]);

  console.log('🎯 CirclesPage initialized with circles:', circles.length);

  const handleProfileClick = (profileId: string) => {
    console.log('🔗 Navigating to conversation:', profileId);
    router.push(`/conversation/${profileId}`);
  };

  const filteredCircles = activeTab === 'all' 
    ? circles 
    : circles.filter(circle => circle.id === activeTab);

  return (
    <div className="resonance-dark min-h-screen flex flex-col" style={{backgroundColor: 'var(--resonance-dark-bg)'}}>

        {/* Page Title */}
        <div className="p-4">
          <h1 className="text-white text-2xl font-bold">MY CIRCLES</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b px-4" style={{borderColor: 'var(--resonance-border-subtle)'}}>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-3 px-1 text-sm font-medium mr-6 ${
              activeTab === 'all'
                ? 'text-white border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            All
          </button>
          {circles.map(circle => (
            <button
              key={circle.id}
              onClick={() => setActiveTab(circle.id)}
              className={`py-3 px-1 text-sm font-medium mr-6 ${
                activeTab === circle.id
                  ? 'text-white border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {circle.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 pb-24">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p>Loading users...</p>
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                {(() => {
                  const profiles = activeTab === 'all' 
                    ? circles.flatMap(circle => circle.profiles)
                    : filteredCircles.flatMap(circle => circle.profiles);
                  
                  // Remove duplicates based on profile ID
                  const uniqueProfiles = profiles.filter((profile, index, self) => 
                    index === self.findIndex(p => p.id === profile.id)
                  );
                  return uniqueProfiles.map((profile, index) => (
                    <ProfileCard
                      key={`${profile.id}-${index}`}
                      profile={profile}
                      onClick={() => handleProfileClick(profile.id)}
                      isDragging={activeProfile?.id === profile.id}
                    />
                  ));
                })()}
          </div>
          )}
        </div>
    </div>
  );
}; 