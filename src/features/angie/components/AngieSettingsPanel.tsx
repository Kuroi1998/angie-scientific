import React from 'react';
import { Bot } from 'lucide-react';
import { Radio, Switch } from '../../../design-system';
import { useLanguage } from '../../../hooks/useLanguage';
import type { FrequencyMode } from '../dialogue/dialogue.cooldown';
import { useAngiePreferences } from '../services/angiePreferences';
import '../styles/angie-quick-actions.css';

const FREQUENCY_MODES: FrequencyMode[] = ['discrete', 'balanced', 'talkative'];

export const AngieSettingsPanel: React.FC = () => {
  const { t } = useLanguage();
  const { preferences, update } = useAngiePreferences();

  return (
    <div className="user-id-card">
      <strong><Bot size={19} aria-hidden="true" /> {t('settings.title', { ns: 'angie' })}</strong>

      <fieldset className="angie-settings-group">
        <legend>{t('settings.frequencyLabel', { ns: 'angie' })}</legend>
        {FREQUENCY_MODES.map((mode) => (
          <Radio
            key={mode}
            checked={preferences.frequencyMode === mode}
            label={t(`settings.frequency.${mode}`, { ns: 'angie' })}
            name="angie-frequency"
            onChange={() => update({ frequencyMode: mode })}
          />
        ))}
      </fieldset>

      <Switch
        checked={!preferences.paused}
        label={t('settings.autoDialogue', { ns: 'angie' })}
        onChange={() => update({ paused: !preferences.paused })}
      />
      <Switch
        checked={preferences.showQuickSuggestions}
        label={t('settings.quickSuggestions', { ns: 'angie' })}
        onChange={() => update({ showQuickSuggestions: !preferences.showQuickSuggestions })}
      />
      <Switch
        checked={preferences.historyEnabled}
        label={t('settings.history', { ns: 'angie' })}
        onChange={() => update({ historyEnabled: !preferences.historyEnabled })}
      />

      <fieldset className="angie-settings-group">
        <legend>{t('settings.positionLabel', { ns: 'angie' })}</legend>
        <Radio
          checked={preferences.position === 'right'}
          label={t('settings.positionRight', { ns: 'angie' })}
          name="angie-position"
          onChange={() => update({ position: 'right' })}
        />
        <Radio
          checked={preferences.position === 'left'}
          label={t('settings.positionLeft', { ns: 'angie' })}
          name="angie-position"
          onChange={() => update({ position: 'left' })}
        />
      </fieldset>
    </div>
  );
};
