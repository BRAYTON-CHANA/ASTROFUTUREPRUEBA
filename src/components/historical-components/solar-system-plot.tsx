'use client';

import { CloseApproachData, NEOObject } from '@/lib/types';
import React, { useMemo } from 'react';

const PLANET_DATA: { [key: string]: { radius: number; color: string; size: number; period: number } } = {
  Mercury: { radius: 51, color: '#a8a29e', size: 10, period: 0.24 },
  Venus:   { radius: 94, color: '#f59e0b', size: 15, period: 0.62 },
  Earth:   { radius: 128, color: '#3b82f6', size: 15, period: 1 },
  Mars:    { radius: 170, color: '#ef4444', size: 12, period: 1.88 },
  Jupiter: { radius: 238, color: '#f97316', size: 41, period: 11.86 },
  Saturn:  { radius: 306, color: '#eab308', size: 36, period: 29.46 },
  Uranus:  { radius: 357, color: '#60a5fa', size: 26, period: 84.01 },
  Neptune: { radius: 400, color: '#8b5cf6', size: 26, period: 164.8 },
};

const ANIMATION_SPEED = 0.025;

interface SolarSystemPlotProps {
  approaches: CloseApproachData[];
  neoData: NEOObject;
  selectedApproachEpoch: number | null; 
  onApproachSelect: (epoch: number) => void;
  time: number;
}

const getPosition = (radius: number, angle: number) => ({
  x: radius * Math.cos(angle - Math.PI / 2),
  y: radius * Math.sin(angle - Math.PI / 2),
});

function seededShuffle<T>(array: T[], seed: number): T[] {
  let currentIndex = array.length, randomIndex;
  const pseudoRandom = () => {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
  };

  while (currentIndex !== 0) {
    randomIndex = Math.floor(pseudoRandom() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export function SolarSystemPlot({ approaches, neoData, selectedApproachEpoch, onApproachSelect, time }: SolarSystemPlotProps) {

  const { approachesByPlanet, maxDistances, sideAssignments } = useMemo((): {
    approachesByPlanet: Map<string, CloseApproachData[]>;
    maxDistances: Map<string, number>;
    sideAssignments: Map<number, number>;
  } => {
    const map = new Map<string, CloseApproachData[]>();
    approaches.forEach((app: CloseApproachData) => {
      const planetName = app.orbiting_body;
      if (!PLANET_DATA[planetName]) return;
      if (!map.has(planetName)) {
        map.set(planetName, []);
      }
      map.get(planetName)!.push(app);
    });

    const maxDists = new Map<string, number>();
    const assignments = new Map<number, number>();
    
    map.forEach((apps: CloseApproachData[], planet: string) => {
      apps.sort((a, b) => parseFloat(a.miss_distance.lunar) - parseFloat(b.miss_distance.lunar));
      const max = apps.length > 0 ? parseFloat(apps[apps.length - 1].miss_distance.lunar) : 0;
      maxDists.set(planet, max);

      const sides = apps.map((_, i) => (i % 2 === 0 ? 1 : -1));
      const seed = apps.reduce((acc, app) => acc + app.epoch_date_close_approach, 0);
      const shuffledSides = seededShuffle(sides, seed);
      apps.forEach((app, i) => {
        assignments.set(app.epoch_date_close_approach, shuffledSides[i]);
      });
    });

    return { approachesByPlanet: map, maxDistances: maxDists, sideAssignments: assignments };
  }, [approaches]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-background rounded-lg">
      <div className="w-11 h-11 bg-yellow-400 rounded-full z-20 shadow-2xl shadow-yellow-400/50">
        <title>Sol</title>
      </div>

      {Object.entries(PLANET_DATA).map(([name, { radius }]) => (
        <div key={`${name}-orbit`} className="absolute rounded-full border border-dashed border-muted-foreground/30" style={{ width: `${radius * 2}px`, height: `${radius * 2}px`, top: `calc(50% - ${radius}px)`, left: `calc(50% - ${radius}px)` }}></div>
      ))}

      {Object.entries(PLANET_DATA).map(([planetName, data]) => {
        const { radius, color, size, period } = data;
        const planetAngle = (2 * Math.PI * time * ANIMATION_SPEED) / (period * 100);
        const { x: planetX, y: planetY } = getPosition(radius, planetAngle);

        const planetApproaches = approachesByPlanet.get(planetName) || [];
        const maxDist = maxDistances.get(planetName) || 0;

        return (
          <React.Fragment key={planetName}>
            <div className="absolute rounded-full z-10 cursor-pointer" style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              boxShadow: `0 0 18px 5px ${color}`,
              transform: `translate(${planetX}px, ${planetY}px)`
            }}>
              <title>Planeta: {planetName}</title>
              {planetName === 'Saturn' && <div className="absolute w-[200%] h-[200%] border-2 border-yellow-200/50 rounded-full" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(30deg)' }}></div>}
            </div>

            {planetApproaches.map((approach: CloseApproachData) => {
              const lunarDist = parseFloat(approach.miss_distance.lunar);
              const distAngle = maxDist > 0 ? (lunarDist / maxDist) * Math.PI : 0;
              
              const side = sideAssignments.get(approach.epoch_date_close_approach) || 1;

              const finalAngle = planetAngle + (distAngle * side);
              const pointRadius = radius;
              const { x, y } = getPosition(pointRadius, finalAngle);
              const isSelected = approach.epoch_date_close_approach === selectedApproachEpoch;

              return (
                <div 
                  key={approach.epoch_date_close_approach} 
                  onClick={() => onApproachSelect(approach.epoch_date_close_approach)}
                  className="absolute rounded-full cursor-pointer border-2 transition-all duration-300"
                  style={{
                    width: isSelected ? '18px' : '10px',
                    height: isSelected ? '18px' : '10px',
                    borderColor: isSelected ? '#ffffff' : color,
                    backgroundColor: isSelected ? '#ef4444' : '#ffffff',
                    boxShadow: isSelected ? `0 0 18px 7px #ef4444` : 'none',
                    transform: `translate(${x}px, ${y}px)`,
                    zIndex: isSelected ? 40 : 30,
                  }}>
                  <title>
                    Asteroide: {neoData.name}\nFecha: {approach.close_approach_date_full}\nPlaneta: {approach.orbiting_body}\nDistancia: {lunarDist.toLocaleString()} LD
                  </title>
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}
