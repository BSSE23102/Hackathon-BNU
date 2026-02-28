// ─── Content ─────────────────────────────────────────────
export type ContentStage = 'arriving' | 'queued' | 'analyzing' | 'deciding' | 'reviewing' | 'acted';

export interface ContentItem {
  id: string;
  text: string;
  languageGuess: string;
  languageConfidence: number;
  stage: ContentStage;
  initialRisk: number;
  timestamp: number;
  decayFactor: number;
}

// ─── Risk ────────────────────────────────────────────────
export interface RiskSnapshot {
  contentId: string;
  score: number;
  model: string;
  decayFactor: number;
  triggerFrequency: number;
  timestamp: number;
}

export interface RiskDecay {
  contentId: string;
  currentScore: number;
  originalScore: number;
  decayRate: number;
  halfLife: number;
  elapsed: number;
}

// ─── Decision ────────────────────────────────────────────
export interface DecisionRecommendation {
  contentId: string;
  autoActionScore: number;
  escalationScore: number;
  deferScore: number;
  trustImpact: number;
  confidence: number;
  reasoning: string[];
}

export interface TrustPrediction {
  contentId: string;
  currentTrust: number;
  predictedTrust: number;
  volatility: number;
}

// ─── Human Review ────────────────────────────────────────
export interface HumanCapacity {
  totalSlots: number;
  usedSlots: number;
  availableSlots: number;
  avgReviewTime: number;
  nextSlotAvailable: number;
}

export interface ReviewPriority {
  contentId: string;
  priorityScore: number;
  expectedValue: number;
  queuePosition: number;
  ambiguityLevel: number;
}

// ─── Multilingual ────────────────────────────────────────
export interface ContextAnalysis {
  contentId: string;
  contextDependencyScore: number;
  translationRisk: number;
  ambiguityLevel: number;
  detectedLanguage: string;
  dialectHint: string;
  culturalSensitivity: number;
}

// ─── Feedback ────────────────────────────────────────────
export interface FeedbackConfidence {
  contentId: string;
  labelConfidence: number;
  reviewerDisagreement: number;
  biasSignals: BiasSignal[];
  loopHealth: number;
}

export interface BiasSignal {
  type: string;
  severity: number;
  description: string;
}

export interface FeedbackConflict {
  contentId: string;
  conflictRate: number;
  conflictingLabels: string[];
  resolution: string;
}

// ─── Cost ────────────────────────────────────────────────
export interface CostCurrent {
  monthlySpend: number;
  budget: number;
  burnRate: number;
  costPerAction: number;
  modelUsageCost: number;
  reviewCost: number;
}

export interface CostProjection {
  projectedMonthly: number;
  daysRemaining: number;
  willExceedBudget: boolean;
  projectedOverage: number;
  suggestedActions: string[];
}

// ─── Adaptation ──────────────────────────────────────────
export interface AdaptationUsage {
  techniques: TechniqueUsage[];
  diversityScore: number;
}

export interface TechniqueUsage {
  name: string;
  usageCount: number;
  lastUsed: number;
  effectiveness: number;
}

export interface AdaptationRisk {
  predictabilityScore: number;
  detectionRisk: number;
  rotationUrgency: number;
}

export interface RotationSuggestion {
  currentTechnique: string;
  suggestedTechnique: string;
  reason: string;
  expectedImprovement: number;
}

// ─── Failure ─────────────────────────────────────────────
export interface FailureSignal {
  type: 'signal-collapse' | 'human-overload' | 'budget-exhaustion';
  severity: number;
  active: boolean;
  message: string;
  since: number;
}

// ─── Socket Events ───────────────────────────────────────
export type SocketNamespace = '/ws/content' | '/ws/risk' | '/ws/decision' | '/ws/human' | '/ws/cost';

export interface SocketEvent<T = unknown> {
  event: string;
  data: T;
  timestamp: number;
}

// ─── Store Metadata ──────────────────────────────────────
export interface StageMetadata {
  lastUpdated: number;
  confidence: number;
  decayApplied: boolean;
  stale: boolean;
}
