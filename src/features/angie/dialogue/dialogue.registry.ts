import { greetingsFr } from './categories/greetings.fr';
import { greetingsEs } from './categories/greetings.es';
import { navigationFr } from './categories/navigation.fr';
import { navigationEs } from './categories/navigation.es';
import { periodicTableFr } from './categories/periodicTable.fr';
import { periodicTableEs } from './categories/periodicTable.es';
import { quantumFr } from './categories/quantum.fr';
import { quantumEs } from './categories/quantum.es';
import { fusionFr } from './categories/fusion.fr';
import { fusionEs } from './categories/fusion.es';
import { physchemFr } from './categories/physchem.fr';
import { physchemEs } from './categories/physchem.es';
import { virtualLabFr } from './categories/virtualLab.fr';
import { virtualLabEs } from './categories/virtualLab.es';
import { quizFr } from './categories/quiz.fr';
import { quizEs } from './categories/quiz.es';
import { questsFr } from './categories/quests.fr';
import { questsEs } from './categories/quests.es';
import { progressFr } from './categories/progress.fr';
import { progressEs } from './categories/progress.es';
import { encouragementFr } from './categories/encouragement.fr';
import { encouragementEs } from './categories/encouragement.es';
import { curiosityFr } from './categories/curiosity.fr';
import { curiosityEs } from './categories/curiosity.es';
import { errorsFr } from './categories/errors.fr';
import { errorsEs } from './categories/errors.es';
import { idleFr } from './categories/idle.fr';
import { idleEs } from './categories/idle.es';
import { preferencesFr } from './categories/preferences.fr';
import { preferencesEs } from './categories/preferences.es';
import { sessionEndFr } from './categories/sessionEnd.fr';
import { sessionEndEs } from './categories/sessionEnd.es';
import type { DialogueBank, DialogueRegistry } from './dialogue.types';

function flatten(category: string, bank: DialogueBank): Record<string, DialogueBank[string]> {
  const out: Record<string, DialogueBank[string]> = {};
  for (const [situation, variants] of Object.entries(bank)) {
    out[`${category}.${situation}`] = variants;
  }
  return out;
}

function buildLanguageRegistry(banks: Record<string, DialogueBank>): Record<string, DialogueBank[string]> {
  return Object.entries(banks).reduce((acc, [category, bank]) => ({ ...acc, ...flatten(category, bank) }), {});
}

const FR_BANKS: Record<string, DialogueBank> = {
  greetings: greetingsFr,
  navigation: navigationFr,
  periodicTable: periodicTableFr,
  quantum: quantumFr,
  fusion: fusionFr,
  physchem: physchemFr,
  virtualLab: virtualLabFr,
  quiz: quizFr,
  quests: questsFr,
  progress: progressFr,
  encouragement: encouragementFr,
  curiosity: curiosityFr,
  errors: errorsFr,
  idle: idleFr,
  preferences: preferencesFr,
  sessionEnd: sessionEndFr,
};

const ES_BANKS: Record<string, DialogueBank> = {
  greetings: greetingsEs,
  navigation: navigationEs,
  periodicTable: periodicTableEs,
  quantum: quantumEs,
  fusion: fusionEs,
  physchem: physchemEs,
  virtualLab: virtualLabEs,
  quiz: quizEs,
  quests: questsEs,
  progress: progressEs,
  encouragement: encouragementEs,
  curiosity: curiosityEs,
  errors: errorsEs,
  idle: idleEs,
  preferences: preferencesEs,
  sessionEnd: sessionEndEs,
};

export const DIALOGUE_REGISTRY: DialogueRegistry = {
  fr: buildLanguageRegistry(FR_BANKS),
  es: buildLanguageRegistry(ES_BANKS),
};
