'use client';

import * as React from 'react';
import type { SpaceObject } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ObjectCard } from './object-card';
import { ObjectDetailView } from './object-detail-view';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Search, Rocket, AlertTriangle } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language-context';

export type EnrichedSpaceObject = SpaceObject;

interface MainViewProps {
  initialObjects: EnrichedSpaceObject[];
  focusedObjectId?: string;
}

export function MainView({ initialObjects, focusedObjectId }: MainViewProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [showHazardous, setShowHazardous] = React.useState(false);
  const [selectedObject, setSelectedObject] = React.useState<EnrichedSpaceObject | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (focusedObjectId) {
      const objectToFocus = initialObjects.find(obj => obj.id === focusedObjectId);
      if (objectToFocus) {
        setSelectedObject(objectToFocus);
        // Clean up the URL parameter after focusing
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete('focus');
        router.replace(`/explorer?${newSearchParams.toString()}`, { scroll: false });
      }
    }
  }, [focusedObjectId, initialObjects, router, searchParams]);

  const filteredObjects = React.useMemo(() => {
    return initialObjects
      .filter((obj) =>
        obj.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((obj) => typeFilter === 'all' || obj.type === typeFilter)
      .filter((obj) => !showHazardous || obj.is_potentially_hazardous);
  }, [initialObjects, searchTerm, typeFilter, showHazardous]);

  const objectTypes = React.useMemo(() => 
    ['all', ...Array.from(new Set(initialObjects.map(o => o.type)))]
  , [initialObjects]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedObject(null);
    }
  };

  return (
    <Dialog open={!!selectedObject} onOpenChange={handleOpenChange}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold tracking-tighter mb-8">{t('explorer.title')}</h1>
        <div className="bg-background/70 backdrop-blur-md rounded-lg p-4 md:p-6 flex flex-col md:flex-row gap-6 md:gap-8 items-center mb-8 border border-white/10 shadow-lg">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('explorer.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px] h-11">
                  <SelectValue placeholder={t('explorer.filterByType')} />
                </SelectTrigger>
                <SelectContent>
                  {objectTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? t('explorer.allTypes') : t(`types.${type}` as any)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <Label htmlFor="hazardous-switch">{t('explorer.potentiallyHazardous')}</Label>
              <Switch
                id="hazardous-switch"
                checked={showHazardous}
                onCheckedChange={setShowHazardous}
              />
            </div>
          </div>
        </div>

        {filteredObjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredObjects.map((obj) => (
              <ObjectCard
                key={obj.id}
                object={obj}
                onClick={() => setSelectedObject(obj)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-background/50 rounded-lg">
            <h3 className="text-xl font-semibold text-muted-foreground">{t('explorer.noObjectsFound.title')}</h3>
            <p className="text-muted-foreground mt-2">{t('explorer.noObjectsFound.subtitle')}</p>
          </div>
        )}
      </div>
      {selectedObject && (
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogTitle className="sr-only">{selectedObject.name}</DialogTitle>
          <ObjectDetailView object={selectedObject} isDialog={true} />
        </DialogContent>
      )}
    </Dialog>
  );
}
