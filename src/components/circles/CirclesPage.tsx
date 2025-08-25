'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Circle, MOCK_CIRCLES, CircleProfile } from '@/types/circles';
import { ProfileCard } from './ProfileCard';
import { BottomNavigation } from '../home/BottomNavigation';

/**
 * CirclesPage - Main circles interface with drag-drop
 * Features: Multiple circles, profile management, drag-drop between circles
 */
export const CirclesPage = () => {
  const router = useRouter();
  const [circles, setCircles] = useState<Circle[]>(MOCK_CIRCLES);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeProfile, setActiveProfile] = useState<CircleProfile | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  console.log('🎯 CirclesPage initialized with circles:', circles.length);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.log('🚀 Drag started for profile:', active.id);
    
    // Find the profile being dragged
    for (const circle of circles) {
      const profile = circle.profiles.find(p => p.id === active.id);
      if (profile) {
        setActiveProfile(profile);
        break;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      console.log('❌ Drop cancelled - no valid drop zone');
      setActiveProfile(null);
      return;
    }

    const profileId = active.id as string;
    const targetCircleId = over.id as string;

    console.log('🎯 Moving profile', profileId, 'to circle', targetCircleId);

    setCircles(prevCircles => {
             let profileToMove: CircleProfile | null = null;
      
      // Remove profile from source circle
      const updatedCircles = prevCircles.map(circle => ({
        ...circle,
        profiles: circle.profiles.filter(profile => {
          if (profile.id === profileId) {
            profileToMove = profile;
            return false;
          }
          return true;
        })
      }));

      // Add profile to target circle
      if (profileToMove) {
        const finalCircles = updatedCircles.map(circle => 
          circle.id === targetCircleId 
            ? { ...circle, profiles: [...circle.profiles, profileToMove] }
            : circle
        );
        
        console.log('✅ Profile moved successfully');
        return finalCircles;
      }

      return updatedCircles;
    });

    setActiveProfile(null);
  };

  const handleProfileClick = (profileId: string) => {
    console.log('🔗 Navigating to conversation:', profileId);
    router.push(`/conversation/${profileId}`);
  };

  const filteredCircles = activeTab === 'all' 
    ? circles 
    : circles.filter(circle => circle.id === activeTab);

  return (
    <div className="innerview-dark min-h-screen flex flex-col">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <h1 className="text-white text-xl font-medium text-center">My circles</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'all'
                ? 'text-white border-b-2 border-[#2081E2]'
                : 'text-white/60'
            }`}
          >
            All circles ({circles.reduce((total, circle) => total + circle.profiles.length, 0)})
          </button>
          {circles.map(circle => (
            <button
              key={circle.id}
              onClick={() => setActiveTab(circle.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === circle.id
                  ? 'text-white border-b-2 border-[#2081E2]'
                  : 'text-white/60'
              }`}
            >
              {circle.name} ({circle.profiles.length})
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 innerview-safe-bottom-large">
          {activeTab === 'all' ? (
            // All circles view
            <div className="space-y-6">
              {circles.map(circle => (
                <div key={circle.id} className="space-y-3">
                  <h2 className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#2081E2] rounded-full"></span>
                    {circle.name} ({circle.profiles.length})
                  </h2>
                  
                  <SortableContext 
                    items={circle.profiles.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                    id={circle.id}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {circle.profiles.map(profile => (
                        <ProfileCard
                          key={profile.id}
                          profile={profile}
                          onClick={() => handleProfileClick(profile.id)}
                          isDragging={activeProfile?.id === profile.id}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              ))}
            </div>
          ) : (
            // Single circle view
            <div className="space-y-4">
              {filteredCircles.map(circle => (
                <div key={circle.id}>
                  <SortableContext 
                    items={circle.profiles.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                    id={circle.id}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {circle.profiles.map(profile => (
                        <ProfileCard
                          key={profile.id}
                          profile={profile}
                          onClick={() => handleProfileClick(profile.id)}
                          isDragging={activeProfile?.id === profile.id}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              ))}
            </div>
          )}
        </div>

        <DragOverlay>
          {activeProfile ? (
            <ProfileCard
              profile={activeProfile}
              onClick={() => {}}
              isDragging={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <BottomNavigation />
    </div>
  );
}; 