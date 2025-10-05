'use client';

import { useState } from 'react';
import { NEOObject } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, History, MoreVertical, Orbit } from 'lucide-react';
import { AsteroidImage } from './asteroid-image';
import { useRouter } from 'next/navigation';
import { SimulationModal } from './simulation-modal';

interface NeoSummaryCardProps {
  neo: NEOObject;
  onViewDetails: (neo: NEOObject) => void;
}

const DataPoint = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="text-sm flex justify-between items-center py-1">
      <span className="font-semibold">{label}: </span>
      <span className="text-muted-foreground text-right">{String(value)}</span>
    </div>
  );

export function NeoSummaryCard({ neo, onViewDetails }: NeoSummaryCardProps) {
  const closestApproach = neo.close_approach_data[0];
  const router = useRouter();
  const [isSimulationModalOpen, setSimulationModalOpen] = useState(false);

  const handleHistoryClick = () => {
    router.push(`/historico?url=${encodeURIComponent(neo.links.self)}`);
  };

  return (
    <>
        <Card className="mb-4 shadow-md transition-shadow hover:shadow-lg flex flex-col justify-between overflow-hidden">
            <AsteroidImage diameter={neo.estimated_diameter.kilometers.estimated_diameter_max} />
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-grow">
                        <CardTitle className="text-lg leading-tight">{neo.name}</CardTitle>
                        <CardDescription className="mt-1">ID: {neo.id}</CardDescription>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                        <Badge 
                            variant={neo.is_potentially_hazardous_asteroid ? 'destructive' : 'default'}
                            className="text-center"
                        >
                            {neo.is_potentially_hazardous_asteroid ? 'Peligroso' : 'No Peligroso'}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="ml-1">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => onViewDetails(neo)}>
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    Stats for Nerds
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="space-y-3">
                    <DataPoint
                        label="Diámetro Máx. Aprox."
                        value={`${parseFloat(neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)).toLocaleString('es-ES')} km`}
                    />
                    {closestApproach && (
                        <DataPoint
                            label="Velocidad Relativa"
                            value={`${parseFloat(closestApproach.relative_velocity.kilometers_per_hour).toLocaleString('es-ES', { maximumFractionDigits: 0 })} km/h`}
                        />
                    )}
                    {neo.orbital_data && (
                        <DataPoint
                            label="Clase de Órbita"
                            value={neo.orbital_data.orbit_class.orbit_class_type}
                        />
                    )}
                </div>
            </CardContent>
            <CardFooter className="mt-4 flex items-center gap-2">
                <Button onClick={handleHistoryClick} className="flex-1">
                    <History className="mr-2 h-4 w-4" /> Historial
                </Button>
                {neo.orbital_data && (
                    <Button onClick={() => setSimulationModalOpen(true)} className="flex-1">
                        <Orbit className="mr-2 h-4 w-4" /> Simulación
                    </Button>
                )}
            </CardFooter>
        </Card>

        {neo.orbital_data && (
            <SimulationModal 
                isOpen={isSimulationModalOpen} 
                onOpenChange={setSimulationModalOpen} 
                orbitalData={neo.orbital_data}
                asteroidName={neo.name}
            />
        )}
    </>
  );
}
