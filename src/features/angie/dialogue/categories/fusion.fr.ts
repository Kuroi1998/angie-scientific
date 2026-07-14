import type { DialogueBank } from '../dialogue.types';

export const fusionFr: DialogueBank = {
  success: [
    { id: 'fusion.success.1', text: 'Belle reaction !', emotion: 'happy' },
    { id: 'fusion.success.2', text: 'Ça fonctionne, bien joue.', emotion: 'proud' },
    { id: 'fusion.success.3', text: 'Reaction stable, excellent choix de reactifs.', emotion: 'happy' },
    { id: 'fusion.success.4', text: 'Voila un resultat propre.', emotion: 'proud' },
  ],
  unstable: [
    { id: 'fusion.unstable.1', text: 'Cette combinaison n’est pas stable.', emotion: 'thinking' },
    { id: 'fusion.unstable.2', text: 'Pas de reaction viable ici, essaie une autre paire.', emotion: 'thinking' },
    { id: 'fusion.unstable.3', text: 'Ces deux reactifs ne s’accordent pas. Retente avec d’autres elements.', emotion: 'curious' },
  ],
  selectionTip: [
    { id: 'fusion.selectionTip.1', text: 'Choisis deux elements pour lancer le calcul de la reaction.', emotion: 'attentive' },
  ],
};
