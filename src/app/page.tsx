'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, CircularProgress } from '@mui/material';
import FactoryTable from '@/app/components/FactoryTable';
import type { Factory } from '@/types/factory';
import { io, Socket } from 'socket.io-client';

export default function HomePage() {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch factories from API with error handling
  const fetchFactories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/factories');
      if (!res.ok) throw new Error('Failed to fetch factories');
      const data = await res.json();
      setFactories(data);
    } catch {
      setError('Failed to load factories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactories();

    // Log the socket server URL to verify it's injected
    console.log('SOCKET URL:', process.env.NEXT_PUBLIC_SOCKET_SERVER_URL);

    // Connect to Socket.IO server for real-time updates
    const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!);
    socket.on('factories-updated', fetchFactories);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black bg-opacity-70 bg-blend-overlay text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Factories</h1>
          <Link href="/factories/new">
            <Button
              variant="contained"
              color="primary"
              className="!bg-blue-600 !text-white hover:!bg-blue-700 shadow"
            >
              Add Factory
            </Button>
          </Link>
        </div>
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <CircularProgress />
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-8" role="alert">
              {error}
            </div>
          ) : (
            <FactoryTable factories={factories} />
          )}
        </div>
      </div>
    </div>
  );
}
