'use client';

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

export type SortKey = 'date' | 'distance';
export type SortDirection = 'asc' | 'desc';
export type SortConfig = { key: SortKey; direction: SortDirection; };

interface ApproachFilterMenuProps {
  minYear: number;
  maxYear: number;
  onYearChange: (years: [number, number]) => void;
  initialRange: [number, number];
  planets: string[];
  selectedPlanets: string[];
  onPlanetChange: (planets: string[]) => void;
  onSortChange: (key: SortKey) => void;
  sortConfig: SortConfig;
  className?: string;
}

export function ApproachFilterMenu({ 
  minYear, 
  maxYear, 
  onYearChange, 
  initialRange,
  planets,
  selectedPlanets,
  onPlanetChange,
  onSortChange,
  sortConfig,
  className 
}: ApproachFilterMenuProps) {
  const [selectedYears, setSelectedYears] = useState<[number, number]>(initialRange);

  useEffect(() => {
    setSelectedYears(initialRange);
  }, [initialRange]);

  const handleYearValueChange = (value: [number, number]) => {
    setSelectedYears(value);
  };

  const handleYearCommit = (value: [number, number]) => {
    onYearChange(value);
  };

  const SortArrow = ({ for_key }: { for_key: SortKey }) => {
    if (sortConfig.key !== for_key) return null;
    if (sortConfig.direction === 'asc') return <ArrowUp className="w-4 h-4 ml-2" />;
    return <ArrowDown className="w-4 h-4 ml-2" />;
  };

  return (
    <div className={className}>
      <div className="px-4 pt-4 border-b">
        <h3 className="text-base font-semibold mb-2">Ordenar Por</h3>
        <div className="flex items-center gap-2 pb-4">
          <Button 
            variant={sortConfig.key === 'date' ? "secondary" : "outline"}
            size="sm"
            onClick={() => onSortChange('date')}
            className="flex-1 text-xs h-8"
          >
            Fecha
            <SortArrow for_key="date" />
          </Button>
          <Button 
            variant={sortConfig.key === 'distance' ? "secondary" : "outline"}
            size="sm"
            onClick={() => onSortChange('distance')}
            className="flex-1 text-xs h-8"
          >
            Distancia
            <SortArrow for_key="distance" />
          </Button>
        </div>
      </div>
      
      <div className="px-4 pt-4">
        <h3 className="text-base font-semibold mb-2">Filtrar por Año</h3>
        <div className="px-2">
          <Slider
            min={minYear}
            max={maxYear}
            step={1}
            value={selectedYears}
            onValueChange={handleYearValueChange}
            onValueCommit={handleYearCommit}
            className="my-4"
            key={maxYear}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{selectedYears[0]}</span>
            <span>{selectedYears[1]}</span>
          </div>
        </div>
      </div>
      
      <div className="px-4 pt-4 border-t">
        <h3 className="text-base font-semibold mb-2">Filtrar por Planeta</h3>
        <div className="flex flex-wrap gap-2 px-2 pb-4">
          {planets.map(planet => (
            <Button
              key={planet}
              variant={selectedPlanets.includes(planet) ? "secondary" : "outline"}
              size="sm"
              onClick={() => onPlanetChange(selectedPlanets.includes(planet) ? selectedPlanets.filter(p => p !== planet) : [...selectedPlanets, planet])}
              className="text-xs h-7"
            >
              {planet}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
