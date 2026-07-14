import { DIALOGUE_REGISTRY } from '../dialogue/dialogue.registry';
import type { IntentDefinition, IntentRespondArgs } from './intent.types';

const staticText = (fr: string, es: string) => ({ fr, es });

const TEXTS: Record<string, { fr: string; es: string }> = {
  greeting: staticText('Salut ! Comment puis-je t’aider aujourd’hui ?', 'Hola! Como puedo ayudarte hoy?'),
  thanks: staticText('Avec plaisir, je suis la pour ca.', 'Con gusto, para eso estoy.'),
  whoAreYou: staticText(
    'Je suis Angie, une assistante scientifique integree a l’application. Je m’appuie sur les vrais calculs du site, je n’invente jamais de valeurs.',
    'Soy Angie, una asistente cientifica integrada en la aplicacion. Me baso en los calculos reales del sitio, nunca invento valores.',
  ),
  whatCanYouDo: staticText(
    'Je peux t’expliquer une page, resumer, donner un exemple, detailler etape par etape, ou verifier un resultat scientifique deja calcule.',
    'Puedo explicarte una pagina, resumir, dar un ejemplo, detallar paso a paso, o verificar un resultado cientifico ya calculado.',
  ),
  summarize: staticText(
    'En resume : cette page te permet d’experimenter et d’observer un resultat scientifique reel, calcule par le moteur de l’application.',
    'En resumen: esta pagina te permite experimentar y observar un resultado cientifico real, calculado por el motor de la aplicacion.',
  ),
  giveExample: staticText(
    'Par exemple, essaie de combiner Hydrogene (H) et Oxygene (O) dans le simulateur de fusion pour voir une reaction concrete.',
    'Por ejemplo, prueba a combinar Hidrogeno (H) y Oxigeno (O) en el simulador de fusion para ver una reaccion concreta.',
  ),
  stepByStep: staticText(
    'Etape 1 : choisis tes parametres ou reactifs. Etape 2 : observe le resultat calcule. Etape 3 : compare avec une autre valeur pour voir l’effet.',
    'Paso 1: elige tus parametros o reactivos. Paso 2: observa el resultado calculado. Paso 3: compara con otro valor para ver el efecto.',
  ),
  simplify: staticText(
    'En version courte : change une valeur, regarde ce qui bouge, et essaie de deviner pourquoi avant de verifier.',
    'En version corta: cambia un valor, mira que se mueve, e intenta adivinar por que antes de comprobarlo.',
  ),
  deepen: staticText(
    'Pour aller plus loin, regarde comment le resultat change quand tu fais varier un seul parametre a la fois : c’est la meilleure facon de comprendre une relation scientifique.',
    'Para profundizar, observa como cambia el resultado al variar un solo parametro a la vez: es la mejor forma de entender una relacion cientifica.',
  ),
  hint: staticText(
    'Petit indice : regarde d’abord les unites, elles donnent souvent la reponse sur la nature du resultat.',
    'Una pista: fijate primero en las unidades, suelen indicar la naturaleza del resultado.',
  ),
  whatNext: staticText(
    'Tu peux essayer une autre combinaison, ou aller verifier ta progression dans ton profil.',
    'Puedes probar otra combinacion, o revisar tu progreso en tu perfil.',
  ),
  noFusionResult: staticText(
    'Je n’ai pas encore de resultat de fusion a verifier. Choisis deux reactifs dans le simulateur d’abord.',
    'Todavia no tengo un resultado de fusion para verificar. Elige primero dos reactivos en el simulador.',
  ),
  noGasResult: staticText(
    'Je n’ai pas encore de resultat sur les equations des gaz. Renseigne d’abord les parametres dans le labo.',
    'Todavia no tengo un resultado sobre las ecuaciones de gases. Introduce primero los parametros en el laboratorio.',
  ),
  fallback: staticText(
    'Je n’ai pas bien saisi ta question. Tu peux reformuler, ou utiliser une des actions rapides ci-dessous.',
    'No entendi bien tu pregunta. Puedes reformularla, o usar una de las acciones rapidas de abajo.',
  ),
  trivia: staticText(
    'Savais-tu que l’hélium a été découvert sur le Soleil avant d’être trouvé sur Terre ? D’où son nom dérivé du dieu grec Hélios !',
    '¿Sabías que el helio fue descubierto en el Sol antes de ser encontrado en la Tierra? ¡De ahí su nombre derivado del dios griego Helios!'
  ),
  joke: staticText(
    'Que dit un atome quand il perd un électron ? "Je suis positif !" 😄',
    '¿Qué dice un átomo cuando pierde un electrón? "¡Soy positivo!" 😄'
  ),
};

const KEYWORDS_FR: Record<string, string[]> = {
  greeting: ['salut', 'bonjour', 'coucou', 'hello'],
  thanks: ['merci'],
  whoAreYou: ['qui es-tu', 'qui es tu', 'tu es qui'],
  whatCanYouDo: ['que peux-tu faire', 'que sais-tu faire', 'aide-moi', 'aide moi'],
  summarize: ['resume', 'resumer'],
  giveExample: ['exemple', 'illustre'],
  stepByStep: ['etape', 'etapes', 'pas a pas'],
  simplify: ['simplifie', 'plus simple', 'simple'],
  deepen: ['approfondis', 'plus de detail', 'detaille', 'avance'],
  hint: ['indice', 'astuce', 'aide'],
  verifyResult: ['verifie', 'verifier', 'resultat correct', 'c’est juste'],
  whatNext: ['quoi faire', 'ensuite', 'apres', 'prochaine etape'],
  explainPage: ['explique', 'explique cette page', 'c’est quoi cette page'],
  trivia: ['fait', 'anecdote', 'trivia', 'surprends-moi', 'surprends moi'],
  joke: ['blague', 'humour', 'fais-moi rire', 'drôle', 'drole'],
};

const KEYWORDS_ES: Record<string, string[]> = {
  greeting: ['hola', 'buenas'],
  thanks: ['gracias'],
  whoAreYou: ['quien eres', 'que eres'],
  whatCanYouDo: ['que puedes hacer', 'que sabes hacer', 'ayudame'],
  summarize: ['resume', 'resumen'],
  giveExample: ['ejemplo', 'muestrame'],
  stepByStep: ['paso a paso', 'pasos'],
  simplify: ['simplifica', 'mas simple', 'simple'],
  deepen: ['profundiza', 'mas detalle', 'detalla', 'avanzado'],
  hint: ['pista', 'ayuda'],
  verifyResult: ['verifica', 'verificar', 'esta bien', 'es correcto'],
  whatNext: ['que hago', 'despues', 'siguiente paso'],
  explainPage: ['explica', 'explica esta pagina', 'que es esta pagina'],
  trivia: ['dato', 'curiosidad', 'sorprendeme'],
  joke: ['broma', 'chiste', 'hazme reir', 'gracioso'],
};

function respondStatic(id: keyof typeof TEXTS) {
  return ({ language }: IntentRespondArgs) => ({ text: TEXTS[id][language] });
}

function respondExplainPage({ language, situation }: IntentRespondArgs) {
  const variants = DIALOGUE_REGISTRY[language][`navigation.${situation.currentTab}`];
  return { text: variants?.[0]?.text ?? TEXTS.summarize[language] };
}

function respondVerifyFusion({ language, fusion }: IntentRespondArgs) {
  if (!fusion || !fusion.productSymbol) return { text: TEXTS.noFusionResult[language] };
  const state = fusion.stable
    ? (language === 'fr' ? 'stable' : 'estable')
    : (language === 'fr' ? 'instable' : 'inestable');
  const productLabel = language === 'fr' ? 'Le produit calcule est' : 'El producto calculado es';
  return { text: `${productLabel} ${fusion.productSymbol} (${state}).` };
}

export const INTENT_REGISTRY: IntentDefinition[] = [
  { id: 'greeting', keywords: { fr: KEYWORDS_FR.greeting, es: KEYWORDS_ES.greeting }, respond: respondStatic('greeting') },
  { id: 'thanks', keywords: { fr: KEYWORDS_FR.thanks, es: KEYWORDS_ES.thanks }, respond: respondStatic('thanks') },
  { id: 'whoAreYou', keywords: { fr: KEYWORDS_FR.whoAreYou, es: KEYWORDS_ES.whoAreYou }, respond: respondStatic('whoAreYou') },
  { id: 'whatCanYouDo', keywords: { fr: KEYWORDS_FR.whatCanYouDo, es: KEYWORDS_ES.whatCanYouDo }, respond: respondStatic('whatCanYouDo') },
  { id: 'explainPage', keywords: { fr: KEYWORDS_FR.explainPage, es: KEYWORDS_ES.explainPage }, respond: respondExplainPage },
  { id: 'summarize', keywords: { fr: KEYWORDS_FR.summarize, es: KEYWORDS_ES.summarize }, respond: respondStatic('summarize') },
  { id: 'giveExample', keywords: { fr: KEYWORDS_FR.giveExample, es: KEYWORDS_ES.giveExample }, respond: respondStatic('giveExample') },
  { id: 'stepByStep', keywords: { fr: KEYWORDS_FR.stepByStep, es: KEYWORDS_ES.stepByStep }, respond: respondStatic('stepByStep') },
  { id: 'simplify', keywords: { fr: KEYWORDS_FR.simplify, es: KEYWORDS_ES.simplify }, respond: respondStatic('simplify') },
  { id: 'deepen', keywords: { fr: KEYWORDS_FR.deepen, es: KEYWORDS_ES.deepen }, respond: respondStatic('deepen') },
  { id: 'hint', keywords: { fr: KEYWORDS_FR.hint, es: KEYWORDS_ES.hint }, respond: respondStatic('hint') },
  { id: 'whatNext', keywords: { fr: KEYWORDS_FR.whatNext, es: KEYWORDS_ES.whatNext }, respond: respondStatic('whatNext') },
  { id: 'verifyResult', keywords: { fr: KEYWORDS_FR.verifyResult, es: KEYWORDS_ES.verifyResult }, respond: respondVerifyFusion },
  { id: 'trivia', keywords: { fr: KEYWORDS_FR.trivia, es: KEYWORDS_ES.trivia }, respond: respondStatic('trivia') },
  { id: 'joke', keywords: { fr: KEYWORDS_FR.joke, es: KEYWORDS_ES.joke }, respond: respondStatic('joke') },
];

export const FALLBACK_TEXT = TEXTS.fallback;
