import { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type ActionMenuProps = {
  onView: () => void;
  onRegenerate: () => void;
  onDelete: () => void;
  disabled?: boolean;
};

export default function ActionMenu({ onView, onRegenerate, onDelete, disabled }: ActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <>
      <IconButton aria-label="more" onClick={handleOpen} size="small" disabled={disabled}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleAction(onView)}>View</MenuItem>
        <MenuItem onClick={() => handleAction(onRegenerate)}>Regenerate Children</MenuItem>
        <MenuItem onClick={() => handleAction(onDelete)} sx={{ color: 'red' }}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
