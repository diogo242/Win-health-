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

export type UserType = "patient" | "doctor";

export interface PatientProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bloodGroup: string;
  birthDate: string;
}

export interface DoctorProfile {
  fullName: string;
  specialty: string;
  email: string;
  rpps: string;
}

export interface Clinic {
  id: string;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  rating: number;
  cost: number;
  coordinates: { lat: number; lng: number };
  hours: string;
  matchScore?: number;
}

