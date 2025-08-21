interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

/**
 * StepIndicator shows the current progress through the onboarding flow
 * Provides visual feedback to users about their progress
 */
export const StepIndicator = ({ currentStep, totalSteps, className = '' }: StepIndicatorProps) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
              index === currentStep
                ? 'bg-primary text-primary-foreground'
                : index < currentStep
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {index < currentStep ? (
              <span>✓</span>
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          
          {index < totalSteps - 1 && (
            <div
              className={`w-8 h-0.5 mx-2 transition-colors duration-200 ${
                index < currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}; 