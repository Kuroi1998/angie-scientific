import type { DialogueBank } from '../dialogue.types';

export const errorsFr: DialogueBank = {
  invalidParameter: [
    { id: 'errors.invalidParameter.1', text: 'Cette valeur n’est pas valide pour ce calcul. Verifie l’unite et la plage attendue.', emotion: 'worried' },
  ],
  connectionError: [
    { id: 'errors.connectionError.1', text: 'La connexion au serveur a echoue. Tu peux reessayer, tes donnees locales sont conservees.', emotion: 'worried' },
  ],
  saveFailure: [
    { id: 'errors.saveFailure.1', text: 'La sauvegarde n’a pas abouti. Je reessaierai automatiquement des que possible.', emotion: 'worried' },
  ],
  generic: [
    { id: 'errors.generic.1', text: 'Quelque chose s’est mal passe. Tu peux reessayer l’action.', emotion: 'confused' },
  ],
};
