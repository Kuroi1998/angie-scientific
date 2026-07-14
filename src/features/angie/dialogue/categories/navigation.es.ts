import type { DialogueBank } from '../dialogue.types';

export const navigationEs: DialogueBank = {
  home: [
    { id: 'navigation.home.1', text: 'Este es tu panel principal. Siempre te propondre una siguiente actividad util.', emotion: 'encouraging' },
    { id: 'navigation.home.2', text: 'Desde aqui puedes entrar a cada modulo. Mira tu progreso a la derecha.', emotion: 'attentive' },
    { id: 'navigation.home.3', text: 'De vuelta al inicio. Quieres retomar algun experimento en curso?', emotion: 'curious' },
  ],
  table: [
    { id: 'navigation.table.1', text: 'Esta es la tabla periodica. Haz clic en un elemento para descubrir sus secretos.', emotion: 'happy' },
    { id: 'navigation.table.2', text: 'Puedes buscar un elemento por nombre o simbolo en la parte superior.', emotion: 'attentive' },
    { id: 'navigation.table.3', text: 'Cada casilla esconde una historia. Cual quieres explorar hoy?', emotion: 'curious' },
  ],
  fusion: [
    { id: 'navigation.fusion.1', text: 'Aqui puedes combinar dos elementos. Intenta juntar Hidrogeno (H) y Oxigeno (O).', emotion: 'curious' },
    { id: 'navigation.fusion.2', text: 'El simulador de fusion calcula la reaccion de verdad, no invento nada.', emotion: 'explaining' },
    { id: 'navigation.fusion.3', text: 'Elige dos reactivos y observa que sucede.', emotion: 'attentive' },
  ],
  quantum: [
    { id: 'navigation.quantum.1', text: 'La fisica cuantica es compleja pero fascinante. Observa la forma de los orbitales.', emotion: 'thinking' },
    { id: 'navigation.quantum.2', text: 'Ajusta n, l y m para ver el orbital cambiar de forma en tiempo real.', emotion: 'explaining' },
    { id: 'navigation.quantum.3', text: 'Tomate tu tiempo aqui, los numeros cuanticos requieren practica.', emotion: 'encouraging' },
  ],
  physchem: [
    { id: 'navigation.physchem.1', text: 'El diagrama de fase muestra los estados de la materia segun temperatura y presion.', emotion: 'explaining' },
    { id: 'navigation.physchem.2', text: 'Cambia los parametros y observa como reacciona la curva.', emotion: 'curious' },
    { id: 'navigation.physchem.3', text: 'El laboratorio de fisica-quimica es ideal para probar hipotesis.', emotion: 'attentive' },
  ],
  virtuallab: [
    { id: 'navigation.virtuallab.1', text: 'Es tu propio laboratorio virtual. Llena los matraces y observa las reacciones.', emotion: 'encouraging' },
    { id: 'navigation.virtuallab.2', text: 'Cada experimento aqui sigue un protocolo real, paso a paso.', emotion: 'explaining' },
    { id: 'navigation.virtuallab.3', text: 'Listo para experimentar sin ningun riesgo?', emotion: 'happy' },
  ],
  quests: [
    { id: 'navigation.quests.1', text: 'Completa misiones para desbloquear nuevas insignias cientificas.', emotion: 'encouraging' },
    { id: 'navigation.quests.2', text: 'Cada mision te hace avanzar un poco mas. Cual intentas?', emotion: 'curious' },
  ],
  quiz: [
    { id: 'navigation.quiz.1', text: 'Pon a prueba tus conocimientos con un quiz, entrenamiento o adivinanza.', emotion: 'attentive' },
    { id: 'navigation.quiz.2', text: 'Elige entrenamiento para aprender sin presion, o examen para desafiarte.', emotion: 'explaining' },
  ],
  profile: [
    { id: 'navigation.profile.1', text: 'Este es tu perfil: progreso, insignias y preferencias.', emotion: 'attentive' },
    { id: 'navigation.profile.2', text: 'Aqui puedes ajustar mis opciones, como la frecuencia de mis mensajes.', emotion: 'neutral' },
  ],
};
