import type { DialogueBank } from '../dialogue.types';

export const quantumFr: DialogueBank = {
  orbitalChanged: [
    { id: 'quantum.orbitalChanged.1', text: 'Cette orbitale a une geometrie particuliere. Regarde ou se concentre la densite electronique.', emotion: 'curious' },
    { id: 'quantum.orbitalChanged.2', text: 'Plus n augmente, plus l’orbitale s’etend. Essaie de comparer deux valeurs de n.', emotion: 'explaining' },
  ],
  viewModeChanged: [
    { id: 'quantum.viewModeChanged.1', text: 'Le mode densite montre la probabilite de presence de l’electron.', emotion: 'explaining' },
    { id: 'quantum.viewModeChanged.2', text: 'Le mode phase distingue les lobes positifs et negatifs de la fonction d’onde.', emotion: 'thinking' },
  ],
};
