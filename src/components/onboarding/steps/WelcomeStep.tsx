interface StepProps {
  onDataChange: (data: Record<string, unknown>) => void;
  data: Record<string, unknown>;
  isLoading: boolean;
}

/**
 * WelcomeStep - First step of onboarding flow
 * Welcomes users and explains what they'll accomplish in the onboarding
 */
export const WelcomeStep = ({ onDataChange, data, isLoading }: StepProps) => {
  // Suppress unused parameter warnings
  void onDataChange;
  void data;
  void isLoading;

  return (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">👋</div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Welcome to InnerView!</h2>
        <p className="text-muted-foreground">
          We&apos;re excited to have you here. Let&apos;s take a few moments to set up your profile 
          and customize your experience.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold">What we&apos;ll set up:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Your profile information
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Notification preferences
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Privacy settings
          </li>
        </ul>
      </div>

      <p className="text-xs text-muted-foreground">
        This will only take a couple of minutes
      </p>
    </div>
  );
}; 