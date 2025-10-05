'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { format, subDays, addDays } from 'date-fns';
import { DatePicker } from '@/components/testing-components/date-picker';
import { NeoDataViewer } from '@/components/testing-components/neo-data-viewer';
import { NeoPagination } from '@/components/testing-components/neo-pagination';
import { NEOObject } from '@/lib/types';

const TestingPage = () => {
  const [date, setDate] = useState(new Date());
  const [neoData, setNeoData] = useState<NEOObject[] | null>(null);
  const [elementCount, setElementCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getNeoData = useCallback(async (selectedDate: Date) => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formattedDate}&end_date=${formattedDate}&detailed=true&api_key=${apiKey}`;

      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();

      setNeoData(data.near_earth_objects[formattedDate] || []);
      setElementCount(data.element_count);
    } catch (err: any) {
      setError(err.message);
      setNeoData(null);
      setElementCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getNeoData(date);
  }, [date, getNeoData]);

  const handlePrev = () => {
    setDate(prevDate => subDays(prevDate, 1));
  };

  const handleNext = () => {
    setDate(prevDate => addDays(prevDate, 1));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Testing Page</h1>
      <p>This is a page for testing purposes.</p>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Select a Date</h2>
        <DatePicker date={date} setDate={setDate} />
      </div>
      <NeoPagination
        onPrev={handlePrev}
        onNext={handleNext}
        elementCount={elementCount}
      />
      <NeoDataViewer data={neoData} loading={loading} error={error} />
    </div>
  );
};

export default TestingPage;
