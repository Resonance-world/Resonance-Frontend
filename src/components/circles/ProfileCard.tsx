'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CircleProfile } from '@/types/circles';

interface ProfileCardProps {
  profile: CircleProfile;
  onClick: () => void;
  isDragging?: boolean;
}

/**
 * ProfileCard - Individual profile card with drag-drop support
 * Features: Visual feedback, notification indicators, drag handle
 */
export const ProfileCard = ({ profile, onClick, isDragging }: ProfileCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: profile.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  console.log('🃏 ProfileCard rendered for:', profile.name);

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger click if not dragging
    if (!isDragging && !isSortableDragging) {
      e.preventDefault();
      console.log('👆 Profile card clicked:', profile.name);
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative bg-white/5 border border-white/10 rounded-lg p-3 cursor-pointer
        transition-all duration-200 hover:bg-white/10 hover:border-white/20
        ${isDragging || isSortableDragging ? 'opacity-50 scale-105 rotate-2 z-50' : ''}
      `}
      onClick={handleClick}
    >
      {/* Profile Image */}
      <div className="relative mb-3">
        <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border border-white/20">
          <img 
            src={profile.profileImage} 
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Notification indicator */}
        {profile.hasUnreadMessages && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#2081E2] rounded-full border border-black/20"></div>
        )}
      </div>

      {/* Profile Info */}
      <div className="text-center">
        <h3 className="text-white text-sm font-medium mb-1">
          {profile.name}
        </h3>
        
        <p className="text-white/60 text-xs leading-relaxed">
          Last active: {profile.lastActivity.toLocaleDateString()}
        </p>
        
        {profile.lastActivity && (
          <p className="text-white/40 text-xs mt-1">
            {profile.lastActivity.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Drag handle indicator */}
      <div className="absolute top-2 right-2 opacity-30 hover:opacity-60">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
          <circle cx="9" cy="12" r="1"/>
          <circle cx="9" cy="5" r="1"/>
          <circle cx="9" cy="19" r="1"/>
          <circle cx="15" cy="12" r="1"/>
          <circle cx="15" cy="5" r="1"/>
          <circle cx="15" cy="19" r="1"/>
        </svg>
      </div>
    </div>
  );
}; 