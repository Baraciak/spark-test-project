'use client';

import { Box, Checkbox, Typography, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Todo } from '@/types/todo';
import { useAppDispatch } from '@/store/hooks';
import { toggleTodo, removeTodo } from '@/store/todosSlice';

interface TodoItemProps {
  todo: Todo;
  index: number;
}

export default function TodoItem({ todo, index }: TodoItemProps) {
  const dispatch = useAppDispatch();

  return (
    <Box
      className="animate-in"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: 2,
        background: 'rgba(0,0,0,0.02)',
        border: '1px solid rgba(0,0,0,0.04)',
        animationDelay: `${index * 0.03}s`,
        transition: 'all 0.25s ease',
        '&:hover': {
          background: 'rgba(0,0,0,0.04)',
          borderColor: 'rgba(0,0,0,0.06)',
          '& .delete-btn': {
            opacity: 1,
          },
        },
      }}
    >
      <Checkbox
        checked={todo.completed}
        onChange={() => dispatch(toggleTodo(todo))}
        size="small"
        sx={{
          p: 0.5,
          '&.Mui-checked': {
            color: '#007AFF',
          },
        }}
      />

      <Typography
        variant="body2"
        sx={{
          flex: 1,
          fontSize: '0.9rem',
          color: todo.completed ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.85)',
          textDecoration: todo.completed ? 'line-through' : 'none',
          transition: 'all 0.25s ease',
        }}
      >
        {todo.title}
      </Typography>

      <IconButton
        className="delete-btn"
        size="small"
        onClick={() => dispatch(removeTodo(todo.id))}
        sx={{
          opacity: 0,
          color: 'rgba(0,0,0,0.25)',
          p: 0.5,
          transition: 'all 0.2s ease',
          '&:hover': {
            color: '#FF3B30',
            background: 'rgba(255, 59, 48, 0.08)',
          },
        }}
      >
        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}
