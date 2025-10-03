import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { EnrichedSpaceObject } from './main-view';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/context/language-context';

interface ObjectCardProps {
  object: EnrichedSpaceObject;
  onClick?: () => void;
}

export function ObjectCard({ object, onClick }: ObjectCardProps) {
  const { t, language } = useLanguage();

  const formattedDate = React.useMemo(() => {
    try {
      const dateStr = object.close_approach_date.split(' ')[0];
      const locale = language === 'es' ? es : enUS;
      const formatStr = language === 'es' ? "d 'de' MMMM, yyyy" : "MMMM d, yyyy";
      return format(parseISO(dateStr), formatStr, { locale });
    } catch (e) {
      return object.close_approach_date;
    }
  }, [object.close_approach_date, language]);


  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 cursor-pointer bg-card/80 backdrop-blur-sm border-white/10"
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={object.imageUrl}
            alt={object.description}
            data-ai-hint={object.imageHint}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <CardTitle className="text-2xl font-bold text-white truncate max-w-[90%]">{object.name}</CardTitle>
            <CardDescription className="text-primary">{t(`types.${object.type}` as any)}</CardDescription>
          </div>
          {object.is_potentially_hazardous && (
             <Badge variant="destructive" className="absolute top-4 right-4 gap-1.5">
                <AlertTriangle className="h-3 w-3"/>
                {t('card.hazardous')}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{t('card.approachDate')}</p>
          <p className="font-semibold">{formattedDate}</p>
        </div>
        {onClick && (
          <div className="flex items-center gap-2 text-primary">
              <span>{t('card.explore')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
