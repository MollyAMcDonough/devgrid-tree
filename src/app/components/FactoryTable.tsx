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
import type { Factory } from '@/types/factory';

type FactoryTableProps = {
  factories: Factory[];
};

export default function FactoryTable({ factories }: FactoryTableProps) {
  return (
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
            {/* Actions column for future menu/buttons */}
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
                {/* Placeholder for actions (view/edit/delete/regenerate) */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
