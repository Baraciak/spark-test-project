'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppLayout from '@/components/layout/AppLayout';
import KanbanBoard from '@/components/boards/KanbanBoard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBoard } from '@/store/boardsSlice';

export default function BoardViewPage() {
  const params = useParams();
  const boardId = params.id as string;
  const dispatch = useAppDispatch();
  const { activeBoard, status, error } = useAppSelector((state) => state.boards);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoard(boardId));
    }
  }, [dispatch, boardId]);

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto', pt: { xs: 1, md: 2 }, px: { xs: 1, md: 2 } }}>
        {status === 'loading' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={28} sx={{ color: '#007AFF' }} />
          </Box>
        )}

        {status === 'failed' && (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              px: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: 'rgba(0,0,0,0.6)', mb: 2 }}
            >
              {error || 'Board not found'}
            </Typography>
            <Button
              component={Link}
              href="/boards"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              size="small"
            >
              Back to Boards
            </Button>
          </Box>
        )}

        {status === 'succeeded' && activeBoard && (
          <KanbanBoard board={activeBoard} />
        )}
      </Box>
    </AppLayout>
  );
}
