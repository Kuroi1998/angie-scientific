import React from 'react';
import { Eraser, MessageSquarePlus } from 'lucide-react';
import { BottomSheet, Drawer } from '../../../design-system';
import { useLanguage } from '../../../hooks/useLanguage';
import type { AngieSituation } from '../context/situation.types';
import { useIsMobileViewport } from '../hooks/useIsMobileViewport';
import { useAngieConversation } from '../intents/useAngieConversation';
import { useAngie } from '../state/useAngie';
import { AngieChatInput } from './AngieChatInput';
import { AngieChatMessageList } from './AngieChatMessageList';
import { AngieQuickActions } from './AngieQuickActions';

interface AngieChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  situation: AngieSituation;
}

const RESPONSE_ACTION_IDS = ['simplify', 'deepen', 'giveExample', 'stepByStep', 'hint'] as const;
const QUICK_ACTION_IDS = ['explainPage', 'summarize', 'verifyResult', 'trivia', 'joke', 'whatNext'] as const;

export const AngieChatPanel: React.FC<AngieChatPanelProps> = ({ isOpen, onClose, situation }) => {
  const { t } = useLanguage();
  const { state, clearChat, startNewConversation } = useAngie();
  const { send, sendIntent, cancel } = useAngieConversation(situation);
  const isMobile = useIsMobileViewport();
  const PanelComponent = isMobile ? BottomSheet : Drawer;

  const quickActions = QUICK_ACTION_IDS.map((id) => ({ intentId: id, label: t(`intent.${id}`, { ns: 'angie' }) }));
  const responseActions = RESPONSE_ACTION_IDS.map((id) => ({ intentId: id, label: t(`intent.${id}`, { ns: 'angie' }) }));

  return (
    <PanelComponent
      actions={(
        <AngieChatInput
          inputLabel={t('chat.inputLabel', { ns: 'angie' })}
          isResponding={state.isResponding}
          onResponseAction={(intentId, label) => sendIntent(intentId, label)}
          onSend={send}
          onStop={cancel}
          placeholder={t('chat.placeholder', { ns: 'angie' })}
          responseActions={responseActions}
          sendLabel={t('chat.send', { ns: 'angie' })}
          stopLabel={t('chat.stop', { ns: 'angie' })}
        />
      )}
      bodyClassName="angie-chat-panel-body"
      className="angie-chat-panel"
      closeLabel={t('chat.close', { ns: 'angie' })}
      isOpen={isOpen}
      onClose={onClose}
      title={t('chat.title', { ns: 'angie' })}
    >
      <div className="angie-chat-toolbar">
        <button onClick={startNewConversation} type="button">
          <MessageSquarePlus size={14} /> {t('chat.newConversation', { ns: 'angie' })}
        </button>
        <button onClick={clearChat} type="button">
          <Eraser size={14} /> {t('chat.clearHistory', { ns: 'angie' })}
        </button>
      </div>

      <AngieChatMessageList
        copyLabel={t('chat.copy', { ns: 'angie' })}
        emptyStateText={t('chat.empty', { ns: 'angie' })}
        isResponding={state.isResponding}
        messages={state.chatMessages}
        onQuickReply={(actionId) => sendIntent(actionId, t(`intent.${actionId}`, { ns: 'angie' }))}
        thinkingLabel={t('chat.thinking', { ns: 'angie' })}
      />

      <AngieQuickActions actions={quickActions} onSelect={(intentId, label) => sendIntent(intentId, label)} />
    </PanelComponent>
  );
};
