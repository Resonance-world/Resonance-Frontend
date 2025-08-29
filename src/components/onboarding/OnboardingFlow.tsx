'use client';

import { useState } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { StepIndicator } from './StepIndicator';
import { WelcomeStep } from './steps/WelcomeStep';
import { ProfileStep } from './steps/ProfileStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { CompletionStep } from './steps/CompletionStep';

// Define the onboarding steps
export enum OnboardingStep {
  WELCOME = 'welcome',
  PROFILE = 'profile', 
  PREFERENCES = 'preferences',
  COMPLETION = 'completion'
}

const STEPS = [
  OnboardingStep.WELCOME,
  OnboardingStep.PROFILE,
  OnboardingStep.PREFERENCES,
  OnboardingStep.COMPLETION
];

/**
 * OnboardingFlow manages the multi-step onboarding process
 * This component provides a scalable architecture for adding/removing steps
 * and maintains state across the entire flow
 */
export const OnboardingFlow = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<Record<OnboardingStep, unknown>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const currentStep = STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  console.log('📱 Onboarding Flow - Current step:', currentStep, 'Index:', currentStepIndex);

  const handleNext = async () => {
    if (isLastStep) {
      // Complete onboarding
      await completeOnboarding();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleStepData = (stepData: Record<string, unknown>) => {
    setOnboardingData(prev => ({
      ...prev,
      [currentStep]: stepData
    }));
    console.log('📊 Onboarding data updated:', { [currentStep]: stepData });
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    
    try {
      console.log('🎉 Completing onboarding with data:', onboardingData);
      
      // TODO: Send onboarding data to backend
      // await fetch('/api/users/complete-onboarding', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(onboardingData)
      // });
      
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Onboarding completed successfully');
      
      // Redirect to main app
      window.location.href = '/home';
    } catch (error) {
      console.error('❌ Failed to complete onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      onDataChange: handleStepData,
      data: (onboardingData[currentStep] || {}) as Record<string, unknown>,
      isLoading
    };

    switch (currentStep) {
      case OnboardingStep.WELCOME:
        return <WelcomeStep {...stepProps} />;
      case OnboardingStep.PROFILE:
        return <ProfileStep {...stepProps} />;
      case OnboardingStep.PREFERENCES:
        return <PreferencesStep {...stepProps} />;
      case OnboardingStep.COMPLETION:
        return <CompletionStep {...stepProps} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Step Indicator */}
      <StepIndicator 
        currentStep={currentStepIndex} 
        totalSteps={STEPS.length}
        className="mb-8"
      />

      {/* Current Step Content */}
      <div className="mb-8">
        {renderCurrentStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        {!isFirstStep && (
          <Button
            onClick={handlePrevious}
            variant="secondary"
            disabled={isLoading}
            className="flex-1"
          >
            ← Previous
          </Button>
        )}
        
        <Button
          onClick={handleNext}
          variant="primary"
          disabled={isLoading}
          className={isFirstStep ? "w-full" : "flex-1"}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isLastStep ? 'Completing...' : 'Loading...'}
            </div>
          ) : (
            isLastStep ? 'Complete Setup 🎉' : 'Next →'
          )}
        </Button>
      </div>
    </div>
  );
}; 