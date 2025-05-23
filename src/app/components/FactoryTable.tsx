import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Factory } from '@/types/factory';

type FactoryTableProps = {
  factories: Factory[];
};

export default function FactoryTable({ factories }: FactoryTableProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuFactoryId, setMenuFactoryId] = useState<number | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, factoryId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuFactoryId(factoryId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuFactoryId(null);
  };

  const handleView = () => {
    if (menuFactoryId !== null) {
      router.push(`/factories/${menuFactoryId}`);
    }
    handleMenuClose();
  };

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
                <IconButton
                  aria-label="more"
                  onClick={(e) => handleMenuOpen(e, factory.id)}
                  size="small"
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && menuFactoryId === factory.id}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleView}>View</MenuItem>
                  {/* Add more actions here as needed */}
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
