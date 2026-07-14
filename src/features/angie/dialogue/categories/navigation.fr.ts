import type { DialogueBank } from '../dialogue.types';

export const navigationFr: DialogueBank = {
  home: [
    { id: 'navigation.home.1', text: 'Voici ton tableau de bord. Je te proposerai toujours une prochaine activite utile.', emotion: 'encouraging' },
    { id: 'navigation.home.2', text: 'D’ici, tu peux rejoindre chaque module. Regarde ta progression a droite.', emotion: 'attentive' },
    { id: 'navigation.home.3', text: 'Retour a l’accueil. Envie de reprendre une experience en cours ?', emotion: 'curious' },
  ],
  table: [
    { id: 'navigation.table.1', text: 'Voici le tableau periodique. Clique sur un element pour decouvrir ses secrets.', emotion: 'happy' },
    { id: 'navigation.table.2', text: 'Tu peux chercher un element par nom ou par symbole en haut du tableau.', emotion: 'attentive' },
    { id: 'navigation.table.3', text: 'Chaque case cache une histoire. Laquelle veux-tu explorer aujourd’hui ?', emotion: 'curious' },
  ],
  fusion: [
    { id: 'navigation.fusion.1', text: 'Ici, tu peux combiner deux elements. Essaie d’associer Hydrogene (H) et Oxygene (O).', emotion: 'curious' },
    { id: 'navigation.fusion.2', text: 'Le simulateur de fusion calcule vraiment la reaction, pas d’invention de ma part.', emotion: 'explaining' },
    { id: 'navigation.fusion.3', text: 'Choisis deux reactifs et observe ce qu’il se passe.', emotion: 'attentive' },
  ],
  quantum: [
    { id: 'navigation.quantum.1', text: 'La physique quantique est complexe mais fascinante. Observe la forme des orbitales.', emotion: 'thinking' },
    { id: 'navigation.quantum.2', text: 'Ajuste n, l et m pour voir l’orbitale changer de forme en temps reel.', emotion: 'explaining' },
    { id: 'navigation.quantum.3', text: 'Prends ton temps ici, les nombres quantiques demandent un peu de pratique.', emotion: 'encouraging' },
  ],
  physchem: [
    { id: 'navigation.physchem.1', text: 'Le diagramme de phase montre les etats de la matiere selon la temperature et la pression.', emotion: 'explaining' },
    { id: 'navigation.physchem.2', text: 'Fais varier les parametres et regarde comment la courbe reagit.', emotion: 'curious' },
    { id: 'navigation.physchem.3', text: 'Le labo physique-chimie est parfait pour tester des hypotheses.', emotion: 'attentive' },
  ],
  virtuallab: [
    { id: 'navigation.virtuallab.1', text: 'C’est ton propre laboratoire virtuel. Remplis les fioles et observe les reactions.', emotion: 'encouraging' },
    { id: 'navigation.virtuallab.2', text: 'Chaque experience ici suit un protocole reel, etape par etape.', emotion: 'explaining' },
    { id: 'navigation.virtuallab.3', text: 'Pret a manipuler virtuellement sans aucun risque ?', emotion: 'happy' },
  ],
  quests: [
    { id: 'navigation.quests.1', text: 'Complete des quetes pour debloquer de nouveaux badges scientifiques.', emotion: 'encouraging' },
    { id: 'navigation.quests.2', text: 'Chaque quete te fait progresser un peu plus loin. Laquelle tentes-tu ?', emotion: 'curious' },
  ],
  quiz: [
    { id: 'navigation.quiz.1', text: 'Teste tes connaissances avec un quiz, un entrainement ou une devinette.', emotion: 'attentive' },
    { id: 'navigation.quiz.2', text: 'Choisis le mode entrainement pour apprendre sans pression, ou l’examen pour te challenger.', emotion: 'explaining' },
  ],
  profile: [
    { id: 'navigation.profile.1', text: 'Voici ton profil : progression, badges et preferences.', emotion: 'attentive' },
    { id: 'navigation.profile.2', text: 'Tu peux ajuster mes reglages ici, comme ma frequence de dialogue.', emotion: 'neutral' },
  ],
};
