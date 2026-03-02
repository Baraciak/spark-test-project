'use client';

import { useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import AppLayout from '@/components/layout/AppLayout';
import BoardForm from '@/components/boards/BoardForm';
import BoardList from '@/components/boards/BoardList';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBoards } from '@/store/boardsSlice';

export default function BoardsPage() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.boards);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBoards());
    }
  }, [dispatch, status]);

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 900, mx: 'auto', pt: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box className="animate-in" sx={{ mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              background: 'linear-gradient(135deg, #1C1C1E, #007AFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            Kanban Boards
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.45)' }}>
            Manage your projects with Kanban boards
          </Typography>
        </Box>

        {/* Form */}
        <Paper
          className="animate-in"
          sx={{
            p: { xs: 2, md: 3 },
            animationDelay: '0.1s',
            borderRadius: 3,
            mb: 3,
          }}
        >
          <BoardForm />
        </Paper>

        {/* Content */}
        {status === 'loading' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} sx={{ color: '#007AFF' }} />
          </Box>
        )}

        {status === 'failed' && (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              px: 2,
              borderRadius: 2,
              background: 'rgba(255, 59, 48, 0.06)',
              border: '1px solid rgba(255, 59, 48, 0.12)',
            }}
          >
            <Typography variant="body2" sx={{ color: '#FF3B30' }}>
              {error || 'Failed to load boards. Make sure the API is running.'}
            </Typography>
          </Box>
        )}

        {status === 'succeeded' && <BoardList />}
      </Box>
    </AppLayout>
  );
}
