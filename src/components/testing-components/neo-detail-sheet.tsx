'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NEOObject } from "@/lib/types";
import { NeoCard } from "./neo-card";

interface NeoDetailSheetProps {
  neo: NEOObject | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function NeoDetailSheet({ neo, isOpen, onOpenChange }: NeoDetailSheetProps) {
  if (!neo) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <ScrollArea className="h-full pr-4">
          <SheetHeader>
            <SheetTitle>{neo.name}</SheetTitle>
            <SheetDescription>
              Información detallada del Objeto Cercano a la Tierra (NEO) ID: {neo.id}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <NeoCard neo={neo} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
