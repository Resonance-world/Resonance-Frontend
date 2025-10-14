'use client';

interface DeployedPromptSuccessProps {
  themeName: string;
  question: string;
  deployedAt: Date;
  expiresAt: Date;
  deployedPromptId: string;
  onPromptCancelled: () => void;
}

/**
 * DeployedPromptSuccess - Component to display successful prompt deployment
 * Shows between My Prompt and Your Matches containers
 */
export const DeployedPromptSuccess = ({ 
  themeName, 
  question, 
  deployedAt, 
  expiresAt,
  deployedPromptId,
  onPromptCancelled
}: DeployedPromptSuccessProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return 'Expired';
    }
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} remaining`;
    } else {
      return 'Less than 1 hour remaining';
    }
  };

  return (
    <div className="bg-green-400/10 backdrop-blur-sm rounded-lg p-4 border border-green-400/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-green-400 font-medium">Prompt Deployed Successfully!</h3>
            <p className="text-green-300/70 text-xs">{getTimeRemaining()}</p>
          </div>
        </div>
        <button
          onClick={onPromptCancelled}
          className="bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded-md transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="text-gray-400 text-xs mb-1">Theme</p>
          <p className="text-white text-sm font-medium">{themeName}</p>
        </div>
        
        <div>
          <p className="text-gray-400 text-xs mb-1">Your Prompt</p>
          <p className="text-white text-sm leading-relaxed">"{question}"</p>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-white/10">
          <span>Deployed: {formatDate(deployedAt)}</span>
          <span>Expires: {formatDate(expiresAt)}</span>
        </div>
      </div>
{/*       
      <div className="mt-3 p-2 bg-white/5 rounded-lg">
        <p className="text-gray-300 text-xs text-center">
          🔍 We're finding people who resonate with you ...
        </p>
      </div> */}
    </div>
  );
};
