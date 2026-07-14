import type { AngieSituation } from '../context/situation.types';
import type { DialogueLanguage } from '../dialogue/dialogue.types';
import type { GasEquationsScientificContext, FusionScientificContext } from './scientificContext';

export interface IntentResponse {
  text: string;
}

export interface IntentRespondArgs {
  language: DialogueLanguage;
  situation: AngieSituation;
  fusion: FusionScientificContext | null;
  gasEquations: GasEquationsScientificContext | null;
}

export interface IntentDefinition {
  id: string;
  keywords: Record<DialogueLanguage, string[]>;
  respond: (args: IntentRespondArgs) => IntentResponse;
}
