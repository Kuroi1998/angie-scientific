import { useEffect } from 'react';
import { useMascot } from '../components/Mascot/MascotContext';
import { useLocalStorageState } from './useLocalStorageState';
import { useLanguage } from './useLanguage';
import { useUserProgress } from '../components/UserProgressProvider';

type Emotion = 'neutral' | 'happy' | 'impressed' | 'thinking' | 'encouraging' | 'surprised' | 'worried';

export const useTutorial = (activeTab: string) => {
  const { showMessage } = useMascot();
  const { language } = useLanguage();
  const { profile } = useUserProgress();
  const [seenTutorials, setSeenTutorials] = useLocalStorageState<Record<string, boolean>>('seenTutorials', {}, {
    validate: (val: unknown): val is Record<string, boolean> => typeof val === 'object' && val !== null
  });

  useEffect(() => {
    // Only show tutorials if mascot is enabled and in discovery mode (optional logic, but let's just use seenTutorials)
    if (profile?.mascotEnabled === false) return;

    if (!seenTutorials[activeTab]) {
      const msgs: Record<string, {fr: string, es: string, emotion: Emotion}> = {
        table: { 
          fr: "Bienvenue dans le Tableau Périodique ! Clique sur un élément pour découvrir ses secrets.", 
          es: "¡Bienvenido a la Tabla Periódica! Haz clic en un elemento para descubrir sus secretos.",
          emotion: 'happy'
        },
        fusion: { 
          fr: "Ici, tu peux combiner deux éléments. Essaie d'associer l'Hydrogène (H) et l'Oxygène (O) !", 
          es: "Aquí puedes combinar dos elementos. ¡Intenta asociar Hidrógeno (H) y Oxígeno (O)!",
          emotion: 'impressed'
        },
        quantum: { 
          fr: "La physique quantique est complexe mais fascinante. Observe la forme des orbitales !", 
          es: "La física cuántica es compleja pero fascinante. ¡Observa la forma de los orbitales!",
          emotion: 'thinking'
        },
        physchem: {
          fr: "Le diagramme de phase montre les états de la matière selon la température et la pression.",
          es: "El diagrama de fase muestra los estados de la materia según la temperatura y la presión.",
          emotion: 'encouraging'
        },
        virtuallab: { 
          fr: "C'est ton propre laboratoire virtuel. Remplis les fioles et observe les réactions de précipitation !", 
          es: "Es tu propio laboratorio virtual. ¡Llena los matraces y observa las reacciones de precipitación!",
          emotion: 'encouraging'
        },
        quests: {
          fr: "Complète des quêtes pour débloquer de nouveaux badges scientifiques !",
          es: "¡Completa misiones para desbloquear nuevas insignias científicas!",
          emotion: 'happy'
        }
      };

      const msg = msgs[activeTab];
      if (msg) {
        const timer = setTimeout(() => {
          showMessage(language === 'fr' ? msg.fr : msg.es, 7000, msg.emotion);
          setSeenTutorials({ ...seenTutorials, [activeTab]: true });
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [activeTab, language, seenTutorials, setSeenTutorials, showMessage, profile?.mascotEnabled]);
};
