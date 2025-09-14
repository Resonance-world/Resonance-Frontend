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
import { ResonanceLogo } from '../ui/ResonanceLogo';

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
            ? { ...circle, profiles: [...circle.profiles, profileToMove as CircleProfile] }
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
    <div className="resonance-dark min-h-screen flex flex-col" style={{backgroundColor: 'var(--resonance-dark-bg)'}}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{borderColor: 'var(--resonance-border-subtle)'}}>
          <ResonanceLogo size="sm" />
          <button className="text-white/60">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
        
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
          <SortableContext 
            items={activeTab === 'all' 
              ? circles.flatMap(c => c.profiles.map(p => p.id))
              : filteredCircles.flatMap(c => c.profiles.map(p => p.id))
            }
            strategy={verticalListSortingStrategy}
            id={activeTab}
          >
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              {(activeTab === 'all' 
                ? circles.flatMap(circle => circle.profiles)
                : filteredCircles.flatMap(circle => circle.profiles)
              ).map(profile => (
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

      <BottomNavigation currentPage="circles" />
    </div>
  );
}; 