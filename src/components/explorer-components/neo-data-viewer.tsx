'use client';

import { NEOObject } from '@/lib/types';
import { NeoSummaryCard } from './neo-summary-card';

interface NeoDataViewerProps {
  data: NEOObject[] | null;
  loading: boolean;
  error: string | null;
  onViewDetails: (neo: NEOObject) => void;
}

export function NeoDataViewer({ data, loading, error, onViewDetails }: NeoDataViewerProps) {
  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">Error: {error}</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-center mt-8">No data available for this date.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {data.map(neo => (
        <NeoSummaryCard key={neo.id} neo={neo} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}
