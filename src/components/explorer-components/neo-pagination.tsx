'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NeoPaginationProps {
  onPrev: () => void;
  onNext: () => void;
  elementCount: number;
}

export function NeoPagination({ onPrev, onNext, elementCount }: NeoPaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4 p-2 rounded-lg bg-card/50">
      <div className="flex items-center gap-2">
        <Button onClick={onPrev} variant="outline" size="icon" aria-label="Previous Day">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button onClick={onNext} variant="outline" size="icon" aria-label="Next Day">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm font-medium">
        <span className="text-muted-foreground mr-2">Asteroids found:</span>
        <span className="font-bold text-lg">{elementCount}</span>
      </div>
    </div>
  );
}
