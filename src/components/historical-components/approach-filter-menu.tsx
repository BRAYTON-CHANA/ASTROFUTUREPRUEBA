'use client';

import { CloseApproachData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface ApproachFilterMenuProps {
  approaches: CloseApproachData[];
  selectedApproaches: Set<string>; // Set of close_approach_date strings
  onSelectionChange: (date: string, isSelected: boolean) => void;
}

export function ApproachFilterMenu({ 
  approaches, 
  selectedApproaches, 
  onSelectionChange 
}: ApproachFilterMenuProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Control de Visualización</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Selecciona los eventos de acercamiento que deseas mostrar en el gráfico.
        </p>
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-4">
            {approaches.map((approach) => (
              <div key={approach.close_approach_date} className="flex items-center space-x-3">
                <Checkbox
                  id={approach.close_approach_date}
                  checked={selectedApproaches.has(approach.close_approach_date)}
                  onCheckedChange={(checked) => {
                    onSelectionChange(approach.close_approach_date, !!checked);
                  }}
                />
                <label
                  htmlFor={approach.close_approach_date}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {approach.close_approach_date_full}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
