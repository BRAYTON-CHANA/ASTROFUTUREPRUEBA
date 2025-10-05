'use client';

import { useEffect, useState, Suspense, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { SolarSystemPlot } from '@/components/historical-components/solar-system-plot';
import { NEOObject, CloseApproachData } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from "@/lib/utils";
import { ApproachFilterMenu, SortConfig, SortKey } from '@/components/historical-components/approach-filter-menu';

const planetNameMap: { [key: string]: string } = {
  'Merc': 'Mercury',
  'Ven': 'Venus',
  'Ear': 'Earth',
  'Mar': 'Mars',
  'Jup': 'Jupiter',
  'Sat': 'Saturn',
  'Ura': 'Uranus',
  'Nep': 'Neptune'
};

const normalizePlanetName = (name: string): string => planetNameMap[name] || name;

function ApproachList({ 
  approaches, 
  selectedEpoch, 
  onSelect, 
  neoName,
  minYear,
  maxYear,
  onYearChange,
  yearRange,
  availablePlanets,
  selectedPlanets,
  onPlanetChange,
  onSortChange,
  sortConfig
}: {
  approaches: CloseApproachData[];
  selectedEpoch: number | null;
  onSelect: (epoch: number) => void;
  neoName: string;
  minYear: number;
  maxYear: number;
  onYearChange: (years: [number, number]) => void;
  yearRange: [number, number];
  availablePlanets: string[];
  selectedPlanets: string[];
  onPlanetChange: (planets: string[]) => void;
  onSortChange: (key: SortKey) => void;
  sortConfig: SortConfig;
}) {
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const map = itemRefs.current;
    if (selectedEpoch && map.has(selectedEpoch)) {
      const selectedRef = map.get(selectedEpoch);
      selectedRef?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedEpoch]);

  return (
    <div className="h-full w-full md:w-1/3 lg:w-1/4 bg-card border-l flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Historial de Acercamientos</h2>
        <p className="text-sm text-muted-foreground">Para el asteroide: {neoName}</p>
      </div>
      
      <ApproachFilterMenu
        minYear={minYear}
        maxYear={maxYear}
        onYearChange={onYearChange}
        initialRange={yearRange}
        planets={availablePlanets}
        selectedPlanets={selectedPlanets}
        onPlanetChange={onPlanetChange}
        onSortChange={onSortChange}
        sortConfig={sortConfig}
        className="border-b"
      />

      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col">
            {approaches.map((approach) => {
              const isSelected = selectedEpoch === approach.epoch_date_close_approach;
              return (
                <button 
                  key={approach.epoch_date_close_approach} 
                  ref={(node) => {
                    const map = itemRefs.current;
                    if (node) {
                      map.set(approach.epoch_date_close_approach, node);
                    } else {
                      map.delete(approach.epoch_date_close_approach);
                    }
                  }}
                  onClick={() => onSelect(approach.epoch_date_close_approach)}
                  className={cn("text-left p-4 border-b transition-colors", {
                    'bg-primary text-primary-foreground': isSelected,
                    'hover:bg-muted/50': !isSelected
                  })}
                >
                  <p className="font-semibold">{approach.close_approach_date_full}</p>
                  <p className={cn("text-sm", {
                    'text-primary-foreground/80': isSelected,
                    'text-muted-foreground': !isSelected
                  })}>
                    Orbitando: <strong>{approach.orbiting_body}</strong>
                  </p>
                  <p className={cn("text-xs", {
                      'text-primary-foreground/80': isSelected,
                      'text-muted-foreground': !isSelected
                  })}>
                    Distancia: <strong>{parseFloat(approach.miss_distance.lunar).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})} LD</strong> / <strong>{parseFloat(approach.miss_distance.kilometers).toLocaleString('es-ES')} km</strong>
                  </p>
                </button>
              );
            })}
             {approaches.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                No hay acercamientos con los filtros seleccionados.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function HistoricalView() {
  const searchParams = useSearchParams();
  const rawUrl = searchParams.get('url');

  const [neoData, setNeoData] = useState<NEOObject | null>(null);
  const [allApproaches, setAllApproaches] = useState<CloseApproachData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApproachEpoch, setSelectedApproachEpoch] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const lastFrameTime = useRef(0);
  const frameInterval = 1000 / 30; // 30 FPS

  const [yearRange, setYearRange] = useState<[number, number]>([0,0]);
  const [selectedPlanets, setSelectedPlanets] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });

  const { minYear, maxYear, availablePlanets } = useMemo(() => {
    if (allApproaches.length === 0) return { minYear: 0, maxYear: 0, availablePlanets: [] };
    const years = allApproaches.map(app => new Date(app.close_approach_date_full).getFullYear());
    const planets = [...new Set(allApproaches.map(app => app.orbiting_body))];
    return { 
      minYear: Math.min(...years), 
      maxYear: Math.max(...years),
      availablePlanets: planets
    };
  }, [allApproaches]);

  const filteredApproaches = useMemo(() => {
    const [min, max] = yearRange;
    return allApproaches.filter(app => {
      const year = new Date(app.close_approach_date_full).getFullYear();
      const planet = app.orbiting_body;
      return year >= min && year <= max && selectedPlanets.includes(planet);
    });
  }, [yearRange, allApproaches, selectedPlanets]);

  const sortedAndFilteredApproaches = useMemo(() => {
    return [...filteredApproaches].sort((a, b) => {
        if (sortConfig.key === 'date') {
            const valA = a.epoch_date_close_approach;
            const valB = b.epoch_date_close_approach;
            return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        } else { // distance
            const valA = parseFloat(a.miss_distance.kilometers);
            const valB = parseFloat(b.miss_distance.kilometers);
            return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }
    });
  }, [filteredApproaches, sortConfig]);

  const handleSelectApproach = (epoch: number) => {
    setSelectedApproachEpoch(prevEpoch => prevEpoch === epoch ? null : epoch);
  };

  const handleYearChange = (newRange: [number, number]) => {
    setYearRange(newRange);
    setSelectedApproachEpoch(null);
  };

  const handlePlanetChange = (newPlanets: string[]) => {
    setSelectedPlanets(newPlanets);
    setSelectedApproachEpoch(null);
  }

  const handleSortChange = (key: SortKey) => {
    setSortConfig(prevConfig => {
      const isSameKey = prevConfig.key === key;
      const direction = isSameKey ? (prevConfig.direction === 'asc' ? 'desc' : 'asc') : 'desc';
      return { key, direction };
    });
  };

  useEffect(() => {
    if (!rawUrl) {
      setError("No se ha proporcionado una URL.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const secureUrl = rawUrl.replace('http://', 'https://');
        const response = await fetch(secureUrl);
        if (!response.ok) throw new Error(`Error de red! Estatus: ${response.status}`);

        const data: NEOObject = await response.json();
        setNeoData(data);
        
        const approaches = data.close_approach_data
          .filter(app => app.orbiting_body !== 'Moon')
          .map(app => ({...app, orbiting_body: normalizePlanetName(app.orbiting_body)}))
          .sort((a,b) => a.epoch_date_close_approach - b.epoch_date_close_approach);
        
        setAllApproaches(approaches);

        if (approaches.length > 0) {
          const years = approaches.map(app => new Date(app.close_approach_date_full).getFullYear());
          const min = Math.min(...years);
          const max = Math.max(...years);
          setYearRange([min, max]);

          const planets = [...new Set(approaches.map(app => app.orbiting_body))];
          setSelectedPlanets(planets);
        }

      } catch (e: any) {
        setError(e.message || "Ha ocurrido un error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [rawUrl]);

  useEffect(() => {
    if (isLoading) return;
    let animationFrameId: number;
    const animate = (timestamp: number) => {
      if (timestamp - lastFrameTime.current >= frameInterval) {
        lastFrameTime.current = timestamp;
        setTime(prevTime => prevTime + 1);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isLoading, frameInterval]);

  return (
    <main className="container mx-auto h-screen flex flex-col">
      {isLoading && <p className="text-center p-8">Buscando el historial del asteroide...</p>}
      {error && <p className="text-center text-red-500 p-8">Error: {error}</p>}

      {!isLoading && !error && neoData && (
        <div className="flex flex-grow border rounded-lg overflow-hidden animate-in fade-in">
          <div className="w-full md:w-2/3 lg:w-3/4 h-full relative">
            <SolarSystemPlot 
              approaches={sortedAndFilteredApproaches} 
              neoData={neoData}
              selectedApproachEpoch={selectedApproachEpoch}
              onApproachSelect={handleSelectApproach}
              time={time}
            />
          </div>
          <ApproachList 
            approaches={sortedAndFilteredApproaches} 
            selectedEpoch={selectedApproachEpoch}
            onSelect={handleSelectApproach}
            neoName={neoData.name}
            minYear={minYear}
            maxYear={maxYear}
            onYearChange={handleYearChange}
            yearRange={yearRange}
            availablePlanets={availablePlanets}
            selectedPlanets={selectedPlanets}
            onPlanetChange={handlePlanetChange}
            onSortChange={handleSortChange}
            sortConfig={sortConfig}
          />
        </div>
      )}
    </main>
  );
}

export default function HistoricalPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Cargando...</div>}>
      <HistoricalView />
    </Suspense>
  );
}
