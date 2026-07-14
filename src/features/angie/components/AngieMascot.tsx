import React from 'react';
import type { TabType } from '../../../app/appTypes';
import { useLanguage } from '../../../hooks/useLanguage';
import { useUserProgress } from '../../../components/useUserProgress';
import { useAngieSituation } from '../context/useAngieSituation';
import { useAngieFireDialogue } from '../triggers/useAngieFireDialogue';
import { useAngieIdle } from '../triggers/useAngieIdle';
import { useAngieTriggers } from '../triggers/useAngieTriggers';
import { useAngiePreferences } from '../services/angiePreferences';
import { useAngie } from '../state/useAngie';
import { AngieAvatar } from './AngieAvatar';
import { AngieChatPanel } from './AngieChatPanel';
import { AngieSpeechBubble } from './AngieSpeechBubble';
import '../styles/angie-mascot.css';
import '../styles/angie-chat-panel.css';
import '../styles/angie-quick-actions.css';

interface AngieMascotProps {
  activeTab: TabType;
}

export const AngieMascot: React.FC<AngieMascotProps> = ({ activeTab }) => {
  const { t } = useLanguage();
  const { profile } = useUserProgress();
  const { state, hideMessage, toggleVisibility, openPanel, closePanel } = useAngie();
  const { preferences } = useAngiePreferences();
  const situation = useAngieSituation(activeTab);
  const fireDialogue = useAngieFireDialogue();

  const mascotEnabled = profile?.mascotEnabled !== false;
  const automationEnabled = mascotEnabled && !preferences.paused;

  useAngieTriggers(situation, automationEnabled, preferences.frequencyMode);
  useAngieIdle(automationEnabled, preferences.frequencyMode);

  if (!mascotEnabled) return null;

  if (!state.isVisible) {
    return (
      <button
        className={`angie-mascot-toggle is-${preferences.position}`}
        onClick={toggleVisibility}
        aria-label={t('chrome.show', { ns: 'angie' })}
      >
        A
      </button>
    );
  }

  return (
    <>
      <div className={`angie-mascot is-${preferences.position}`}>
        {state.current && (
          <AngieSpeechBubble
            closeLabel={t('chrome.closeMessage', { ns: 'angie' })}
            message={state.current}
            onDismiss={hideMessage}
            onOpenPanel={openPanel}
            onQuickReply={() => openPanel()}
            openConversationLabel={t('chrome.openConversation', { ns: 'angie' })}
          />
        )}
        <AngieAvatar
          activateLabel={t('chrome.activate', { ns: 'angie' })}
          emotion={state.emotion}
          hideLabel={t('chrome.hide', { ns: 'angie' })}
          onActivate={() => {
            if (!state.current) fireDialogue('curiosity.general', preferences.frequencyMode);
            else openPanel();
          }}
          onToggleVisibility={toggleVisibility}
        />
      </div>
      <AngieChatPanel isOpen={state.isPanelOpen} onClose={closePanel} situation={situation} />
    </>
  );
};
