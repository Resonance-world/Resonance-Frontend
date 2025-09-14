'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ResonanceLogo } from '@/components/ui/ResonanceLogo';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  options?: string[];
  isTyping?: boolean;
  isMultiSelect?: boolean;
  showContinueButton?: boolean;
}

interface OnboardingData {
  connection_intentions?: string;
  communication_tone?: string;
  core_values?: string[];
  life_philosophy?: string;
  essence_summary?: string;
  life_season?: string;
}

interface ChatbotOnboardingProps {
  session?: any; // Session from NextAuth or null for guest mode
}

/**
 * ChatbotOnboarding - Human-centered conversational onboarding
 * "Every encounter is an invitation to meet another layer of yourself."
 */
export const ChatbotOnboarding = ({ session }: ChatbotOnboardingProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [, setOnboardingData] = useState<OnboardingData>({});
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  console.log('🤖 Chatbot Onboarding initialized');

  // Check if user has already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = () => {
      let completedOnboarding = false;
      
      if (session?.user?.id) {
        // Authenticated user
        completedOnboarding = localStorage.getItem(`onboarding-completed-${session.user.id}`) === 'true';
      } else {
        // Guest user
        completedOnboarding = localStorage.getItem('onboarding-completed-guest') === 'true';
      }
      
      if (completedOnboarding) {
        console.log('✅ User has already completed onboarding, redirecting to home');
        router.push('/home');
        return;
      }
    };

    checkOnboardingStatus();
  }, [session, router]);

  const questions = useMemo(() => [
    {
      id: 'welcome',
      content: "Hey there. 🌱\n\nBefore we help you find people who truly get you, let&apos;s take a moment to understand who you are when you&apos;re most yourself.\n\nThink of this as a conversation with someone who&apos;s genuinely curious about your inner world. No performance needed—just your truth.",
      question: "When you imagine connecting with someone who truly sees you, what are you hoping to find?",
      options: [
        "Deep friendship that feels like coming home",
        "Romantic love built on genuine understanding",
        "Conversations that light up your mind", 
        "Creative partnership in making something meaningful",
        "Spiritual companionship on life's journey",
        "Wisdom exchange with someone who's walked different paths",
        "A chosen family of people who really get you"
      ],
      dataKey: 'connection_intentions' as keyof OnboardingData,
      inputType: 'select'
    },
    {
      id: 'expression',
      content: "When you&apos;re talking about something that matters to you, how do you naturally express yourself?",
      options: [
        "I think deeply, then choose my words carefully",
        "I&apos;m playful, spontaneous, and think out loud",
        "I say exactly what I mean, no dancing around it",
        "I speak in stories, images, and metaphors",
        "I like to explore ideas logically and systematically",
        "I create warm, safe space for vulnerable sharing"
      ],
      dataKey: 'communication_tone' as keyof OnboardingData,
      inputType: 'select'
    },
    {
      id: 'values',
      content: "What values feel most essential to who you are? Pick the ones that, if you couldn&apos;t honor them, you wouldn&apos;t feel like yourself.\n\nChoose up to 4 that feel most true.",
      options: [
        "Authenticity - being genuinely me",
        "Growth - constantly becoming",
        "Creativity - bringing new things to life",
        "Justice - standing up for what&apos;s right",
        "Adventure - embracing the unknown",
        "Peace - creating harmony and calm",
        "Service - contributing something meaningful",
        "Freedom - living on my own terms",
        "Connection - building real bonds",
        "Beauty - appreciating and creating what moves me"
      ],
      dataKey: 'core_values' as keyof OnboardingData,
      inputType: 'multiselect',
      maxSelections: 4
    },
    {
      id: 'worldview',
      content: "What feels most true about life and people to you?",
      options: [
        "Life is about growing into who we&apos;re meant to be",
        "Everything comes down to love and connection",
        "We&apos;re here to contribute something meaningful",
        "Life is meant to be fully experienced and savored",
        "We&apos;re all creators, here to make something beautiful",
        "Wisdom comes through both struggle and joy",
        "Freedom and choice are what make us human",
        "Balance and harmony are where we thrive"
      ],
      dataKey: 'life_philosophy' as keyof OnboardingData,
      inputType: 'select'
    },
    {
      id: 'essence',
      content: "Here&apos;s the real question: What&apos;s the deeper \"why\" that drives who you are?\n\nThink about what makes you come alive, or what you&apos;d want someone to understand about you if they could see into your heart.\n\nExample: \"I believe everyone has a unique light, and I come alive helping people find theirs. Connection and authenticity can heal so much.\"\n\nYour turn—what&apos;s at the core of who you are? (Keep it to 2-3 sentences)",
      dataKey: 'essence_summary' as keyof OnboardingData,
      inputType: 'text'
    },
    {
      id: 'life_season',
      content: "What season of life are you in?",
      options: [
        "Exploring who I&apos;m becoming",
        "Building something meaningful",
        "In transition and reimagining everything",
        "Deepening what I already know about myself",
        "Healing and growing from past experiences",
        "Focused on contributing and giving back",
        "Appreciating what I have",
        "Asking big questions about everything"
      ],
      dataKey: 'life_season' as keyof OnboardingData,
      inputType: 'select'
    }
  ], []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start the conversation
    if (messages.length === 0) {
      setTimeout(() => {
        addBotMessage(questions[0].content);
        // Add the question after a pause
        setTimeout(() => {
          addBotMessage(questions[0].question!, questions[0].options);
        }, 2000);
      }, 500);
    }
  }, [messages.length, questions]);

  const addBotMessage = (content: string, options?: string[], showContinue?: boolean) => {
    console.log('🤖 Bot message:', content);
    
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: new Date(),
        options,
        showContinueButton: showContinue
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const addUserMessage = (content: string) => {
    console.log('👤 User message:', content);
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setUserInput('');
  };

  const handleUserResponse = (response: string | string[], dataKey?: keyof OnboardingData) => {
    const responseText = Array.isArray(response) ? response.join(', ') : response;
    addUserMessage(responseText);
    
    // Save the response data
    if (dataKey) {
      setOnboardingData(prev => ({
        ...prev,
        [dataKey]: response
      }));
      console.log('📊 Onboarding data updated:', { [dataKey]: response });
    }
    
    // Reset selections for next question
    setSelectedValues([]);
    
    // Move to next question
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      const nextQuestion = questions[nextIndex];
      
      setTimeout(() => {
        addBotMessage(nextQuestion.content, nextQuestion.options);
      }, 2000);
    } else {
      // Onboarding complete
      setTimeout(() => {
        addBotMessage("Beautiful.\n\nBased on what you&apos;ve shared, I can see the depth of who you are. You&apos;ve given us something real to work with—not just preferences, but your actual essence.", undefined, true);
        setShowCompletion(true);
      }, 2000);
    }
  };

  const handleTextSubmit = () => {
    if (userInput.trim()) {
      const currentQuestion = questions[currentQuestionIndex];
      handleUserResponse(userInput.trim(), currentQuestion.dataKey);
    }
  };

  const handleOptionSelect = (option: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (currentQuestion.inputType === 'multiselect') {
      const maxSelections = currentQuestion.maxSelections || 4;
      let newSelected = [...selectedValues];
      
      if (newSelected.includes(option)) {
        newSelected = newSelected.filter(v => v !== option);
      } else if (newSelected.length < maxSelections) {
        newSelected.push(option);
      }
      
      setSelectedValues(newSelected);
    } else {
      handleUserResponse(option, currentQuestion.dataKey);
    }
  };

  const handleMultiSelectConfirm = () => {
    if (selectedValues.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      handleUserResponse(selectedValues, currentQuestion.dataKey);
    }
  };

  const handleContinue = () => {
    console.log('🎉 Onboarding complete, saving completion status...');
    
    // Save onboarding completion status
    if (session?.user?.id) {
      localStorage.setItem(`onboarding-completed-${session.user.id}`, 'true');
    } else {
      // For guest users, use a generic key
      localStorage.setItem('onboarding-completed-guest', 'true');
    }
    
    console.log('✅ Onboarding completion saved, redirecting to gift...');
    router.push('/onboarding/gift');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isMultiSelect = currentQuestion?.inputType === 'multiselect';
  const showInput = currentQuestion?.inputType === 'text';

  return (
    <div className="resonance-dark min-h-screen flex flex-col" style={{backgroundColor: 'var(--resonance-dark-bg)'}}>
      {/* Header with logo */}
      <div className="flex items-center justify-between p-4 border-b" style={{borderColor: 'var(--resonance-border-subtle)'}}>
        <ResonanceLogo size="sm" />
        <span className="text-white/60 text-sm">onboarding</span>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`innerview-chat-bubble ${
                message.type === 'user' 
                  ? 'innerview-chat-bubble-user' 
                  : 'innerview-chat-bubble-bot'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {message.content}
              </p>
              
              {message.options && (
                <div className="mt-3 space-y-2">
                  {message.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      className={`innerview-button block w-full text-left ${
                        isMultiSelect && selectedValues.includes(option) 
                          ? 'bg-blue-600 border-blue-500' 
                          : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                  
                  {isMultiSelect && (
                    <button
                      onClick={handleMultiSelectConfirm}
                      disabled={selectedValues.length === 0}
                      className="innerview-button w-full mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue with {selectedValues.length} selected
                    </button>
                  )}
                </div>
              )}

              {message.showContinueButton && (
                <div className="mt-4">
                  <button
                    onClick={handleContinue}
                    className="innerview-button w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  >
                    Let&apos;s find your people 🌱
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="innerview-chat-bubble innerview-chat-bubble-bot">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - only show for text questions */}
      {showInput && !showCompletion && (
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
              placeholder="Share what&apos;s at the core of who you are..."
              className="innerview-input flex-1"
              disabled={isTyping}
            />
            <button
              onClick={handleTextSubmit}
              disabled={!userInput.trim() || isTyping}
              className="innerview-button px-4"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 