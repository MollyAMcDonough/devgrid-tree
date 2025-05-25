'use client';

import { useState } from 'react';
import { Button, TextField } from '@mui/material';

type FactoryFormProps = {
  /**
   * Called with form data when the form is valid and submitted.
   */
  onSubmit?: (data: {
    name: string;
    lower_bound: number;
    upper_bound: number;
    children_count: number;
  }) => void;
  /**
   * If true, hides the children count field (for edit mode).
   */
  hideChildrenCount?: boolean;
  /**
   * If true, disables form fields and shows loading state.
   */
  loading?: boolean;
  /**
   * Initial values for the form fields (for edit mode).
   */
  initialValues?: {
    name?: string;
    lower_bound?: number;
    upper_bound?: number;
    children_count?: number;
  };
};

/**
 * FactoryForm renders a form for creating or editing a factory.
 * Handles validation, loading, and error states.
 */
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

  // Helper to ensure only integers are set
  const handleIntChange =
    (setter: (n: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '') {
        setter(0);
        return;
      }
      const intValue = Math.floor(Number(value));
      setter(intValue);
    };

  const isChildrenCountValid =
    Number.isInteger(childrenCount) && childrenCount >= 0 && childrenCount <= 15;

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
    if (!isChildrenCountValid) {
      setError('Children count must be an integer between 0 and 15.');
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
        onChange={handleIntChange(setLowerBound)}
        required
        disabled={loading}
        variant="outlined"
        className="bg-white"
        slotProps={{
          input: {
            inputProps: { min: 0, max: 1000000, step: 1 },
          },
        }}
        helperText={`Enter an integer between 0 and 1,000,000.`}
      />
      <TextField
        label="Upper Bound"
        type="number"
        value={upperBound}
        onChange={handleIntChange(setUpperBound)}
        required
        disabled={loading}
        variant="outlined"
        className="bg-white"
        slotProps={{
          input: {
            inputProps: { min: 0, max: 1000000, step: 1 },
          },
        }}
        helperText={`Enter an integer between 0 and 1,000,000.`}
      />
      {!hideChildrenCount && (
        <TextField
          label="Children Count"
          type="number"
          value={childrenCount}
          onChange={handleIntChange(setChildrenCount)}
          required
          disabled={loading}
          variant="outlined"
          className="bg-white"
          slotProps={{
            input: {
              inputProps: { min: 0, max: 15, step: 1 },
            },
          }}
          error={!isChildrenCountValid}
          helperText={
            !isChildrenCountValid
              ? 'Children count must be an integer between 0 and 15.'
              : 'Enter an integer between 0 and 15.'
          }
        />
      )}
      {error && (
        <div className="text-red-600 text-sm" role="alert">
          {error}
        </div>
      )}
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
