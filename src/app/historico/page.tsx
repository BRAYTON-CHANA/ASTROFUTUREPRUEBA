'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { SolarSystemPlot } from '@/components/historical-components/solar-system-plot';
import { NEOObject, CloseApproachData } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from "@/lib/utils";

function ApproachList({ approaches, selectedEpoch, onSelect, neoName }: {
  approaches: CloseApproachData[];
  selectedEpoch: number | null;
  onSelect: (epoch: number) => void;
  neoName: string;
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
    <div className="h-full w-full md:w-1/3 lg:w-1/4 bg-card border-l">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Historial de Acercamientos</h2>
        <p className="text-sm text-muted-foreground">Para el asteroide: {neoName}</p>
      </div>
      <ScrollArea className="h-[calc(100%-80px)]">
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
                <p className={cn("text-sm", {
                  'text-primary-foreground/80': isSelected,
                  'text-muted-foreground': !isSelected
                })}>
                  Distancia: {parseFloat(approach.miss_distance.lunar).toLocaleString()} LD
                </p>
                <p className={cn("text-sm", {
                  'text-primary-foreground/80': isSelected,
                  'text-muted-foreground': !isSelected
                })}>
                  Velocidad: {parseFloat(approach.relative_velocity.kilometers_per_hour).toLocaleString()} km/h
                </p>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function HistoricalView() {
  const searchParams = useSearchParams();
  const rawUrl = searchParams.get('url');

  const [neoData, setNeoData] = useState<NEOObject | null>(null);
  const [approaches, setApproaches] = useState<CloseApproachData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApproachEpoch, setSelectedApproachEpoch] = useState<number | null>(null);
  const [time, setTime] = useState(0);

  const handleSelectApproach = (epoch: number) => {
    setSelectedApproachEpoch(prevEpoch => prevEpoch === epoch ? null : epoch);
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
        
        const allApproaches = data.close_approach_data;
        allApproaches.sort((a,b) => a.epoch_date_close_approach - b.epoch_date_close_approach);
        setApproaches(allApproaches);
        
      } catch (e: any) {
        setError(e.message || "Ha ocurrido un error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [rawUrl]);

  useEffect(() => {
    if (approaches.length > 0 && selectedApproachEpoch === null) {
      setSelectedApproachEpoch(approaches[0].epoch_date_close_approach);
    }
  }, [approaches, selectedApproachEpoch]);

  useEffect(() => {
    if (isLoading) return;

    let animationFrameId: number;
    const animate = () => {
      setTime(prevTime => prevTime + 1);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isLoading]);

  return (
    <main className="container mx-auto h-screen flex flex-col">
      {isLoading && <p className="text-center p-8">Buscando el historial del asteroide...</p>}
      {error && <p className="text-center text-red-500 p-8">Error: {error}</p>}

      {!isLoading && !error && neoData && (
        <div className="flex flex-grow border rounded-lg overflow-hidden animate-in fade-in">
          <div className="w-full md:w-2/3 lg:w-3/4">
            <SolarSystemPlot 
              approaches={approaches} 
              neoData={neoData}
              selectedApproachEpoch={selectedApproachEpoch}
              onApproachSelect={handleSelectApproach}
              time={time}
            />
          </div>
          <ApproachList 
            approaches={approaches} 
            selectedEpoch={selectedApproachEpoch}
            onSelect={handleSelectApproach}
            neoName={neoData.name}
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
