'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { FixedHeader } from '../ui/FixedHeader';

interface ChatMessage {
  id: string;
  content: string;
  isFromBot: boolean;
  timestamp: Date;
  showContinueButton?: boolean;
  questionType?: 'text' | 'date' | 'select' | 'chips' | 'completion';
  options?: string[];
  dataKey?: string | null;
  showInteractiveElements?: boolean;
}

interface OnboardingData {
  date_of_birth?: string;
  sex?: string;
  location?: string;
  item_detail?: string;
  essence?: string;
  essence_story?: string;
  communication_tone?: string;
  motivation?: string;
  curiosity?: string;
}

interface ChatbotOnboardingProps {
  session?: Session | null;
}

export function InteractiveOnboarding({ session }: ChatbotOnboardingProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Define the onboarding flow with different question types
  const onboardingQuestions = [
    {
      id: 'welcome',
      content: "This is your first step to show up fully, be reflective, and explore connections that go beyond small talk.\n\nYour identity stays private until you choose to reveal it.",
      questionType: 'text' as const,
      dataKey: null,
      isBotMessage: true
    },
    {
      id: 'date_of_birth',
      content: "When were you born?",
      questionType: 'date' as const,
      dataKey: 'date_of_birth' as keyof OnboardingData,
      isBotMessage: false
    },
    {
      id: 'sex',
      content: "How do you identify?",
      questionType: 'select' as const,
      dataKey: 'sex' as keyof OnboardingData,
      options: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],
      isBotMessage: false
    },
    {
      id: 'location',
      content: "Where are you based?",
      questionType: 'text' as const,
      dataKey: 'location' as keyof OnboardingData,
      isBotMessage: false
    },
    {
      id: 'essence',
      content: "When you feel most yourself—most authentic and alive—what one or two words come to mind?",
      questionType: 'text' as const,
      dataKey: 'essence' as keyof OnboardingData,
      isBotMessage: false
    },
    {
      id: 'essence_story',
      content: "Tell me a story that makes you feel that essence so strongly.",
      questionType: 'text' as const,
      dataKey: 'essence_story' as keyof OnboardingData,
      isBotMessage: false
    },
    {
      id: 'communication_tone',
      content: "When you meet someone new, what makes conversation feel good?",
      questionType: 'chips' as const,
      dataKey: 'communication_tone' as keyof OnboardingData,
      options: ['Thoughtful', 'Playful', 'Direct', 'Poetic', 'Neutral', 'All of the above'],
      isBotMessage: false
    },
    {
      id: 'motivation',
      content: "What's pulling you to connect right now?",
      questionType: 'chips' as const,
      dataKey: 'motivation' as keyof OnboardingData,
      options: ['New connection', 'Deeper intellectual connection', 'Co-creation', 'Romantic spark'],
      isBotMessage: false
    },
    {
      id: 'curiosity',
      content: "What's something you've been genuinely curious about lately?",
      questionType: 'text' as const,
      dataKey: 'curiosity' as keyof OnboardingData,
      isBotMessage: false
    },
    {
      id: 'completion',
      content: "Thanks for sharing—you've just created your resonance card. ✨\n\nReady to mint your welcome token and enter the experience?",
      questionType: 'completion' as const,
      dataKey: null,
      isBotMessage: true
    }
  ];

  // Check if user has already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      console.log('🔍 checkOnboardingStatus called');
      console.log('🔍 Session:', session);
      console.log('🔍 User ID:', session?.user?.id);
      
      if (!session?.user?.id) {
        console.log('🔍 No authenticated user, allowing onboarding');
        return;
      }

      try {
        console.log('🔍 Checking onboarding status for user:', session.user.id);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050';
        console.log('🔍 Using backend URL:', backendUrl);
        
        const response = await fetch(`${backendUrl}/api/onboarding/status/${session.user.id}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Onboarding status response:', data);
          if (data.user?.onboardingCompleted) {
            console.log('✅ User has already completed onboarding, redirecting to home');
            // Keep loading state active during redirect
            router.push('/home');
            return;
          }
        } else {
          console.error('❌ Failed to fetch onboarding status:', response.status, response.statusText);
          // If backend is not working, show error and don't allow onboarding
          alert('Backend service is not available. Please try again later.');
          return;
        }
        console.log('🔍 User has not completed onboarding, allowing flow');
        setIsCheckingStatus(false);
      } catch (error) {
        console.error('❌ Error checking onboarding status:', error);
        // If backend is down, show error and don't allow onboarding
        alert('Unable to connect to backend service. Please check your connection and try again.');
        setIsCheckingStatus(false);
        return;
      }
    };

    // Check immediately when session is available
    if (session?.user?.id && !conversationStarted) {
      checkOnboardingStatus();
    }
  }, [session, router, conversationStarted]);

  // Start conversation when component mounts
  useEffect(() => {
    if (!conversationStarted && session?.user?.id) {
      startConversation();
    }
  }, [conversationStarted, session]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startConversation = () => {
    setConversationStarted(true);
    const welcomeMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: onboardingQuestions[0].content,
      isFromBot: true,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    // Automatically move to date of birth question after welcome message
    setTimeout(() => {
      nextQuestion();
    }, 2000); // Wait 2 seconds before showing the date question
  };

  const handleTextSubmit = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const currentQuestion = onboardingQuestions[currentQuestionIndex];
    if (!currentQuestion || currentQuestion.questionType !== 'text') return;

    setIsLoading(true);
    
    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: userMessage,
      isFromBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Update onboarding data
    if (currentQuestion.dataKey) {
      setOnboardingData(prev => ({
        ...prev,
        [currentQuestion.dataKey!]: userMessage
      }));
    }

    // For text questions, validate response and extract insights
    if (currentQuestion.id === 'essence' || currentQuestion.id === 'essence_story' || currentQuestion.id === 'curiosity') {
      try {
        // Call LLM to validate response and extract insights
        const response = await fetch('/api/gemini-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              { role: 'user', content: userMessage }
            ],
            context: `Question: "${currentQuestion.content}"\nUser answered: "${userMessage}"\n\nValidate if this answer makes sense for the question. If it's too short, vague, or doesn't relate to the question, respond with a gentle nudge to get a better answer. If it's a good answer, just acknowledge briefly and move on.`
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const llmResponse = data.message;
          
          // Check if LLM is asking for clarification (contains question marks or asks for more)
          const isAskingForClarification = llmResponse.includes('?') || 
                                         llmResponse.toLowerCase().includes('tell me more') ||
                                         llmResponse.toLowerCase().includes('can you') ||
                                         llmResponse.toLowerCase().includes('what do you mean');
          
          if (isAskingForClarification) {
            // LLM wants clarification - show the response to user
            const botMsg: ChatMessage = {
              id: `msg-${Date.now()}-bot`,
              content: llmResponse,
              isFromBot: true,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsLoading(false);
            return; // Don't proceed to next question yet
          } else {
            // Good answer - just acknowledge and continue
            console.log('📊 Good answer, extracted insights:', llmResponse);
          }
        }
      } catch (error) {
        console.error('❌ Error validating response:', error);
      }
    }

    // Move to next question
    setTimeout(() => {
      nextQuestion();
      setIsLoading(false);
    }, 1000);
  };

  const handleDateSelect = (date: string) => {
    const currentQuestion = onboardingQuestions[currentQuestionIndex];
    if (!currentQuestion || currentQuestion.questionType !== 'date') return;

    // Add user message showing the selected date in a readable format
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      isFromBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);

    // Update onboarding data
    if (currentQuestion.dataKey) {
      setOnboardingData(prev => ({
        ...prev,
        [currentQuestion.dataKey!]: date
      }));
    }

    // Add a confirmation message from the bot before moving to next question
    const confirmMsg: ChatMessage = {
      id: `msg-${Date.now()}-confirm`,
      content: "Got it! Now, how do you identify?",
      isFromBot: true,
      timestamp: new Date(),
      questionType: 'select',
      options: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],
      dataKey: 'sex',
      showInteractiveElements: true
    };
    
    setMessages(prev => [...prev, confirmMsg]);
    
    // Move to next question index
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handleOptionSelect = (option: string) => {
    const currentQuestion = onboardingQuestions[currentQuestionIndex];
    if (!currentQuestion || (currentQuestion.questionType !== 'select' && currentQuestion.questionType !== 'chips')) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: option,
      isFromBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);

    // Update onboarding data
    if (currentQuestion.dataKey) {
      setOnboardingData(prev => ({
        ...prev,
        [currentQuestion.dataKey!]: option.toLowerCase()
      }));
    }

    // Move to next question
    setTimeout(() => {
      nextQuestion();
    }, 500);
  };

  const nextQuestion = () => {
    let nextIndex = currentQuestionIndex + 1;
    
    // Skip the sex question since it's handled directly in date selection
    if (nextIndex < onboardingQuestions.length && onboardingQuestions[nextIndex].id === 'sex') {
      nextIndex++; // Skip to the question after sex
    }
    
    if (nextIndex < onboardingQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      const nextQuestion = onboardingQuestions[nextIndex];
      
      if (nextQuestion.isBotMessage) {
        const botMsg: ChatMessage = {
          id: `msg-${Date.now()}-bot`,
          content: nextQuestion.content,
          isFromBot: true,
          timestamp: new Date(),
          showContinueButton: nextQuestion.id === 'completion'
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        // Add bot message with interactive elements for user questions
        const botMsg: ChatMessage = {
          id: `msg-${Date.now()}-bot`,
          content: nextQuestion.content,
          isFromBot: true,
          timestamp: new Date(),
          questionType: nextQuestion.questionType,
          options: nextQuestion.options,
          dataKey: nextQuestion.dataKey,
          showInteractiveElements: true
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } else {
      setIsCompleted(true);
    }
  };

  const handleFinalSubmit = async () => {
    console.log('🎯 Continue button clicked! Starting handleFinalSubmit...');
    
    if (!session?.user?.id) {
      console.log('⚠️ No authenticated user, cannot save onboarding data');
      alert('You must be logged in to complete onboarding. Please sign in and try again.');
      return;
    }

    try {
      console.log('💾 Saving onboarding data to database...');
      console.log('📊 Onboarding data:', onboardingData);
      console.log('👤 User ID:', session.user.id);
      
      // Generate personality summary using all collected data
      console.log('🤖 Generating personality summary...');
      const personalitySummary = await generatePersonalitySummary(onboardingData);
      console.log('📝 Generated summary:', personalitySummary);
      
      const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050'}/api/onboarding/save`;
      console.log('🔗 Backend URL:', backendUrl);
      console.log('🌍 Environment variable NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          userId: session.user.id,
          onboardingData: onboardingData,
          personalitySummary: personalitySummary
        }),
      });

      console.log('📡 Backend response status:', response.status);
      console.log('📡 Backend response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Onboarding data saved successfully:', result);
        console.log('🚀 Redirecting to gift page...');
        router.push('/onboarding/gift');
      } else {
        const error = await response.json();
        console.error('❌ Failed to save onboarding data:', error);
        alert(`Failed to save onboarding data: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error saving onboarding data:', error);
      alert(`Error saving onboarding data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const generatePersonalitySummary = async (data: OnboardingData): Promise<string> => {
    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `Create a personality summary based on this onboarding data: ${JSON.stringify(data)}` }
          ],
          context: `Based on the user's onboarding responses, create a concise "why" summary that captures their essence and core personality. This will be used for matching with other users. Focus on their motivations, communication style, and what drives them. Keep it under 100 words.`
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.message;
      } else {
        console.error('❌ Failed to generate personality summary');
        return 'A thoughtful individual seeking meaningful connections.';
      }
    } catch (error) {
      console.error('❌ Error generating personality summary:', error);
      return 'A thoughtful individual seeking meaningful connections.';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit(inputValue);
    }
  };

  const currentQuestion = onboardingQuestions[currentQuestionIndex];
  const showTextInput = currentQuestion?.questionType === 'text' && currentQuestion.id !== 'completion';
  const showDateInput = currentQuestion?.questionType === 'date';
  const showSelectOptions = currentQuestion?.questionType === 'select';
  const showChipOptions = currentQuestion?.questionType === 'chips';

  // Show loading screen while checking onboarding status
  if (isCheckingStatus) {
    return (
      <div className="h-screen flex flex-col items-center justify-center relative">
        {/* Onboarding Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/onboarding_background.png)',
            filter: 'brightness(0.4) sepia(0.2) saturate(1.2)'
          }}
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Loading content */}
        <div className="relative z-10 text-center">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
          <p className="text-white/70 text-sm">Checking your onboarding status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative">
      {/* Onboarding Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/onboarding_background.png)',
          filter: 'brightness(0.4) sepia(0.2) saturate(1.2)'
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Fixed Header */}
      <div className="relative z-50 flex-shrink-0">
        <FixedHeader />
      </div>

      {/* Chat messages - properly constrained container */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-4" 
           style={{ 
             paddingTop: '1rem', 
             paddingBottom: showTextInput ? '6rem' : '2rem' // Dynamic padding based on whether text input is shown
           }}>
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isFromBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                message.isFromBot
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-amber-600/80 text-white border border-amber-500/30'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>

              {/* Interactive elements inside bot messages */}
              {message.showInteractiveElements && message.questionType === 'date' && (
                <div className="mt-4 space-y-3">
                  <input
                    type="date"
                    onChange={(e) => handleDateSelect(e.target.value)}
                    className="w-full px-4 py-3 rounded-full border border-gray-600 bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 backdrop-blur-sm"
                    max={new Date().toISOString().split('T')[0]}
                    min="1900-01-01"
                  />
                </div>
              )}

              {message.showInteractiveElements && message.questionType === 'select' && message.options && (
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-1 gap-2">
                    {message.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 rounded-lg transition-all duration-300 text-left"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {message.showInteractiveElements && message.questionType === 'chips' && message.options && (
                <div className="mt-4 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {message.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className="px-4 py-2 bg-amber-600/80 hover:bg-amber-700/90 text-white border border-amber-500/50 hover:border-amber-400/70 rounded-full transition-all duration-300 text-sm font-medium"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {message.showContinueButton && (
                <div className="mt-4">
                  <button
                    onClick={handleFinalSubmit}
                    className="w-full py-3 px-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Continue to Gift ✨
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-2xl bg-white/10 text-white border border-white/20 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-white/70">Resonance is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Text Input Area - Only for text questions */}
      {showTextInput && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-4 border-t backdrop-blur-md" 
             style={{
               backgroundColor: 'rgba(45, 31, 23, 0.85)', // Same as header (#2d1f17) but more transparent
               borderColor: 'rgba(255, 255, 255, 0.1)'
             }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-full border border-gray-600 bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 backdrop-blur-sm"
              />
              <button
                onClick={() => handleTextSubmit(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
