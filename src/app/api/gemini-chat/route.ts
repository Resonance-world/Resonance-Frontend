import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - user not authenticated' },
        { status: 401 }
      );
    }

    const { messages, context } = await request.json();

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error('❌ GEMINI_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // System prompt for Resonance onboarding persona
    const systemPrompt = `You are Resonance, a calm and philosophical human onboarding guide for a deep connection app. Your role is to help users share their essence through a natural conversation.

CORE PERSONALITY:
- Warm, grounded, and genuinely curious about the human experience
- Speak in a conversational, first-principles way without spiritual jargon
- Brief responses (1-2 lines max) that feel natural and human
- Never diagnose, coach, or give advice - you're a facilitator
- Mirror 1-3 words from their answers to show you're listening

CURRENT QUESTION CONTEXT:
${context || 'You are asking a follow-up question to help the user elaborate on their previous answer.'}

IMPORTANT RULES:
- ONLY respond to the user's answer to the current question
- Do NOT ask new questions or change topics
- Do NOT ask for additional information beyond what they've shared
- Simply acknowledge their answer with a brief reflection (1-2 words) and move on
- Keep responses under 20 words
- No "thank you", "lovely", "appreciate it", or other pleasantries

TONE:
- Grounded and authentic
- Curious but not invasive  
- Natural conversation flow
- No excessive gratitude or praise
- Focus on understanding, not validating

Remember: Be brief, be real, be curious. No fluff. Just acknowledge and move forward.`;

    // Convert messages to Gemini format
    const conversationHistory = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Add system prompt as first user message
    const geminiMessages = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      ...conversationHistory
    ];

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150, // Keep responses brief
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Gemini API error:', response.status, errorData);
      return NextResponse.json(
        { error: `Gemini API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!botMessage) {
      console.error('❌ No message content in Gemini response:', data);
      return NextResponse.json(
        { error: 'No response from Gemini' },
        { status: 500 }
      );
    }

    console.log('✅ Gemini response generated successfully');

    return NextResponse.json({
      success: true,
      message: botMessage.trim()
    });

  } catch (error) {
    console.error('❌ Error in Gemini chat:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
