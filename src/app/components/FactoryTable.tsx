import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Factory } from '@/types/factory';
import ActionMenu from './ActionMenu';
import ConfirmDialog from './ConfirmDialog';

type FactoryTableProps = {
  factories: Factory[];
};

export default function FactoryTable({ factories }: FactoryTableProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const handleView = (id: number) => {
    router.push(`/factories/${id}`);
  };

  const handleRegenerate = async (id: number) => {
    await fetch(`/api/factories/${id}/generate`, { method: 'POST' });
    router.push(`/factories/${id}`); // Redirect to the detail page
  };

  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId !== null) {
      await fetch(`/api/factories/${pendingDeleteId}`, { method: 'DELETE' });
      setConfirmOpen(false);
      setPendingDeleteId(null);
      window.location.reload();
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Lower Bound</TableCell>
              <TableCell align="right">Upper Bound</TableCell>
              <TableCell align="right">Children Count</TableCell>
              <TableCell align="right">Created</TableCell>
              <TableCell align="right">Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {factories.map((factory) => (
              <TableRow key={factory.id}>
                <TableCell>{factory.name}</TableCell>
                <TableCell align="right">{factory.lower_bound}</TableCell>
                <TableCell align="right">{factory.upper_bound}</TableCell>
                <TableCell align="right">{factory.children_count}</TableCell>
                <TableCell align="right">
                  {format(new Date(factory.created_at), 'yyyy-MM-dd HH:mm:ss')}
                </TableCell>
                <TableCell align="right">
                  {format(new Date(factory.updated_at), 'yyyy-MM-dd HH:mm:ss')}
                </TableCell>
                <TableCell align="right">
                  <ActionMenu
                    onView={() => handleView(factory.id)}
                    onRegenerate={() => handleRegenerate(factory.id)}
                    onDelete={() => handleDelete(factory.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Factory"
        message="Are you sure you want to delete this factory? This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
