import React, { useEffect, useRef } from 'react';
import { Copy } from 'lucide-react';
import type { ChatMessage } from '../state/angie.types';

interface AngieChatMessageListProps {
  messages: ChatMessage[];
  isResponding: boolean;
  emptyStateText: string;
  thinkingLabel: string;
  copyLabel: string;
  onQuickReply: (actionId: string) => void;
}

export const AngieChatMessageList: React.FC<AngieChatMessageListProps> = ({
  messages,
  isResponding,
  emptyStateText,
  thinkingLabel,
  copyLabel,
  onQuickReply,
}) => {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: 'end' });
  }, [messages.length, isResponding]);

  if (messages.length === 0 && !isResponding) {
    return <p className="angie-chat-empty">{emptyStateText}</p>;
  }

  return (
    <div className="angie-chat-messages" role="log" aria-live="polite">
      {messages.map((message) => (
        <div key={message.id} className={`angie-chat-message is-${message.role}`}>
          <p>{message.text}</p>
          {message.role === 'angie' && (
            <button
              className="angie-chat-copy"
              onClick={() => { void navigator.clipboard?.writeText(message.text); }}
              aria-label={copyLabel}
            >
              <Copy size={12} />
            </button>
          )}
          {message.quickReplies && message.quickReplies.length > 0 && (
            <div className="angie-chat-message-replies">
              {message.quickReplies.map((reply) => (
                <button key={reply.id} onClick={() => onQuickReply(reply.actionId)}>
                  {reply.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      {isResponding && (
        <div className="angie-chat-message is-angie is-thinking" aria-live="polite">
          <span className="angie-chat-thinking-dots" aria-hidden="true">•••</span>
          <span className="as-visually-hidden">{thinkingLabel}</span>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};
