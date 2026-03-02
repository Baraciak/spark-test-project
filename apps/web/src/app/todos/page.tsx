'use client';

import { useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import AppLayout from '@/components/layout/AppLayout';
import TodoForm from '@/components/todos/TodoForm';
import TodoList from '@/components/todos/TodoList';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTodos } from '@/store/todosSlice';

export default function TodosPage() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 640, mx: 'auto', pt: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box className="animate-in" sx={{ mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              background: 'linear-gradient(135deg, #e0e7ff, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            Todo List
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
            Manage your tasks with full CRUD operations
          </Typography>
        </Box>

        {/* Glass Container */}
        <Paper
          className="animate-in"
          sx={{
            p: { xs: 2, md: 3 },
            animationDelay: '0.1s',
            borderRadius: 3,
          }}
        >
          <TodoForm />

          {status === 'loading' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={28} sx={{ color: '#818cf8' }} />
            </Box>
          )}

          {status === 'failed' && (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                px: 2,
                mt: 2,
                borderRadius: 2,
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
              }}
            >
              <Typography variant="body2" sx={{ color: '#f87171' }}>
                {error || 'Failed to load todos. Make sure the API is running.'}
              </Typography>
            </Box>
          )}

          {status === 'succeeded' && <TodoList />}
        </Paper>
      </Box>
    </AppLayout>
  );
}
