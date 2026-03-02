'use client';

import { Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useAppSelector } from '@/store/hooks';
import BoardCard from './BoardCard';

export default function BoardList() {
  const boards = useAppSelector((state) => state.boards.items);

  if (boards.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
        <DashboardIcon
          sx={{ fontSize: 48, color: 'rgba(0,0,0,0.1)', mb: 2 }}
        />
        <Typography
          variant="body1"
          sx={{ color: 'rgba(0,0,0,0.35)', fontWeight: 500 }}
        >
          No boards yet
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'rgba(0,0,0,0.25)', mt: 0.5 }}
        >
          Create one above to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 2,
      }}
    >
      {boards.map((board, index) => (
        <BoardCard key={board.id} board={board} index={index} />
      ))}
    </Box>
  );
}
