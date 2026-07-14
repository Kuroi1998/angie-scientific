import type { DialogueBank } from '../dialogue.types';

export const periodicTableEs: DialogueBank = {
  searchUsed: [
    { id: 'periodicTable.searchUsed.1', text: 'Buena pista. Tambien puedes filtrar por categoria si buscas un tipo de elemento concreto.', emotion: 'attentive' },
    { id: 'periodicTable.searchUsed.2', text: 'La busqueda tambien funciona por simbolo, prueba por ejemplo "Fe".', emotion: 'explaining' },
  ],
  comparisonUsed: [
    { id: 'periodicTable.comparisonUsed.1', text: 'Comparar dos elementos es una excelente forma de detectar tendencias periodicas.', emotion: 'curious' },
    { id: 'periodicTable.comparisonUsed.2', text: 'Fijate bien en el radio atomico y la electronegatividad: dicen mucho.', emotion: 'explaining' },
  ],
  favoriteAdded: [
    { id: 'periodicTable.favoriteAdded.1', text: 'Anadido a tus favoritos. Lo encontraras facil desde tu perfil.', emotion: 'happy' },
    { id: 'periodicTable.favoriteAdded.2', text: 'Buena eleccion, es un elemento interesante para seguir.', emotion: 'attentive' },
  ],
};
