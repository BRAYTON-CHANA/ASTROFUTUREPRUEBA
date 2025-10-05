'use client';

import * as React from 'react';
import type { SpaceObject } from '@/lib/types';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface FeaturedObjectViewerProps {
  objects: SpaceObject[];
}

// A new, simplified component to display the object data in a card format.
function FeaturedObjectCard({ object }: { object: SpaceObject }) {
    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="aspect-video rounded-lg overflow-hidden border">
                        <img 
                            src={object.imageUrl} 
                            alt={object.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold tracking-tight">{object.name}</h3>
                        <div className="flex items-center gap-4">
                           <Badge variant='outline'>{object.type}</Badge>
                           <Badge variant={object.is_potentially_hazardous ? 'destructive' : 'default'}>
                                {object.is_potentially_hazardous ? 'Peligroso' : 'No Peligroso'}
                           </Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                           {object.description}
                        </p>
                        <div className="text-sm text-muted-foreground grid grid-cols-2 gap-x-6 gap-y-2 pt-2">
                            <p><span className="font-semibold text-foreground">Diámetro:</span> {object.diameter_km.toLocaleString('es-ES')} km</p>
                            <p><span className="font-semibold text-foreground">Distancia Mínima:</span> {parseFloat(object.miss_distance_au).toFixed(3)} AU</p>
                            <p><span className="font-semibold text-foreground">Período Orbital:</span> {object.orbit.orbital_period_days.toLocaleString('es-ES')} días</p>
                            <p><span className="font-semibold text-foreground">Excentricidad:</span> {object.orbit.eccentricity.toFixed(4)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function FeaturedObjectViewer({ objects }: FeaturedObjectViewerProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % objects.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + objects.length) % objects.length);
  };

  const currentObject = objects[currentIndex];

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 500 : -500, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 500 : -500, opacity: 0 }),
  };

  return (
    <div className="relative bg-card/50 border border-border rounded-xl p-6 md:p-8 overflow-hidden">
      <Link href={`/explorer?focus=${currentObject.id}`} className="absolute top-4 right-4 z-20 flex items-center gap-2 text-sm text-primary hover:underline group">
        <span>{t('home.viewAll.cta')}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
      
      <div className="relative">
        <Button variant="outline" size="icon" onClick={handlePrevious} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-12 z-10 h-10 w-10 rounded-full">
            <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-12 z-10 h-10 w-10 rounded-full">
            <ChevronRight className="h-6 w-6" />
        </Button>

        <AnimatePresence initial={false} custom={direction}>
            <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                }}
                className="w-full"
            >
              <FeaturedObjectCard object={currentObject} />
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
