import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import type { AngieMessage } from '../state/angie.types';

interface AngieSpeechBubbleProps {
  message: AngieMessage;
  closeLabel: string;
  openConversationLabel: string;
  onDismiss: () => void;
  onOpenPanel: () => void;
  onQuickReply: (actionId: string) => void;
}

export const AngieSpeechBubble: React.FC<AngieSpeechBubbleProps> = ({
  message,
  closeLabel,
  openConversationLabel,
  onDismiss,
  onOpenPanel,
  onQuickReply,
}) => (
  <div className="angie-mascot-bubble animate-pop-in" role="status" aria-live="polite">
    <p className="angie-mascot-bubble-text">{message.text}</p>

    {message.quickReplies && message.quickReplies.length > 0 && (
      <div className="angie-mascot-bubble-replies">
        {message.quickReplies.map((reply) => (
          <button key={reply.id} className="angie-mascot-bubble-reply" onClick={() => onQuickReply(reply.actionId)}>
            {reply.label}
          </button>
        ))}
      </div>
    )}

    <div className="angie-mascot-bubble-actions">
      <button className="angie-mascot-bubble-open" onClick={onOpenPanel} aria-label={openConversationLabel}>
        <MessageCircle size={13} />
      </button>
      {message.dismissible !== false && (
        <button className="angie-mascot-close" onClick={onDismiss} aria-label={closeLabel}>
          <X size={12} />
        </button>
      )}
    </div>
  </div>
);
