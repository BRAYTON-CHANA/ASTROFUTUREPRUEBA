'use client';

import * as React from 'react';
import type { SpaceObject } from '@/lib/types';
import { ObjectDetailView } from './object-detail-view';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';

interface FeaturedObjectViewerProps {
  objects: SpaceObject[];
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
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  return (
    <div className="relative bg-card/50 border border-border rounded-xl p-6 md:p-8">
      <Link href={`/explorer?focus=${currentObject.id}`} className="absolute top-4 right-4 z-20 flex items-center gap-2 text-sm text-primary hover:underline group">
        <span>{t('home.viewAll.cta')}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
      
      <Button variant="outline" size="icon" onClick={handlePrevious} className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-[-50%] z-10 h-10 w-10">
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Anterior</span>
      </Button>
      <Button variant="outline" size="icon" onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[50%] z-10 h-10 w-10">
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Siguiente</span>
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
          <ObjectDetailView object={currentObject} isFeatured={true} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
