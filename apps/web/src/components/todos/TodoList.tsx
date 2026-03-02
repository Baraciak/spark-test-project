'use client';

import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import { useAppSelector } from '@/store/hooks';
import TodoItem from './TodoItem';

export default function TodoList() {
  const todos = useAppSelector((state) => state.todos.items);

  if (todos.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 2,
        }}
      >
        <InboxIcon
          sx={{
            fontSize: 48,
            color: 'rgba(255,255,255,0.1)',
            mb: 2,
          }}
        />
        <Typography
          variant="body1"
          sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}
        >
          No todos yet
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'rgba(255,255,255,0.2)', mt: 0.5 }}
        >
          Add one above to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {todos.map((todo, index) => (
        <TodoItem key={todo.id} todo={todo} index={index} />
      ))}
    </Box>
  );
}
