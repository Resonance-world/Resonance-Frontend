'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  options?: string[];
  isTyping?: boolean;
}

interface OnboardingData {
  essence?: string;
  connecting?: string;
  connection?: string;
  motivation?: string;
  curiosity?: string;
  technology?: string;
}

/**
 * ChatbotOnboarding - Conversational onboarding based on Figma design
 * Implements the dark theme chat interface with predefined questions
 */
export const ChatbotOnboarding = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  console.log('🤖 Chatbot Onboarding initialized');

  const questions = [
    {
      id: 'welcome',
      content: "Welcome. Before we start, take a breath. This isn't about building a profile — it's about letting yourself be seen in a way that feels true.",
      followUp: "Let's get to know you...\nWe all have an 'essence' — qualities that feel the most you.",
      question: "When you think about your best self, what one or two words come to mind?",
      dataKey: 'essence' as keyof OnboardingData,
      inputType: 'text'
    },
    {
      id: 'connecting',
      content: "Why those? What story or moment in your life makes you feel that essence strongly?",
      dataKey: 'connecting' as keyof OnboardingData,
      inputType: 'text'
    },
    {
      id: 'connection',
      content: "Beautiful. Now let's talk about how you connect.\nWhen you're in conversation with someone new, what helps you feel most alive?",
      options: [
        "Playful back and forth",
        "Space for depth and reflection",
        "Building something new together",
        "Just seeing where it goes"
      ],
      dataKey: 'connection' as keyof OnboardingData,
      inputType: 'select'
    },
    {
      id: 'motivation',
      content: "And what pulls you here?\nWhat's motivating you to connect with others right now?",
      dataKey: 'motivation' as keyof OnboardingData,
      inputType: 'text'
    },
    {
      id: 'curiosity',
      content: "One last question: what's something you've been curious about or exploring lately?",
      dataKey: 'curiosity' as keyof OnboardingData,
      inputType: 'text'
    },
    {
      id: 'technology',
      content: "Last one — what's something you've been curious about or exploring lately?",
      followUp: "How technology can be used for deeper human connection, not just efficiency or profit.",
      dataKey: 'technology' as keyof OnboardingData,
      inputType: 'text'
    }
  ];

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
      }, 500);
    }
  }, []);

  const addBotMessage = (content: string, options?: string[]) => {
    console.log('🤖 Bot message:', content);
    
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: new Date(),
        options
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
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

  const handleUserResponse = (response: string, dataKey?: keyof OnboardingData) => {
    addUserMessage(response);
    
    // Save the response data
    if (dataKey) {
      setOnboardingData(prev => ({
        ...prev,
        [dataKey]: response
      }));
      console.log('📊 Onboarding data updated:', { [dataKey]: response });
    }
    
    // Move to next question
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      const nextQuestion = questions[nextIndex];
      
      setTimeout(() => {
        addBotMessage(nextQuestion.content, nextQuestion.options);
        
        // Add follow-up if exists
        if (nextQuestion.followUp) {
          setTimeout(() => {
            addBotMessage(nextQuestion.followUp!);
          }, 2000);
        }
        
        // Add actual question if it's different from content
        if (nextQuestion.question) {
          setTimeout(() => {
            addBotMessage(nextQuestion.question!);
          }, nextQuestion.followUp ? 4000 : 2000);
        }
      }, 2000);
    } else {
      // Onboarding complete
      setTimeout(() => {
        addBotMessage("Thank you. That's it. You've shared more than just facts — you've shared a piece of yourself.");
        
        setTimeout(() => {
          addBotMessage("Here's your InnerView token 🪙 — a small reminder of the space you just created.");
          
          setTimeout(() => {
            console.log('🎉 Onboarding complete, redirecting to loading...');
            router.push('/onboarding/loading');
          }, 3000);
        }, 2500);
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
    handleUserResponse(option, currentQuestion.dataKey);
  };

  return (
    <div className="innerview-dark min-h-screen flex flex-col">
      {/* Header with logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">IV</span>
          </div>
          <span className="text-white font-medium">InnerView</span>
        </div>
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
                      className="innerview-button block w-full text-left"
                    >
                      {option}
                    </button>
                  ))}
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

      {/* Input area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder="Type your message"
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
    </div>
  );
}; 