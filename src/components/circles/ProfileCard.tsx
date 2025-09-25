'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CircleProfile } from '@/types/circles';
import Image from 'next/image';

interface ProfileCardProps {
  profile: CircleProfile;
  onClick: () => void;
}

/**
 * ProfileCard - Individual profile card with drag-drop support
 * Features: Visual feedback, notification indicators, drag handle
 */
export const ProfileCard = ({ profile, onClick }: ProfileCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: profile.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  console.log('🃏 ProfileCard :', profile);

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger click if not dragging
      e.preventDefault();
      onClick();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    // Navigate to public garden on double click
      e.preventDefault();
      window.location.href = `/garden/their-public/${profile.name.toLowerCase()}`;
  };
  console.log('🃏 Profile username :', profile.username );
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex flex-col items-center cursor-pointer transition-all duration-200`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Profile Image Container */}
      <div className="relative mb-2">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed" style={{borderColor: 'var(--resonance-border-card)'}}>
          {profile.profilePictureUrl ? (
            <Image
              src={profile.profilePictureUrl}
              alt={profile.name || profile.username}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src="/profilePictureDefault-2.png"
              alt={profile.name || profile.username}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Green status indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2" style={{borderColor: 'var(--resonance-dark-bg)'}}></div>
      </div>

      {/* Profile Name */}
      <div className="text-center">
        <h3 className="text-white text-sm font-medium">
          {profile.name || profile.username}
        </h3>
      </div>
    </div>
  );
}; 