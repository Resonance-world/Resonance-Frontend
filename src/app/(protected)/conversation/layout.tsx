import { ReactNode } from 'react';

interface ConversationLayoutProps {
  children: ReactNode;
}

/**
 * Conversation layout removes World SDK navbar to prevent text input hiding
 * This layout provides a clean chat environment without navigation interference
 */
export default function ConversationLayout({ children }: ConversationLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Remove all navigation and headers for clean chat experience */}
      {children}
    </div>
  );
} 