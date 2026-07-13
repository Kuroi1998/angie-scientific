export const RAW_FACTS: Record<number, { fr: string, es: string, category: any }> = {
  1: { fr: "L'hydrogène est le carburant des étoiles !", es: "¡El hidrógeno es el combustible de las estrellas!", category: 'surprising' },
  2: { fr: "L'hélium te donne une voix aiguë si tu le respires (mais ne le fais pas !).", es: "El helio te da una voz aguda si lo respiras.", category: 'surprising' },
  3: { fr: "Le lithium est le métal le plus léger, utilisé dans les batteries.", es: "El litio es el metal más ligero, usado en baterías.", category: 'daily_use' },
  4: { fr: "Le béryllium est transparent aux rayons X !", es: "¡El berilio es transparente a los rayos X!", category: 'element' },
  5: { fr: "Le bore aide à fabriquer du verre très résistant (Pyrex).", es: "El boro ayuda a hacer vidrio muy resistente (Pyrex).", category: 'daily_use' },
  6: { fr: "Le carbone est la base de toute forme de vie sur Terre.", es: "El carbono es la base de toda forma de vida en la Tierra.", category: 'discovery' },
  7: { fr: "L'azote compose 78% de l'air que nous respirons.", es: "El nitrógeno compone el 78% del aire que respiramos.", category: 'element' },
  8: { fr: "L'oxygène est vital, mais il rend aussi le sang rouge !", es: "El oxígeno es vital, ¡pero también hace que la sangre sea roja!", category: 'element' },
  9: { fr: "Le fluor est utilisé dans le dentifrice pour protéger tes dents.", es: "El flúor se usa en la pasta de dientes para proteger tus dientes.", category: 'daily_use' },
  10: { fr: "Le néon brille en rouge-orange dans les enseignes lumineuses.", es: "El neón brilla en rojo anaranjado en los letreros luminosos.", category: 'surprising' },
  11: { fr: "Le sodium explose au contact de l'eau !", es: "¡El sodio explota al contacto con el agua!", category: 'reaction' },
  12: { fr: "Le magnésium brûle avec une lumière blanche aveuglante.", es: "El magnesio arde con una luz blanca cegadora.", category: 'reaction' },
  13: { fr: "L'aluminium est le métal le plus abondant dans la croûte terrestre.", es: "El aluminio es el metal más abundante en la corteza terrestre.", category: 'element' },
  14: { fr: "Le silicium est le cœur de tous les ordinateurs et téléphones.", es: "El silicio es el corazón de todas las computadoras y teléfonos.", category: 'daily_use' },
  15: { fr: "Le phosphore brille dans le noir !", es: "¡El fósforo brilla en la oscuridad!", category: 'surprising' },
  16: { fr: "Le soufre a une odeur d'œuf pourri.", es: "El azufre huele a huevo podrido.", category: 'element' },
  17: { fr: "Le chlore nettoie l'eau des piscines.", es: "El cloro limpia el agua de las piscinas.", category: 'daily_use' },
  18: { fr: "L'argon est utilisé dans les ampoules pour empêcher le filament de brûler.", es: "El argón se usa en bombillas para evitar que el filamento se queme.", category: 'daily_use' },
  19: { fr: "Le potassium se trouve en grande quantité dans les bananes.", es: "El potasio se encuentra en grandes cantidades en los plátanos.", category: 'daily_use' },
  20: { fr: "Le calcium rend tes os et tes dents solides !", es: "¡El calcio hace que tus huesos y dientes sean fuertes!", category: 'daily_use' },
  26: { fr: "Le fer est ce qui donne sa couleur rouge à la planète Mars.", es: "El hierro es lo que le da su color rojo al planeta Marte.", category: 'surprising' },
  29: { fr: "Le cuivre est antimicrobien : il tue les bactéries à sa surface.", es: "El cobre es antimicrobiano: mata las bacterias en su superficie.", category: 'safety' },
  47: { fr: "L'argent est le meilleur conducteur d'électricité de tous les éléments.", es: "La plata es el mejor conductor de electricidad de todos los elementos.", category: 'element' },
  79: { fr: "L'or est si malléable qu'un gramme peut faire un fil de 3 km !", es: "¡El oro es tan maleable que un gramo puede hacer un hilo de 3 km!", category: 'surprising' },
  80: { fr: "Le mercure est le seul métal liquide à température ambiante.", es: "El mercurio es el único metal líquido a temperatura ambiente.", category: 'surprising' },
  92: { fr: "L'uranium est utilisé pour produire de l'énergie nucléaire.", es: "El uranio se utiliza para producir energía nuclear.", category: 'reaction' }
};

export const getFallbackFact = (atomicNumber: number, language: string) => {
  if (language === 'es') return `El elemento ${atomicNumber} tiene propiedades químicas únicas fascinantes.`;
  return `L'élément ${atomicNumber} possède des propriétés chimiques uniques et fascinantes.`;
};
