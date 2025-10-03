import { MainView } from '@/components/cosmic-explorer/main-view';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import type { SpaceObject } from '@/lib/types';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

function getFallbackData(): SpaceObject[] {
  const imageMap = new Map<string, ImagePlaceholder>(PlaceHolderImages.map((img) => [img.id, img]));
  
  const fallbackObjects: SpaceObject[] = [
    {
      id: 'fallback-1',
      name: '(433) Eros',
      type: 'Asteroid',
      diameter_km: 16.84,
      is_potentially_hazardous: false,
      close_approach_date: '2024-Jul-28 10:00',
      relative_velocity_kps: '5.46',
      miss_distance_au: '0.149',
      orbit: { semi_major_axis_au: 1.458, eccentricity: 0.222, inclination_deg: 10.829, orbital_period_days: 643.2 },
      image_id: 'asteroid-1',
      imageUrl: imageMap.get('asteroid-1')!.imageUrl,
      imageHint: imageMap.get('asteroid-1')!.imageHint,
      description: imageMap.get('asteroid-1')!.description,
    },
    {
      id: 'fallback-2',
      name: '1P/Halley',
      type: 'Comet',
      diameter_km: 11,
      is_potentially_hazardous: false,
      close_approach_date: '1986-Feb-09 20:00',
      relative_velocity_kps: '70.56',
      miss_distance_au: '0.417',
      orbit: { semi_major_axis_au: 17.834, eccentricity: 0.967, inclination_deg: 162.26, orbital_period_days: 27793 },
      image_id: 'comet-1',
      imageUrl: imageMap.get('comet-1')!.imageUrl,
      imageHint: imageMap.get('comet-1')!.imageHint,
      description: imageMap.get('comet-1')!.description,
    },
    {
      id: 'fallback-3',
      name: '(101955) Bennu',
      type: 'Asteroid',
      diameter_km: 0.49,
      is_potentially_hazardous: true,
      close_approach_date: '2182-Sep-24 12:00',
      relative_velocity_kps: '0.27',
      miss_distance_au: '0.005',
      orbit: { semi_major_axis_au: 1.126, eccentricity: 0.203, inclination_deg: 6.034, orbital_period_days: 436.6 },
      image_id: 'asteroid-2',
      imageUrl: imageMap.get('asteroid-2')!.imageUrl,
      imageHint: imageMap.get('asteroid-2')!.imageHint,
      description: imageMap.get('asteroid-2')!.description,
    }
  ];
  return [...fallbackObjects, ...fallbackObjects.map(o => ({...o, id: `${o.id}-2`})), ...fallbackObjects.map(o => ({...o, id: `${o.id}-3`}))];
}


async function getNeoData(): Promise<SpaceObject[]> {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const today = new Date();
  const startDate = format(subDays(startOfDay(today), 7), 'yyyy-MM-dd');
  const endDate = format(endOfDay(today), 'yyyy-MM-dd');
  
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`Error fetching from NASA API: ${res.status} ${res.statusText}. Falling back to sample data.`);
      return getFallbackData();
    }
    const data = await res.json();
    const imageMap = new Map<string, ImagePlaceholder>(PlaceHolderImages.map((img) => [img.id, img]));
    const fallbackData = getFallbackData();
    const fallbackOrbit = fallbackData[0].orbit;

    const spaceObjects: SpaceObject[] = [];
    if (data.near_earth_objects) {
      Object.keys(data.near_earth_objects).forEach(date => {
        data.near_earth_objects[date].forEach((neo: any) => {
          const approachData = neo.close_approach_data[0];
          const diameter = neo.estimated_diameter.kilometers;
          
          const isComet = neo.is_sentry_object || (neo.name && (neo.name.includes('P/') || neo.name.includes('C/')));
          let type: SpaceObject['type'] = isComet ? 'Comet' : 'Asteroid';

          // For this example, let's diversify the types a bit for UI purposes
          if (neo.id % 5 === 0) type = 'Meteoroid';
          else if (neo.id % 10 === 0) type = 'Dwarf Planet';
          
          let randomImageId: string;
          if (type === 'Comet') {
            randomImageId = `comet-${Math.ceil(Math.random() * 2)}`;
          } else if (type === 'Dwarf Planet') {
            randomImageId = 'dwarf-planet-1';
          } else if (type === 'Meteoroid') {
            randomImageId = 'meteoroid-1';
          } else {
            randomImageId = `asteroid-${Math.ceil(Math.random() * 2)}`;
          }
          const imageData = imageMap.get(randomImageId) ?? imageMap.get('asteroid-1')!;

          const orbitData = neo.orbital_data ? {
            semi_major_axis_au: parseFloat(neo.orbital_data.semi_major_axis),
            eccentricity: parseFloat(neo.orbital_data.eccentricity),
            inclination_deg: parseFloat(neo.orbital_data.inclination),
            orbital_period_days: parseFloat(neo.orbital_data.orbital_period),
          } : fallbackOrbit;


          spaceObjects.push({
            id: neo.id,
            name: neo.name,
            type: type,
            diameter_km: parseFloat(((diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2).toFixed(3)),
            is_potentially_hazardous: neo.is_potentially_hazardous_asteroid,
            close_approach_date: approachData.close_approach_date_full,
            relative_velocity_kps: parseFloat(approachData.relative_velocity.kilometers_per_second).toFixed(2),
            miss_distance_au: parseFloat(approachData.miss_distance.astronomical).toFixed(4),
            orbit: orbitData,
            image_id: randomImageId,
            imageUrl: imageData.imageUrl,
            imageHint: imageData.imageHint,
            description: imageData.description,
          });
        });
      });
    }

    if (spaceObjects.length === 0) {
      console.warn('NASA API returned no objects. Falling back to sample data.');
      return getFallbackData();
    }
    
    return spaceObjects;
  } catch (error) {
    console.error('Failed to fetch and process NEO data. Falling back to sample data:', error);
    return getFallbackData();
  }
}

// This is a server component, so we can do data fetching here.
export default async function ExplorerPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const objectsWithImages = await getNeoData();
  const focusedObjectId = searchParams?.focus;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <MainView 
        initialObjects={objectsWithImages} 
        focusedObjectId={typeof focusedObjectId === 'string' ? focusedObjectId : undefined} 
      />
    </div>
  );
}
