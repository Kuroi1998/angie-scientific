import React from 'react';
import { CheckSquare, Target } from 'lucide-react';
import { Badge, ProgressBar } from '../../design-system';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import {
  achievementBadges,
  isStringArray,
  levelTone,
  quests,
} from './questData';
import '../LabStation/lab-station.css';
import './quiz-mode.css';

export const QuestSystem: React.FC = () => {
  const [completedQuests, setCompletedQuests] = useLocalStorageState<string[]>(
    'questProgress',
    [],
    {
      validate: isStringArray,
      legacyKey: 'angie_scientific_quests_completed',
      parseLegacy: (raw) => {
        try {
          const parsed: unknown = JSON.parse(raw);
          return isStringArray(parsed) ? parsed : undefined;
        } catch {
          return undefined;
        }
      },
    },
  );

  const totalPoints = completedQuests.reduce((sum, id) => {
    const quest = quests.find((item) => item.id === id);
    return quest ? sum + quest.points : sum;
  }, 0);
  const progressPercent = quests.length > 0 ? (completedQuests.length / quests.length) * 100 : 0;

  const toggleQuest = (id: string) => {
    setCompletedQuests((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  };

  return (
    <div className="quiz-grid">
      <section className="lab-panel">
        <div className="lab-panel-header">
          <div>
            <p className="as-eyebrow">Defis actifs</p>
            <h2>Quetes scientifiques</h2>
          </div>
          <Target size={20} aria-hidden="true" />
        </div>
        <div className="lab-panel-body">
          <div className="quiz-card-list">
            {quests.map((quest) => {
              const completed = completedQuests.includes(quest.id);
              return (
                <button
                  aria-checked={completed}
                  className="quiz-mode-card"
                  data-selected={completed}
                  key={quest.id}
                  onClick={() => toggleQuest(quest.id)}
                  role="checkbox"
                  type="button"
                >
                  <strong>{quest.title}</strong>
                  <span>{quest.desc}</span>
                  <span className="quiz-status-row">
                    <Badge tone={levelTone(quest.level)}>{quest.level}</Badge>
                    <Badge tone="info">+{quest.points} pts</Badge>
                    {completed && <CheckSquare size={16} aria-hidden="true" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="lab-panel">
        <div className="lab-panel-header">
          <div>
            <p className="as-eyebrow">Classement</p>
            <h2>Progression locale</h2>
          </div>
          <Badge tone="success">{totalPoints}</Badge>
        </div>
        <div className="lab-panel-body">
          <div className="lab-readout-grid">
            <div className="lab-readout"><span>Points</span><Badge tone="success">{totalPoints}</Badge></div>
            <div className="lab-readout"><span>Defis</span><Badge>{completedQuests.length}/{quests.length}</Badge></div>
          </div>
          <ProgressBar label="Accreditation" value={progressPercent} />
          <div className="quiz-history-table">
            {achievementBadges.map((badge) => {
              const Icon = badge.icon;
              const unlocked = totalPoints >= badge.min;
              return (
                <div className="quiz-history-row" key={badge.name}>
                  <span><Icon size={16} aria-hidden="true" /> {badge.name}</span>
                  <Badge tone={unlocked ? 'success' : 'neutral'}>
                    {unlocked ? 'Debloque' : `${badge.min} pts`}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
