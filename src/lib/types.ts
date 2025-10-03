import type { ImagePlaceholder } from './placeholder-images';

export type SpaceObject = {
  id: string;
  name: string;
  type: 'Asteroid' | 'Comet' | 'Dwarf Planet' | 'Meteoroid';
  diameter_km: number;
  is_potentially_hazardous: boolean;
  close_approach_date: string;
  relative_velocity_kps: string;
  miss_distance_au: string;
  orbit: {
    semi_major_axis_au: number;
    eccentricity: number;
    inclination_deg: number;
    orbital_period_days: number;
  };
  image_id: string;
  // Properties from ImagePlaceholder
  imageUrl: string;
  imageHint: string;
  description: string;
};
