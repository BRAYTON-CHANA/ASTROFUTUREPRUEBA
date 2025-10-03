'use client';
import * as React from 'react';
import { useLanguage } from '@/context/language-context';

interface TrajectorySimulationProps {
  orbit: {
    eccentricity: number;
    orbital_period_days: number;
    semi_major_axis_au: number;
  };
  speed: number;
}

export function TrajectorySimulation({ orbit, speed }: TrajectorySimulationProps) {
  const { t } = useLanguage();
  const { eccentricity, orbital_period_days } = orbit;
  
  // Apply speed multiplier, ensuring it doesn't get too fast or slow
  const basePeriod = Math.max(5, Math.min(20, orbital_period_days / 365 * 2));
  const orbitalPeriod = basePeriod / speed;


  const containerSize = 280;
  const a = containerSize / 2 * 0.9;
  const b = a * Math.sqrt(1 - Math.pow(eccentricity, 2));
  const focusOffset = a * eccentricity;

  let scale = 1;
  const requiredWidth = a + Math.abs(focusOffset);
  if (requiredWidth > containerSize / 2) {
    scale = (containerSize / 2) / requiredWidth;
  }
  
  const containerStyle = {
    transform: `scale(${scale})`,
  };

  const animationStyle = {
    animationDuration: `${orbitalPeriod}s`,
  } as React.CSSProperties;

  const sunStyle = {
      transform: `translateX(${-focusOffset}px)`,
  }

  const orbitPathStyle = {
      width: `${a * 2}px`,
      height: `${b * 2}px`,
  }
  
  return (
    <div className="relative flex items-center justify-center w-full h-80 rounded-lg bg-muted/30 p-4 overflow-hidden">
      <div style={containerStyle}>
        <div className="absolute w-8 h-8 bg-yellow-400 rounded-full shadow-[0_0_20px_theme(colors.yellow.400)] z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={sunStyle} />
        <div 
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 animate-orbit-rotation"
          style={animationStyle}
        >
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={orbitPathStyle}
          >
             <div className="absolute top-1/2 left-[calc(100%-0.5rem)] w-4 h-4 -translate-y-1/2 -translate-x-1/2 bg-primary rounded-full shadow-[0_0_10px_theme(colors.primary.DEFAULT)]" />
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 left-4 text-xs text-muted-foreground z-20">
        <p>{t('simulation.period')}: {orbitalPeriod.toFixed(1)}s</p>
        <p>{t('simulation.eccentricity')}: {eccentricity.toFixed(2)}</p>
      </div>
    </div>
  );
}
