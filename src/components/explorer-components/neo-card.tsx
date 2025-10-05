'use client';

import { NEOObject } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Helper component for displaying a data point
const DataPoint = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="mb-1 text-sm">
    <span className="font-semibold">{label}: </span>
    <span className="text-muted-foreground">{String(value)}</span>
  </div>
);

interface NeoCardProps {
  neo: NEOObject;
}

export function NeoCard({ neo }: NeoCardProps) {
  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{neo.name}</CardTitle>
            <CardDescription>
              ID: {neo.id} | Neo Reference ID: {neo.neo_reference_id}
            </CardDescription>
          </div>
          <div className="text-right flex-shrink-0">
            <Badge variant={neo.is_potentially_hazardous_asteroid ? 'destructive' : 'default'}>
              {neo.is_potentially_hazardous_asteroid
                ? 'Potencialmente Peligroso'
                : 'No Peligroso'}
            </Badge>
            {neo.is_sentry_object && (
              <Badge className="mt-1" variant="outline">Sentry Object</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* === Object Properties === */}
        <h4 className="text-lg font-bold mb-3 mt-2">Propiedades del Objeto</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <DataPoint
            label="Magnitud Absoluta"
            value={`${neo.absolute_magnitude_h} h`}
          />
        </div>

        <h5 className="font-semibold mb-2">Diámetro Estimado</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted rounded-md mb-4 border">
          <div>
            <p className="font-semibold text-sm">Kilómetros</p>
            <p className="text-xs text-muted-foreground">{`Min: ${neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)}`}</p>
            <p className="text-xs text-muted-foreground">{`Max: ${neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)}`}</p>
          </div>
          <div>
            <p className="font-semibold text-sm">Metros</p>
            <p className="text-xs text-muted-foreground">{`Min: ${neo.estimated_diameter.meters.estimated_diameter_min.toFixed(2)}`}</p>
            <p className="text-xs text-muted-foreground">{`Max: ${neo.estimated_diameter.meters.estimated_diameter_max.toFixed(2)}`}</p>
          </div>
          <div>
            <p className="font-semibold text-sm">Millas</p>
            <p className="text-xs text-muted-foreground">{`Min: ${neo.estimated_diameter.miles.estimated_diameter_min.toFixed(2)}`}</p>
            <p className="text-xs text-muted-foreground">{`Max: ${neo.estimated_diameter.miles.estimated_diameter_max.toFixed(2)}`}</p>
          </div>
          <div>
            <p className="font-semibold text-sm">Pies</p>
            <p className="text-xs text-muted-foreground">{`Min: ${neo.estimated_diameter.feet.estimated_diameter_min.toFixed(2)}`}</p>
            <p className="text-xs text-muted-foreground">{`Max: ${neo.estimated_diameter.feet.estimated_diameter_max.toFixed(2)}`}</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* === Close Approach Data === */}
        <h4 className="text-lg font-bold mb-3">Datos de Acercamiento</h4>
        {neo.close_approach_data.map((approach, index) => (
          <div key={index} className="p-3 bg-muted rounded-md mb-4 border">
            <DataPoint label="Fecha de Acercamiento" value={approach.close_approach_date_full} />
            <DataPoint label="Cuerpo en órbita" value={approach.orbiting_body} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <h5 className="font-semibold mb-1">Velocidad Relativa</h5>
                <ul className="list-disc list-inside text-xs text-muted-foreground">
                  <li>{`${parseFloat(approach.relative_velocity.kilometers_per_second).toFixed(2)} km/s`}</li>
                  <li>{`${parseFloat(approach.relative_velocity.kilometers_per_hour).toLocaleString()} km/h`}</li>
                  <li>{`${parseFloat(approach.relative_velocity.miles_per_hour).toLocaleString()} mi/h`}</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-1">Distancia de Falla</h5>
                <ul className="list-disc list-inside text-xs text-muted-foreground">
                  <li>{`${parseFloat(approach.miss_distance.astronomical).toFixed(4)} AU`}</li>
                  <li>{`${parseFloat(approach.miss_distance.lunar).toFixed(2)} LD`}</li>
                  <li>{`${parseFloat(approach.miss_distance.kilometers).toLocaleString()} km`}</li>
                  <li>{`${parseFloat(approach.miss_distance.miles).toLocaleString()} miles`}</li>
                </ul>
              </div>
            </div>
          </div>
        ))}

        {neo.orbital_data && (
          <>
            <Separator className="my-4" />
            {/* === Orbital Data === */}
            <h4 className="text-lg font-bold mb-3">Características Orbitales</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 mb-4">
              <DataPoint label="ID de Órbita" value={neo.orbital_data.orbit_id} />
              <DataPoint label="Fecha Determinación" value={neo.orbital_data.orbit_determination_date} />
              <DataPoint label="Primera Observación" value={neo.orbital_data.first_observation_date} />
              <DataPoint label="Última Observación" value={neo.orbital_data.last_observation_date} />
              <DataPoint label="Arco de Datos (días)" value={neo.orbital_data.data_arc_in_days} />
              <DataPoint label="Observaciones Usadas" value={neo.orbital_data.observations_used} />
              <DataPoint label="Incertidumbre" value={neo.orbital_data.orbit_uncertainty} />
              <DataPoint label="Intersección Mínima" value={neo.orbital_data.minimum_orbit_intersection} />
              <DataPoint label="Invariante Tisserand" value={neo.orbital_data.jupiter_tisserand_invariant} />
              <DataPoint label="Excentricidad" value={neo.orbital_data.eccentricity} />
              <DataPoint label="Semieje Mayor" value={neo.orbital_data.semi_major_axis} />
              <DataPoint label="Inclinación" value={neo.orbital_data.inclination} />
              <DataPoint label="Longitud Nodo Ascendente" value={neo.orbital_data.ascending_node_longitude} />
              <DataPoint label="Período Orbital" value={neo.orbital_data.orbital_period} />
              <DataPoint label="Distancia Perihelio" value={neo.orbital_data.perihelion_distance} />
              <DataPoint label="Argumento Perihelio" value={neo.orbital_data.perihelion_argument} />
              <DataPoint label="Distancia Afelio" value={neo.orbital_data.aphelion_distance} />
              <DataPoint label="Tiempo Perihelio" value={neo.orbital_data.perihelion_time} />
              <DataPoint label="Anomalía Media" value={neo.orbital_data.mean_anomaly} />
              <DataPoint label="Movimiento Medio" value={neo.orbital_data.mean_motion} />
              <DataPoint label="Equinoccio" value={neo.orbital_data.equinox} />
            </div>

            <h5 className="font-semibold mb-2 mt-4">Clase de Órbita</h5>
            <div className="p-3 bg-muted rounded-md border">
                <DataPoint label="Tipo" value={neo.orbital_data.orbit_class.orbit_class_type} />
                <DataPoint label="Rango" value={neo.orbital_data.orbit_class.orbit_class_range} />
                <DataPoint label="Descripción" value={neo.orbital_data.orbit_class.orbit_class_description} />
            </div>
          </>
        )}
      </CardContent>

      <CardFooter>
        <a href={neo.nasa_jpl_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          Ver en el sitio web de JPL
        </a>
      </CardFooter>
    </Card>
  );
}
