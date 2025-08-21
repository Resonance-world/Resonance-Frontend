interface StepProps {
  onDataChange: (data: Record<string, unknown>) => void;
  data: Record<string, unknown>;
  isLoading: boolean;
}

/**
 * CompletionStep - Final step of onboarding flow
 * Shows completion status and summary
 */
export const CompletionStep = ({ onDataChange, data, isLoading }: StepProps) => {
  // Suppress unused parameter warnings
  void onDataChange;
  void data;

  return (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">🎉</div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">All Set!</h2>
        <p className="text-muted-foreground">
          Your profile is ready and your preferences have been saved. 
          Welcome to the InnerView community!
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold">What&apos;s next?</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="text-green-500">💬</span>
            Start conversations with other users
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">🤖</span>
            Try our AI chatbots for assistance
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">🔒</span>
            Enjoy secure, verified interactions
          </li>
        </ul>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Finalizing your setup...
        </p>
      )}
    </div>
  );
}; 