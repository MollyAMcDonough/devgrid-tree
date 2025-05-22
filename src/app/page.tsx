'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import FactoryTable from '@/app/components/FactoryTable';
import type { Factory } from '@/types/factory';

export default function FactoriesPage() {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFactories() {
      setLoading(true);
      const res = await fetch('/api/factories');
      const data = await res.json();
      setFactories(data);
      setLoading(false);
    }
    fetchFactories();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Factories</Typography>
        <Button variant="contained" color="primary" href="/factories/new">
          Add Factory
        </Button>
      </Box>
      {loading ? <CircularProgress /> : <FactoryTable factories={factories} />}
    </Box>
  );
}
