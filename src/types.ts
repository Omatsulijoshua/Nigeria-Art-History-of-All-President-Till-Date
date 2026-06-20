export type EraId = 'colonial' | 'independence' | 'military' | 'democratic';

export interface Era {
  id: EraId;
  name: string;
  startYear: number;
  endYear: number;
  description: string;
  color: string; // UI highlight color
  ambientColor: string; // Ambient scene lighting
  spotlightColor: string; // Key light color
  materials: {
    wallRoughness: number;
    floorRoughness: number;
    floorMetalness: number;
  };
}

export interface Achievement {
  year: number;
  title: string;
  description: string;
}

export interface Leader {
  id: string;
  name: string;
  wikipediaTitle: string;
  era: EraId;
  role: string;
  startYear: number;
  endYear: number;
  birthYear?: number;
  deathYear?: number;
  achievements: Achievement[];
  x: number; // timeline X-coordinate coordinate
}

export type CameraMode = 'timeline' | 'transition' | 'museum';

export type GraphicsQuality = 'low' | 'medium' | 'high';

export interface AppSettings {
  graphicsQuality: GraphicsQuality;
  musicEnabled: boolean;
  soundEnabled: boolean;
}

export interface LeaderWikiData {
  id: string;
  name: string;
  wikipediaTitle: string;
  summary: string;
  portraitUrl: string;
  role: string;
  lifespan: string;
  wikiUrl: string;
}
