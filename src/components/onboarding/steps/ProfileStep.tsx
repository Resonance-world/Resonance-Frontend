import { useState, useEffect } from 'react';

interface StepProps {
  onDataChange: (data: Record<string, unknown>) => void;
  data: Record<string, unknown>;
  isLoading: boolean;
}

/**
 * ProfileStep - Second step of onboarding flow
 * Allows users to set up their profile information
 */
export const ProfileStep = ({ onDataChange, data, isLoading }: StepProps) => {
  const [formData, setFormData] = useState({
    displayName: (data.displayName as string) || '',
    bio: (data.bio as string) || '',
    interests: (data.interests as string[]) || []
  });

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">👤</div>
        <h2 className="text-2xl font-bold mb-2">Set up your profile</h2>
        <p className="text-muted-foreground">
          Tell us a bit about yourself to personalize your experience
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            placeholder="How should we call you?"
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Bio (Optional)
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Interests (Optional)
          </label>
          <div className="text-xs text-muted-foreground mb-2">
            What topics interest you? This helps us personalize your experience.
          </div>
          {/* TODO: Add interest selection based on Figma design */}
          <input
            type="text"
            placeholder="Add interests separated by commas"
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}; 