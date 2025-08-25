'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ConversationReflectionProps {
  conversationId: string;
  participantName: string;
  conversationDate: string;
  conversationPrompt: string;
}

/**
 * ConversationReflection - Post-conversation reflection interface
 * Implements the reflection screen from Figma wireframes
 */
export const ConversationReflection = ({ 
  conversationId, 
  participantName, 
  conversationDate, 
  conversationPrompt 
}: ConversationReflectionProps) => {
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  console.log('💭 Conversation Reflection initialized for:', conversationId);

  const handleSubmitReflection = async () => {
    if (!reflection.trim()) return;
    
    setIsSubmitting(true);
    console.log('📝 Submitting reflection:', reflection);
    
    try {
      // TODO: Submit reflection to backend
      // await submitReflection(conversationId, reflection);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Reflection submitted successfully');
      
      // Navigate back to conversation or home
      router.push('/home');
    } catch (error) {
      console.error('❌ Failed to submit reflection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="innerview-dark min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <button 
          onClick={handleBack}
          className="text-white/60 hover:text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m7-7l-7 7 7 7"/>
          </svg>
        </button>
        
        <h1 className="text-white font-medium">Reflection with {participantName}</h1>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">IV</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 innerview-safe-bottom-large">
        {/* Reflection Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-white text-lg font-medium">YOUR REFLECTION</h2>
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-gray-400 text-sm">
            A space for you to reflect on your conversation with your match.
          </p>
        </div>

        {/* Conversation Details */}
        <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{conversationDate}</div>
          <div className="text-white font-medium">&ldquo;{conversationPrompt}&rdquo;</div>
        </div>

        {/* Reflection Prompt */}
        <div className="mb-4">
          <p className="text-white text-sm leading-relaxed">
            Hey, want a quick reflection on your chat about &ldquo;{conversationPrompt}&rdquo; (theme: Philosophy & Meaning)? I noticed you named creativity as &ldquo;feeling alive&rdquo; they asked whether simulation counts as creativity too, and you both landed on &ldquo;care&rdquo; as the differentiator.
          </p>
        </div>

        <div className="mb-4">
          <p className="text-white text-sm">
            How did it feel overall – more curious or resolved? Pick Quick or Deep and I&apos;ll guide you.
          </p>
        </div>

        {/* Response Input */}
        <div className="mb-6">
          <button className="innerview-button w-full mb-4 text-left">
            user response
          </button>
        </div>

        {/* Reflection Input */}
        <div className="mb-6">
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Share your thoughts about this conversation..."
            className="innerview-textarea"
            rows={6}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitReflection}
          disabled={!reflection.trim() || isSubmitting}
          className="innerview-button-primary w-full py-3"
        >
          {isSubmitting ? 'Saving reflection...' : 'Save reflection'}
        </button>
      </div>
    </div>
  );
}; 