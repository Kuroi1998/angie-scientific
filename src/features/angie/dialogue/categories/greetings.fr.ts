import type { DialogueBank } from '../dialogue.types';

export const greetingsFr: DialogueBank = {
  firstVisit: [
    { id: 'greetings.firstVisit.1', text: 'Bienvenue ! Je suis Angie, ton assistante scientifique. Je serai la pour t’aider a explorer, comprendre et experimenter.', emotion: 'happy' },
    { id: 'greetings.firstVisit.2', text: 'Salut, je m’appelle Angie. Une question de chimie, de physique ou sur les elements ? N’hesite pas.', emotion: 'attentive' },
    { id: 'greetings.firstVisit.3', text: 'Ravie de te rencontrer ! Explore a ton rythme, je reste disponible sans etre envahissante.', emotion: 'happy' },
    { id: 'greetings.firstVisit.4', text: 'Bienvenue dans Angie Scientific. Clique sur moi quand tu veux discuter ou demander un coup de main.', emotion: 'encouraging' },
  ],
  returning: [
    { id: 'greetings.returning.1', text: 'Contente de te revoir. On reprend la ou tu en etais ?', emotion: 'happy' },
    { id: 'greetings.returning.2', text: 'Re-bonjour ! Une nouvelle experience t’attend peut-etre aujourd’hui.', emotion: 'curious' },
    { id: 'greetings.returning.3', text: 'Salut, pret a continuer l’exploration ?', emotion: 'attentive' },
  ],
  longAbsence: [
    { id: 'greetings.longAbsence.1', text: 'Ça faisait un moment ! Contente de te revoir.', emotion: 'happy' },
    { id: 'greetings.longAbsence.2', text: 'Bon retour parmi nous. Il reste encore beaucoup de choses a decouvrir.', emotion: 'encouraging' },
    { id: 'greetings.longAbsence.3', text: 'Content de te revoir par ici. On continue ?', emotion: 'attentive' },
  ],
};
