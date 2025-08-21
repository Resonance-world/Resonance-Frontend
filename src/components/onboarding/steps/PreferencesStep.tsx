import { useState, useEffect } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';

interface StepProps {
  onDataChange: (data: Record<string, unknown>) => void;
  data: Record<string, unknown>;
  isLoading: boolean;
}

/**
 * PreferencesStep - Third step of onboarding flow
 * Allows users to set their preferences and privacy settings
 */
export const PreferencesStep = ({ onDataChange, data, isLoading }: StepProps) => {
  const [preferences, setPreferences] = useState({
    notifications: (data.notifications as boolean) ?? true,
    dataCollection: (data.dataCollection as boolean) ?? false,
    publicProfile: (data.publicProfile as boolean) ?? false
  });

  useEffect(() => {
    onDataChange(preferences);
  }, [preferences, onDataChange]);

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">⚙️</div>
        <h2 className="text-2xl font-bold mb-2">Your Preferences</h2>
        <p className="text-muted-foreground">
          Customize your experience and privacy settings
        </p>
      </div>

      <div className="space-y-4">
        {/* Notifications */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium">📱 Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Receive updates about messages and important events
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                onClick={() => handlePreferenceChange('notifications', true)}
                variant={preferences.notifications ? "primary" : "secondary"}
                size="sm"
                disabled={isLoading}
              >
                Enable
              </Button>
              <Button
                onClick={() => handlePreferenceChange('notifications', false)}
                variant={!preferences.notifications ? "primary" : "secondary"}
                size="sm"
                disabled={isLoading}
              >
                Disable
              </Button>
            </div>
          </div>
        </div>

        {/* Data Collection */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium">📊 Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Help us improve by sharing anonymous usage data
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                onClick={() => handlePreferenceChange('dataCollection', true)}
                variant={preferences.dataCollection ? "primary" : "secondary"}
                size="sm"
                disabled={isLoading}
              >
                Allow
              </Button>
              <Button
                onClick={() => handlePreferenceChange('dataCollection', false)}
                variant={!preferences.dataCollection ? "primary" : "secondary"}
                size="sm"
                disabled={isLoading}
              >
                Decline
              </Button>
            </div>
          </div>
        </div>

        {/* Public Profile */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium">🌐 Public Profile</h3>
              <p className="text-sm text-muted-foreground">
                Make your profile visible to other users
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                onClick={() => handlePreferenceChange('publicProfile', true)}
                variant={preferences.publicProfile ? "primary" : "secondary"}
                size="sm"
                disabled={isLoading}
              >
                Public
              </Button>
              <Button
                onClick={() => handlePreferenceChange('publicProfile', false)}
                variant={!preferences.publicProfile ? "primary" : "secondary"}
                size="sm"
                disabled={isLoading}
              >
                Private
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 