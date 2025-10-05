'use client';

import { CloseApproachData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Helper component for displaying a data point
const DataPoint = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="mb-2 text-sm">
    <span className="font-semibold">{label}: </span>
    <span className="text-muted-foreground">{String(value)}</span>
  </div>
);

interface HistoricalApproachCardProps {
  approach: CloseApproachData;
}

export function HistoricalApproachCard({ approach }: HistoricalApproachCardProps) {
  return (
    <Card className="mb-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">
          Fecha de Acercamiento: {approach.close_approach_date_full}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DataPoint label="Cuerpo en órbita" value={approach.orbiting_body} />
          <DataPoint
            label="Velocidad Relativa"
            value={`${parseFloat(approach.relative_velocity.kilometers_per_hour).toLocaleString()} km/h`}
          />
          <DataPoint
            label="Distancia de Falla"
            value={`${parseFloat(approach.miss_distance.kilometers).toLocaleString()} km`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
