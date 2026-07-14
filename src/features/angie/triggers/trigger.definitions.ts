import type { TriggerDefinition } from './trigger.types';

const DEFAULT_DEFINITION: Omit<TriggerDefinition, 'key'> = {
  priority: 'ambient',
  cooldownMs: 60_000,
  durationMs: 5_000,
  dismissible: true,
};

const DEFINITIONS: Record<string, Omit<TriggerDefinition, 'key'>> = {
  'greetings.firstVisit': { priority: 'directReply', cooldownMs: 0, durationMs: 7_000, dismissible: true },
  'greetings.returning': { priority: 'ambient', cooldownMs: 0, durationMs: 5_000, dismissible: true },
  'greetings.longAbsence': { priority: 'ambient', cooldownMs: 0, durationMs: 6_000, dismissible: true },
  'navigation.home': { priority: 'contextualHelp', cooldownMs: 300_000, durationMs: 6_000 },
  'navigation.table': { priority: 'contextualHelp', cooldownMs: 300_000, durationMs: 6_000 },
  'navigation.fusion': { priority: 'contextualHelp', cooldownMs: 300_000, durationMs: 6_000 },
  'navigation.quantum': { priority: 'contextualHelp', cooldownMs: 300_000, durationMs: 6_000 },
  'navigation.physchem': { priority: 'contextualHelp', cooldownMs: 300_000, durationMs: 6_000 },
  'navigation.virtuallab': { priority: 'contextualHelp', cooldownMs: 300_000, durationMs: 6_000 },
  'navigation.quests': { priority: 'contextualHelp', cooldownMs: 300_000, durationMs: 6_000 },
  'navigation.quiz': { priority: 'contextualHelp', cooldownMs: 300_000, durationMs: 6_000 },
  'navigation.profile': { priority: 'contextualHelp', cooldownMs: 300_000, durationMs: 6_000 },
  'fusion.success': { priority: 'scientificResult', cooldownMs: 0, durationMs: 4_000 },
  'fusion.unstable': { priority: 'scientificResult', cooldownMs: 0, durationMs: 5_000 },
  'quiz.sessionStartTraining': { priority: 'directReply', cooldownMs: 0, durationMs: 3_500 },
  'quiz.sessionStartExam': { priority: 'directReply', cooldownMs: 0, durationMs: 3_500 },
  'quiz.sessionExcellent': { priority: 'progression', cooldownMs: 0, durationMs: 4_000 },
  'quiz.correctAnswer': { priority: 'directReply', cooldownMs: 0, durationMs: 3_000 },
  'quiz.wrongAnswer': { priority: 'directReply', cooldownMs: 0, durationMs: 3_000 },
  'virtualLab.experimentCompleted': { priority: 'scientificResult', cooldownMs: 0, durationMs: 5_000 },
  'progress.badgeUnlocked': { priority: 'progression', cooldownMs: 0, durationMs: 5_000 },
  'progress.streak': { priority: 'progression', cooldownMs: 30_000, durationMs: 4_000 },
  'quests.completed': { priority: 'progression', cooldownMs: 0, durationMs: 5_000 },
  'preferences.themeChanged': { priority: 'ambient', cooldownMs: 10_000, durationMs: 3_500 },
  'preferences.languageChanged': { priority: 'ambient', cooldownMs: 10_000, durationMs: 3_500 },
  'idle.shortIdle': { priority: 'ambient', cooldownMs: 180_000, durationMs: 6_000 },
  'idle.longIdle': { priority: 'ambient', cooldownMs: 600_000, durationMs: 4_000 },
  'errors.invalidParameter': { priority: 'criticalError', cooldownMs: 0, durationMs: 7_000, dismissible: true },
  'errors.connectionError': { priority: 'criticalError', cooldownMs: 0, durationMs: 7_000, dismissible: true },
  'errors.saveFailure': { priority: 'criticalError', cooldownMs: 0, durationMs: 7_000, dismissible: true },
  'errors.generic': { priority: 'criticalError', cooldownMs: 0, durationMs: 6_000, dismissible: true },
  'curiosity.general': { priority: 'ambient', cooldownMs: 240_000, durationMs: 5_000 },
  'sessionEnd.farewell': { priority: 'ambient', cooldownMs: 0, durationMs: 4_000 },
};

export function getTriggerDefinition(key: string): TriggerDefinition {
  return { key, ...(DEFINITIONS[key] ?? DEFAULT_DEFINITION) };
}
