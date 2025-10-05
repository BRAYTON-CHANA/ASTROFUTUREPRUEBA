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
    <div className="flex items-center justify-between mt-4">
      <Button onClick={onPrev}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Previous Day
      </Button>
      <div className="text-sm font-medium">Element Count: {elementCount}</div>
      <Button onClick={onNext}>
        Next Day <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
