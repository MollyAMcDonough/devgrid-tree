'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import FactoryForm from '@/app/components/FactoryForm';

export default function FactoryNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    name: string;
    lower_bound: number;
    upper_bound: number;
    children_count: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/factories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Failed to create factory');
      } else {
        router.push('/');
      }
    } catch (e) {
      console.error(e);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-70 bg-blend-overlay text-white flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <Button
          variant="outlined"
          onClick={() => router.push('/')}
          className="mb-4 !border-white !text-white hover:!bg-white hover:!text-black"
        >
          &larr; Back to List
        </Button>
        <h1 className="text-2xl font-bold mb-4 text-white">Add New Factory</h1>
        <FactoryForm onSubmit={handleSubmit} loading={loading} />
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
}
