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
        flex flex-col items-center cursor-pointer transition-all duration-200
        ${isDragging || isSortableDragging ? 'opacity-50 scale-105 z-50' : ''}
      `}
      onClick={handleClick}
    >
      {/* Profile Image Container */}
      <div className="relative mb-2">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed" style={{borderColor: 'var(--resonance-border-card)'}}>
          <img 
            src={profile.profileImage} 
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Green status indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2" style={{borderColor: 'var(--resonance-dark-bg)'}}></div>
      </div>

      {/* Profile Name */}
      <div className="text-center">
        <h3 className="text-white text-sm font-medium">
          {profile.name}
        </h3>
      </div>
    </div>
  );
}; 