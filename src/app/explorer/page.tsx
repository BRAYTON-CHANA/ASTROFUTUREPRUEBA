"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MainView } from '@/components/cosmic-explorer/main-view';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import type { SpaceObject } from '@/lib/types';
import { format, parseISO, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from '@/components/ui/skeleton';

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

export default function ExplorerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const focusedObjectId = searchParams.get('focus');
  const dateParam = searchParams.get('date');

  const [selectedDate, setSelectedDate] = useState<Date>(dateParam ? parseISO(dateParam) : startOfDay(new Date()));
  const [spaceObjects, setSpaceObjects] = useState<SpaceObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(startOfDay(date));
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('date', format(date, 'yyyy-MM-dd'));
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const getNeoData = useCallback(async (date: Date): Promise<SpaceObject[]> => {
    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formattedDate}&end_date=${formattedDate}&detailed=true&api_key=${apiKey}`;

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

      const newSpaceObjects: SpaceObject[] = [];
      if (data.near_earth_objects && data.near_earth_objects[formattedDate]) {
        data.near_earth_objects[formattedDate].forEach((neo: any) => {
          const approachData = neo.close_approach_data[0];
          const diameter = neo.estimated_diameter.kilometers;
          
          const isComet = neo.is_sentry_object || (neo.name && (neo.name.includes('P/') || neo.name.includes('C/')));
          let type: SpaceObject['type'] = isComet ? 'Comet' : 'Asteroid';

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

          newSpaceObjects.push({
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
      }

      if (newSpaceObjects.length === 0) {
        console.warn('NASA API returned no objects for this date. Falling back to sample data.');
        return getFallbackData();
      }
      
      return newSpaceObjects;
    } catch (error) {
      console.error('Failed to fetch and process NEO data. Falling back to sample data:', error);
      return getFallbackData();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getNeoData(selectedDate);
      setSpaceObjects(data);
      setIsLoading(false);
    };
    fetchData();
  }, [selectedDate, getNeoData]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-xl font-bold">Cosmic Explorer</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </header>
      {isLoading ? (
        <div className="p-4">
          <Skeleton className="w-full h-24 mb-4" />
          <Skeleton className="w-full h-96" />
        </div>
      ) : (
        <MainView 
          initialObjects={spaceObjects} 
          focusedObjectId={typeof focusedObjectId === 'string' ? focusedObjectId : undefined} 
        />
      )}
    </div>
  );
}