export interface PromptTheme {
  id: string;
  name: string;
  description?: string;
}

export interface Prompt {
  id: string;
  theme: string;
  question: string;
  isCustom?: boolean;
  deployedAt?: Date;
}

export interface Match {
  id: string;
  question: string;
  category: string;
  user: string;
  isAccepted?: boolean;
  isDeclined?: boolean;
}

export interface UserPromptState {
  selectedTheme?: PromptTheme;
  selectedPrompt?: Prompt;
  customPrompt?: string;
  isDeployed: boolean;
  deployedAt?: Date;
  nextDeployAt?: Date;
}

export const PROMPT_THEMES: PromptTheme[] = [
  { id: 'personal-growth', name: 'Personal Growth & Transformation' },
  { id: 'philosophy', name: 'Philosophy and Meaning' },
  { id: 'tech', name: 'Frontier Tech and Future' },
  { id: 'creativity', name: 'Creativity and Artistry' },
  { id: 'science', name: 'Science & Experimentation' },
  { id: 'wellness', name: 'Wellness & embodiment' },
  { id: 'relationships', name: 'Relationships & Connection' },
  { id: 'play', name: 'Play & Imagination' },
  { id: 'work', name: 'Work & Purpose' },
  { id: 'society', name: 'Society & Culture' }
];

export const PREDEFINED_PROMPTS: Record<string, Prompt[]> = {
  'personal-growth': [
    { id: 'pg-1', theme: 'personal-growth', question: 'What edge of yourself are you growing into this year?' },
    { id: 'pg-2', theme: 'personal-growth', question: 'What habit or belief have you recently outgrown?' },
    { id: 'pg-3', theme: 'personal-growth', question: 'When was the last time you surprised yourself?' },
    { id: 'pg-4', theme: 'personal-growth', question: 'What challenge is shaping you right now?' },
    { id: 'pg-5', theme: 'personal-growth', question: 'If your growth had a metaphor, what would it be?' }
  ],
  'philosophy': [
    { id: 'ph-1', theme: 'philosophy', question: 'What belief have you been questioning lately?' },
    { id: 'ph-2', theme: 'philosophy', question: 'Computer mind vs Human mind?' },
    { id: 'ph-3', theme: 'philosophy', question: 'What does it mean to live authentically?' }
  ],
  'wellness': [
    { id: 'w-1', theme: 'wellness', question: 'What practice is helping you feel most alive lately?' },
    { id: 'w-2', theme: 'wellness', question: 'How do you reconnect with your body?' }
  ],
  'tech': [
    { id: 't-1', theme: 'tech', question: 'What\'s a future possibility that excites you (or scares you)?' },
    { id: 't-2', theme: 'tech', question: 'How can technology serve deeper human connection?' }
  ],
  'work': [
    { id: 'wo-1', theme: 'work', question: 'What are you building that feels most aligned with your purpose?' },
    { id: 'wo-2', theme: 'work', question: 'What would you create if resources weren\'t a constraint?' }
  ]
}; 