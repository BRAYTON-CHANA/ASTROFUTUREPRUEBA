import type { EnrichedSpaceObject } from './main-view';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AiExplainer } from './ai-explainer';
import { TrajectorySimulation } from './trajectory-simulation';
import { Diameter, Group, Gauge, Milestone, Orbit, AlertTriangle, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import React from 'react';
import { Card } from '../ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';

interface ObjectDetailViewProps {
  object: EnrichedSpaceObject;
  isDialog?: boolean;
  isFeatured?: boolean;
  children?: React.ReactNode;
}

const DetailItem = ({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string | number, unit?: string }) => (
    <div className="flex items-start gap-4 p-3 rounded-md bg-muted/30">
        <div className="text-primary mt-1">{icon}</div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold">{value} <span className="text-sm text-muted-foreground">{unit}</span></p>
        </div>
    </div>
)

const ViewContent = ({ object, children }: { object: EnrichedSpaceObject, children?: React.ReactNode }) => {
    const { t, language } = useLanguage();
    const [simulationOrbit, setSimulationOrbit] = React.useState(object.orbit);
    const [simulationSpeed, setSimulationSpeed] = React.useState(1);
    
    React.useEffect(() => {
        setSimulationOrbit(object.orbit);
        setSimulationSpeed(1);
    }, [object]);

    const formattedDate = React.useMemo(() => {
        try {
        const dateStr = object.close_approach_date.split(' ')[0];
        const locale = language === 'es' ? es : enUS;
        const formatStr = language === 'es' ? "d 'de' MMMM, yyyy 'a las' HH:mm" : "MMMM d, yyyy 'at' HH:mm";
        return format(parseISO(dateStr), formatStr, { locale });
        } catch (e) {
        return object.close_approach_date;
        }
    }, [object.close_approach_date, language]);

    return (
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 min-h-0 py-4">
            <div className="flex flex-col gap-4">
                <Tabs defaultValue="properties" className="w-full">
                    <TabsList>
                        <TabsTrigger value="properties">{t('details.tabs.properties')}</TabsTrigger>
                        <TabsTrigger value="simulation">{t('details.tabs.simulation')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="properties" className="pt-4">
                        <h3 className="text-xl font-semibold mb-4">{t('details.orbitalProperties')}</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <DetailItem icon={<Orbit className="w-6 h-6"/>} label={t('details.orbitalPeriod')} value={object.orbit.orbital_period_days.toLocaleString(language)} unit="días" />
                            <DetailItem icon={<Orbit className="w-6 h-6"/>} label={t('details.eccentricity')} value={object.orbit.eccentricity} />
                            <DetailItem icon={<Orbit className="w-6 h-6"/>} label={t('details.inclination')} value={object.orbit.inclination_deg.toLocaleString(language)} unit="°" />
                            <DetailItem icon={<Orbit className="w-6 h-6"/>} label={t('details.semiMajorAxis')} value={object.orbit.semi_major_axis_au.toLocaleString(language)} unit="au" />
                        </div>
                        <Separator className="my-6" />
                        <h3 className="text-xl font-semibold mb-4">{t('details.objectProperties')}</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <DetailItem icon={<Diameter className="w-6 h-6"/>} label={t('details.diameter')} value={object.diameter_km.toLocaleString(language)} unit="km" />
                            <DetailItem icon={<Milestone className="w-6 h-6"/>} label={t('details.closeApproach')} value={formattedDate} />
                            <DetailItem icon={<Gauge className="w-6 h-6"/>} label={t('details.relativeVelocity')} value={Number(object.relative_velocity_kps).toLocaleString(language)} unit="km/s" />
                            <DetailItem icon={<Group className="w-6 h-6"/>} label={t('details.missDistance')} value={Number(object.miss_distance_au).toLocaleString(language)} unit="au" />
                        </div>
                    </TabsContent>
                    <TabsContent value="simulation" className="pt-4 space-y-6">
                        <div>
                            <Label htmlFor="eccentricity-slider">{t('details.simulation.eccentricity')}: {simulationOrbit.eccentricity.toFixed(3)}</Label>
                            <Slider
                            id="eccentricity-slider"
                            min={0}
                            max={0.999}
                            step={0.01}
                            value={[simulationOrbit.eccentricity]}
                            onValueChange={([value]) => setSimulationOrbit(prev => ({...prev, eccentricity: value}))}
                            className="my-2"
                            />
                            <p className="text-xs text-muted-foreground">{t('details.simulation.eccentricityHint')}</p>
                        </div>
                        <div>
                            <Label htmlFor="speed-slider">{t('details.simulation.speed')}: {simulationSpeed.toFixed(1)}x</Label>
                            <Slider
                            id="speed-slider"
                            min={0.1}
                            max={5}
                            step={0.1}
                            value={[simulationSpeed]}
                            onValueChange={([value]) => setSimulationSpeed(value)}
                            className="my-2"
                            />
                            <p className="text-xs text-muted-foreground">{t('details.simulation.speedHint')}</p>
                        </div>
                    </TabsContent>
                </Tabs>
                {children && <div className="flex-none">{children}</div>}
            </div>
            <div className="flex flex-col gap-6">
                <TrajectorySimulation orbit={simulationOrbit} speed={simulationSpeed}/>
                <AiExplainer objectName={object.name} />
            </div>
        </div>
    );
};

const DialogLayout = ({ object, children }: { object: EnrichedSpaceObject, children?: React.ReactNode }) => (
    <ScrollArea className="h-full pr-4">
        <ViewContent object={object}>{children}</ViewContent>
    </ScrollArea>
);

const FeaturedLayout = ({ object, children }: { object: EnrichedSpaceObject, children?: React.ReactNode }) => (
    <ViewContent object={object}>{children}</ViewContent>
);


export function ObjectDetailView({ object, isDialog = false, isFeatured = false, children }: ObjectDetailViewProps) {
  const { t } = useLanguage();
  
  const HeaderWrapper = isDialog ? 'div' : 'div';
  const TitleComponent = 'h2';
  const DescriptionComponent = 'p';

  const Layout = isDialog ? DialogLayout : FeaturedLayout;

  return (
    <Card className="bg-transparent border-none shadow-none">
      <HeaderWrapper className={isDialog ? "pr-8" : ""}>
        <TitleComponent className="text-3xl font-bold text-primary truncate">{object.name}</TitleComponent>
        <DescriptionComponent className="text-lg flex items-center gap-2">
            {t(`types.${object.type}` as any)}
            {object.is_potentially_hazardous && (
                <span className="flex items-center gap-1 text-destructive font-semibold">
                    <AlertTriangle className="w-4 h-4" /> {t('details.potentiallyHazardous')}
                </span>
            )}
        </DescriptionComponent>
        {isFeatured && (
          <Link href={`/explorer?focus=${object.id}`} className="absolute top-4 right-4 z-10 flex items-center gap-2 text-sm text-primary hover:underline group">
            <span>{t('home.viewAll.cta')}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </HeaderWrapper>
      <Layout object={object}>{children}</Layout>
    </Card>
  );
}
