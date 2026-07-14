import type { DialogueBank } from '../dialogue.types';

export const periodicTableFr: DialogueBank = {
  searchUsed: [
    { id: 'periodicTable.searchUsed.1', text: 'Bonne piste. Tu peux aussi filtrer par categorie si tu cherches un type d’element precis.', emotion: 'attentive' },
    { id: 'periodicTable.searchUsed.2', text: 'La recherche fonctionne aussi par symbole, essaie par exemple "Fe".', emotion: 'explaining' },
  ],
  comparisonUsed: [
    { id: 'periodicTable.comparisonUsed.1', text: 'Comparer deux elements, c’est une excellente facon de reperer les tendances periodiques.', emotion: 'curious' },
    { id: 'periodicTable.comparisonUsed.2', text: 'Regarde bien le rayon atomique et l’electronegativite : ils racontent beaucoup de choses.', emotion: 'explaining' },
  ],
  favoriteAdded: [
    { id: 'periodicTable.favoriteAdded.1', text: 'Ajoute a tes favoris. Tu le retrouveras facilement depuis ton profil.', emotion: 'happy' },
    { id: 'periodicTable.favoriteAdded.2', text: 'Bon choix, c’est un element interessant a suivre.', emotion: 'attentive' },
  ],
};
