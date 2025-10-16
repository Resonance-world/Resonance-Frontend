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

    const { onboardingData } = await request.json();

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error('❌ GEMINI_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // System prompt specifically for personality summary generation
    const systemPrompt = `You are creating a professional personality summary for a user profile. This summary will be displayed on the user's profile and used for matching with other users.

TASK: Create a concise, professional personality summary based on the user's onboarding responses.

REQUIREMENTS:
- Write in third person (without pronouns like "They are...", "This person...")
- Use professional, descriptive language
- Focus on core personality traits, motivations, and communication style
- Keep it under 50 words
- Make it sound like a profile description, not a conversation
- Avoid conversational words like "noted", "yes", "summary", "I see", "got it"
- Avoid AI-like language or meta-references
- Write as if describing someone to a friend

TONE:
- Professional and warm
- Descriptive and insightful
- Natural and human-like
- Focus on essence and character

EXAMPLE GOOD SUMMARY:
"Driven by curiosity and authentic connections. Communicate with warmth and directness, valuing depth over surface interactions. Essence lies in creative expression and meaningful conversations that challenge perspectives."

EXAMPLE BAD SUMMARY:
"I've noted your responses and here's a summary: You seem like someone who values connections. Yes, you appear to be creative and thoughtful."

Generate a personality summary based on this onboarding data:`;

    // Convert to Gemini format
    const conversationHistory = [
      { role: 'user', content: `${systemPrompt}\n\n${JSON.stringify(onboardingData)}` }
    ];

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: conversationHistory.map(msg => ({ text: msg.content }))
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('❌ Gemini API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate personality summary' },
        { status: 500 }
      );
    }

    const geminiData = await geminiResponse.json();
    
    if (!geminiData.candidates || !geminiData.candidates[0] || !geminiData.candidates[0].content) {
      console.error('❌ Invalid Gemini response structure:', geminiData);
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      );
    }

    const generatedText = geminiData.candidates[0].content.parts[0].text;
    
    return NextResponse.json({
      success: true,
      summary: generatedText.trim()
    });

  } catch (error) {
    console.error('❌ Error generating personality summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
