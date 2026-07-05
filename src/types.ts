export interface PlatformScores {
  performance: number;
  ux: number;
  seo: number;
  security: number;
  professionalUtility: number;
}

export interface Platform {
  id: string;
  name: string;
  url: string;
  role: string;
  tagline: string;
  scores: PlatformScores;
  pros: string[];
  cons: string[];
  techStack: string[];
}

export interface ComparisonPreset {
  sante50: Platform;
  santePlusPro: Platform;
}

export interface MetricDetail {
  key: keyof PlatformScores;
  name: string;
  description: string;
  sante50Description: string;
  santePlusProDescription: string;
}
