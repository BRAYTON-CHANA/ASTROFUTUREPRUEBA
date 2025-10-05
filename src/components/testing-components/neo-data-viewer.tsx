'use client';

import { NEOObject } from '@/lib/types';
import { NeoCard } from './neo-card';

interface NeoDataViewerProps {
  data: NEOObject[] | null;
  loading: boolean;
  error: string | null;
}

export function NeoDataViewer({ data, loading, error }: NeoDataViewerProps) {
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
    <div className="mt-8">
      {data.map(neo => (
        <NeoCard key={neo.id} neo={neo} />
      ))}
    </div>
  );
}
