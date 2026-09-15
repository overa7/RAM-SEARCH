export type IntentFamily = 
  | 'Informacional / Know'
  | 'Navegacional / Website'
  | 'Investigación comercial / Commercial Investigation'
  | 'Transaccional / Do'
  | 'Local / Visit-in-Person'
  | 'Post-compra / Soporte'
  | 'Multi-intent / Ambigua';

export type OperationalCluster = 
  | 'LEARN'
  | 'EXPLORE'
  | 'COMPARE'
  | 'VALIDATE'
  | 'BUY'
  | 'VISIT'
  | 'RETURN';

export type DecisionStage = 
  | 'Learn'
  | 'Explore'
  | 'Compare'
  | 'Validate'
  | 'Select'
  | 'Act'
  | 'Post-purchase';

export interface SearchTrend {
  date: string;
  value: number;
  brand?: string;
}

export interface KeywordInsight {
  keyword: string;
  volume: string;
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational' | 'Local' | string;
  growth: number;
  brand?: string;
}

export interface DescriptiveIntentQuery {
  query: string;
  scope: 'Categoría' | 'Marca';
  brand?: string;
  primaryFamily: IntentFamily;
  googleIntent: 'Know' | 'Know Simple' | 'Do' | 'Website' | 'Visit-in-Person' | 'Know/Do mix';
  subintent: string; // ej: "Mejores / Best", "Pricing research", "Store locator", "Comprar", "Definición", "Troubleshooting"
  operationalCluster: OperationalCluster;
  decisionStage: DecisionStage;
  monthlyVolume: string;
  monthlyVolumeNumeric: number;
  intentValueScore: number; // 0 - 100
  conversionPotential: 'Muy Alto' | 'Alto' | 'Medio' | 'Bajo' | 'Muy Bajo';
  cpcBenchmarkUSD: number;
  preferredModality: string;
}

export interface BrandComparison {
  brand: string;
  shareOfSearch: number;
  monthlySearchVolumeNumeric?: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topIntent: string;
  searchVolume: string;
  intentBreakdown: {
    intent: string;
    percentage: number;
  }[];
  // Diagnóstico e interpretación individual para la marca en su mercado
  intentDiagnostic?: string;
  topConvertingQuery?: string;
  competitiveDifferentiator?: string;
  // Consultas principales de la marca decodificadas con la taxonomía completa
  topBrandQueries?: DescriptiveIntentQuery[];
}

export interface SEMCampaignStructure {
  campaignName: string;
  intentTier: 'Transactional' | 'Commercial' | 'Brand Defense' | 'Competitor Conquesting';
  biddingStrategy: string;
  recommendedBudgetPct: number;
  targetKeywords: {
    keyword: string;
    matchType: 'Exact [ ]' | 'Phrase " "' | 'Broad';
    cpcEstimateUSD: number;
    intentRationale: string;
  }[];
  adCopyBlueprint: {
    headlines: string[];
    descriptions: string[];
    callToAction: string;
    recommendedExtensions: string[];
  };
}

export interface DemandAllocationItem {
  intent: string;
  cluster: OperationalCluster;
  demandPct: number;
  budgetSuggestedPct: number;
  relativeValue: 'Bajo' | 'Medio' | 'Alto' | 'Muy Alto' | 'Variable';
  biddingControl: string;
  roleSEM: string;
}

export interface ZeroWasteCalculation {
  query: string;
  cpcUSD: number;
  conversionProbabilityPct: number;
  expectedConversionValueUSD: number;
  expectedValueUSD: number;
  isWaste: boolean;
  wasteAmountUSD: number;
  analysis: string;
}

export interface DownstreamLeadGenLevel {
  event: string;
  trainingValueUSD: number;
  ratioConversion: string;
  description: string;
}

export interface IntentContinuityItem {
  intent: string;
  queryExample: string;
  mentalQuestion: string;
  adPromise: string;
  idealLanding: string;
  primaryCTA: string;
}

export interface SEMStrategyReport {
  monthlyBudgetBenchmarkUSD: number;
  blendedCpcUSD: number;
  budgetSplit: {
    brandDefensePct: number;
    transactionalPct: number;
    competitorConquestPct: number;
    commercialPct: number;
  };
  marketDynamics: string;
  campaigns: SEMCampaignStructure[];
  conquestingMatrix: {
    targetCompetitor: string;
    interceptionAngle: string;
    adHeadlineAngle: string;
    riskLevel: 'Low (Fair Use)' | 'Medium (Comparison)' | 'High (Trademark Strict)';
  }[];
  negativeKeywords: {
    category: string;
    terms: string[];
  }[];
  qualityScoreOptimizations: string[];
  // Extensiones del SEM Intent Framework (Septiembre 2026)
  demandMap?: DemandAllocationItem[];
  zeroWasteExercise?: ZeroWasteCalculation;
  downstreamLevels?: DownstreamLeadGenLevel[];
  intentContinuity?: IntentContinuityItem[];
}

export interface ResearchReport {
  topic: string;
  location: string;
  summary: string;
  categoryTotalSearchVolume?: string;
  categoryTotalSearchVolumeNumeric?: number;
  brands: BrandComparison[];
  // Consultas de mayor volumen de la categoría decodificadas con la taxonomía completa
  categoryTopQueries?: DescriptiveIntentQuery[];
  trends: {
    date: string;
    values: {
      brand: string;
      value: number;
    }[];
  }[];
  insights: KeywordInsight[];
  recommendations: string[];
  semStrategy?: SEMStrategyReport;
}
