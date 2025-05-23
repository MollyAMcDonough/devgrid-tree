'use client';

import { useState } from 'react';
import { Button, TextField } from '@mui/material';

type FactoryFormProps = {
  onSubmit?: (data: {
    name: string;
    lower_bound: number;
    upper_bound: number;
    children_count: number;
  }) => void;
  hideChildrenCount?: boolean;
  loading?: boolean;
  initialValues?: {
    name?: string;
    lower_bound?: number;
    upper_bound?: number;
    children_count?: number;
  };
};

export default function FactoryForm({
  onSubmit,
  loading = false,
  initialValues = {},
  hideChildrenCount = false,
}: FactoryFormProps) {
  const [name, setName] = useState(initialValues.name || '');
  const [lowerBound, setLowerBound] = useState(initialValues.lower_bound ?? 0);
  const [upperBound, setUpperBound] = useState(initialValues.upper_bound ?? 0);
  const [childrenCount, setChildrenCount] = useState(initialValues.children_count ?? 0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!Number.isInteger(lowerBound) || !Number.isInteger(upperBound) || lowerBound > upperBound) {
      setError('Bounds must be integers and lower bound ≤ upper bound.');
      return;
    }
    if (!Number.isInteger(childrenCount) || childrenCount < 0) {
      setError('Children count must be a non-negative integer.');
      return;
    }

    onSubmit?.({
      name: name.trim(),
      lower_bound: lowerBound,
      upper_bound: upperBound,
      children_count: childrenCount,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white bg-opacity-95 rounded-lg shadow-lg p-8 flex flex-col gap-4"
    >
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Factory Details</h2>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        disabled={loading}
        variant="outlined"
        className="bg-white"
      />
      <TextField
        label="Lower Bound"
        type="number"
        value={lowerBound}
        onChange={(e) => setLowerBound(Number(e.target.value))}
        required
        disabled={loading}
        variant="outlined"
        className="bg-white"
      />
      <TextField
        label="Upper Bound"
        type="number"
        value={upperBound}
        onChange={(e) => setUpperBound(Number(e.target.value))}
        required
        disabled={loading}
        variant="outlined"
        className="bg-white"
      />
      {!hideChildrenCount && (
        <TextField
          label="Children Count"
          type="number"
          value={childrenCount}
          onChange={(e) => setChildrenCount(Number(e.target.value))}
          required
          disabled={loading}
          variant="outlined"
          className="bg-white"
        />
      )}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        className="!bg-blue-600 !text-white hover:!bg-blue-700 mt-2"
      >
        {loading ? 'Saving...' : 'Save Factory'}
      </Button>
    </form>
  );
}
