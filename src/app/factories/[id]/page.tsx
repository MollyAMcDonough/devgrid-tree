'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import FactoryForm from '@/app/components/FactoryForm';
import FactoryChildrenTable from '@/app/components/FactoryChildrenTable';
import type { Factory } from '@/types/factory';
import { io, Socket } from 'socket.io-client';

export default function FactoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [factory, setFactory] = useState<Factory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const fetchFactory = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
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
  };

  useEffect(() => {
    fetchFactory();

    // Hardcoded socket server URL for production
    const SOCKET_SERVER_URL = 'https://devgrid-tree-socket-server.onrender.com';
    console.log('SOCKET URL (hardcoded):', SOCKET_SERVER_URL);

    const socket: Socket = io(SOCKET_SERVER_URL);
    socket.on('factories-updated', fetchFactory);

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEditSubmit = async (data: Partial<Factory>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/factories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Failed to update factory');
        setSuccess(null);
        // Do NOT setEditMode(false) here!
      } else {
        setEditMode(false);
        const updated = await res.json();
        setFactory(updated);
        setSuccess('Factory updated successfully!');
      }
    } catch {
      setError('Network error');
      setSuccess(null);
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
        {success && (
          <div className="text-green-600 mb-2" role="alert">
            {success}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-12">
            <CircularProgress />
          </div>
        ) : !factory && error ? (
          // Only show this if the factory is truly not found
          <div className="text-red-500 mb-2" role="alert">
            {error}
          </div>
        ) : factory && editMode ? (
          <>
            {error && (
              <div className="text-red-500 mb-2" role="alert">
                {error}
              </div>
            )}
            <FactoryForm
              initialValues={factory}
              loading={loading}
              onSubmit={handleEditSubmit}
              hideChildrenCount
            />
          </>
        ) : factory ? (
          <div className="bg-white bg-opacity-95 rounded-lg shadow-lg p-8 text-gray-900">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{factory.name}</h1>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setEditMode(true);
                  setError(null);
                  setSuccess(null);
                }}
                className="!bg-blue-600 !text-white hover:!bg-blue-700"
                disabled={loading}
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
        ) : null}
      </div>
    </div>
  );
}
