import React, { useState } from 'react';
import { Send, Square } from 'lucide-react';
import { Textarea } from '../../../design-system';

interface ResponseAction {
  intentId: string;
  label: string;
}

interface AngieChatInputProps {
  isResponding: boolean;
  inputLabel: string;
  placeholder: string;
  sendLabel: string;
  stopLabel: string;
  responseActions: ResponseAction[];
  onSend: (text: string) => void;
  onStop: () => void;
  onResponseAction: (intentId: string, label: string) => void;
}

export const AngieChatInput: React.FC<AngieChatInputProps> = ({
  isResponding,
  inputLabel,
  placeholder,
  sendLabel,
  stopLabel,
  responseActions,
  onSend,
  onStop,
  onResponseAction,
}) => {
  const [value, setValue] = useState('');

  const submit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue('');
  };

  return (
    <div className="angie-chat-input-area">
      <div className="angie-chat-response-actions">
        {responseActions.map((action) => (
          <button key={action.intentId} onClick={() => onResponseAction(action.intentId, action.label)} type="button">
            {action.label}
          </button>
        ))}
      </div>
      <div className="angie-chat-input-row">
        <Textarea
          className="angie-chat-textarea"
          controlSize="sm"
          label={inputLabel}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          value={value}
        />
        {isResponding ? (
          <button className="angie-chat-send is-stop" onClick={onStop} aria-label={stopLabel} type="button">
            <Square size={16} />
          </button>
        ) : (
          <button className="angie-chat-send" onClick={submit} aria-label={sendLabel} type="button" disabled={!value.trim()}>
            <Send size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
