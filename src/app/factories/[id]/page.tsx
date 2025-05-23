'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@mui/material';
import { format } from 'date-fns';
import FactoryForm from '@/app/components/FactoryForm';
import FactoryChildrenTable from '@/app/components/FactoryChildrenTable';
import type { Factory } from '@/types/factory';

export default function FactoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [factory, setFactory] = useState<Factory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    async function fetchFactory() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/factories/${id}`);
        if (!res.ok) {
          setError('Factory not found');
          setFactory(null);
        } else {
          const data = await res.json();
          setFactory(data);
        }
      } catch {
        setError('Network error');
        setFactory(null);
      } finally {
        setLoading(false);
      }
    }
    fetchFactory();
  }, [id]);

  const handleEditSubmit = async (data: Partial<Factory>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/factories/${id}`, {
        method: 'PATCH', // Use PATCH for partial updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Failed to update factory');
      } else {
        setEditMode(false);
        const updated = await res.json();
        setFactory(updated);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-70 bg-blend-overlay text-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <Button
          variant="outlined"
          onClick={() => router.push('/')}
          className="mb-4 !border-white !text-white hover:!bg-white hover:!text-black"
        >
          &larr; Back to List
        </Button>
        {loading ? (
          <div className="flex justify-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : factory ? (
          editMode ? (
            <FactoryForm
              initialValues={factory}
              loading={loading}
              onSubmit={handleEditSubmit}
              hideChildrenCount
            />
          ) : (
            <div className="bg-white bg-opacity-95 rounded-lg shadow-lg p-8 text-gray-900">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{factory.name}</h1>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setEditMode(true)}
                  className="!bg-blue-600 !text-white hover:!bg-blue-700"
                >
                  Edit
                </Button>
              </div>
              <div className="mb-4">
                <div>
                  <span className="font-semibold">Bounds:</span> {factory.lower_bound} -{' '}
                  {factory.upper_bound}
                </div>
                <div>
                  <span className="font-semibold">Children Count:</span> {factory.children_count}
                </div>
                <div>
                  <span className="font-semibold">Created:</span>{' '}
                  {format(new Date(factory.created_at), 'yyyy-MM-dd HH:mm:ss')}
                </div>
                <div>
                  <span className="font-semibold">Updated:</span>{' '}
                  {format(new Date(factory.updated_at), 'yyyy-MM-dd HH:mm:ss')}
                </div>
              </div>
              <FactoryChildrenTable childrenList={factory.children ?? []} />
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
