'use client';

interface MatchStatusIndicatorProps {
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'EXPIRED';
  userAccepted: boolean;
  otherUserAccepted: boolean;
}

export const MatchStatusIndicator = ({ status, userAccepted, otherUserAccepted }: MatchStatusIndicatorProps) => {
  if (status === 'CONFIRMED') {
    return (
      <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
        ✓ Match Confirmed!
      </div>
    );
  }
  
  if (status === 'PENDING') {
    if (userAccepted && otherUserAccepted) {
      return (
        <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
          Both accepted! Confirming...
        </div>
      );
    }
    
    if (userAccepted) {
      return (
        <div className="flex items-center gap-2 text-blue-400 text-sm">
          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
          You accepted - waiting for them
        </div>
      );
    }
    
    if (otherUserAccepted) {
      return (
        <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
          They accepted - your turn!
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
        Accept to start chat
      </div>
    );
  }
  
  if (status === 'DECLINED') {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm">
        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
        Match declined
      </div>
    );
  }
  
  if (status === 'EXPIRED') {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
        Match expired
      </div>
    );
  }
  
  return null;
};
