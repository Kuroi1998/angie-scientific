import type { ScientificFact } from '../../types/core';
import { RAW_FACTS, getFallbackFact } from '../../data/educational/facts';

export class ElementFactRepository {
  public static getFactForElement(atomicNumber: number, language: string = 'fr'): ScientificFact {
    const raw = RAW_FACTS[atomicNumber];
    const text = raw ? (language === 'es' ? raw.es : raw.fr) : getFallbackFact(atomicNumber, language);
    
    return {
      id: `fact_${atomicNumber}`,
      atomicNumber,
      elementSymbol: '', // Could be filled if needed
      title: `Fact ${atomicNumber}`,
      childFriendlyText: text,
      sourceName: 'Angie Database',
      sourceUrl: '#',
      verifiedAt: new Date().toISOString(),
      category: raw ? raw.category : 'element'
    };
  }
  
  public static getAllFacts(): ScientificFact[] {
    return Object.keys(RAW_FACTS).map(k => this.getFactForElement(Number(k)));
  }
}
