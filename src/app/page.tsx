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

  // Fetch factories from API
  const fetchFactories = async () => {
    setLoading(true);
    const res = await fetch('/api/factories');
    const data = await res.json();
    setFactories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFactories();

    // Connect to Socket.IO server
    const socket: Socket = io('http://localhost:4000');
    socket.on('factories-updated', fetchFactories);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black bg-opacity-70 bg-blend-overlay text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Factories</h1>
          <Button
            component={Link}
            href="/factories/new"
            variant="contained"
            color="primary"
            className="!bg-blue-600 !text-white hover:!bg-blue-700 shadow"
          >
            Add Factory
          </Button>
        </div>
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <CircularProgress />
            </div>
          ) : (
            <FactoryTable factories={factories} />
          )}
        </div>
      </div>
    </div>
  );
}
