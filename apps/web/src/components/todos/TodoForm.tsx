'use client';

import { useState, FormEvent } from 'react';
import { Box, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from '@/store/hooks';
import { addTodo } from '@/store/todosSlice';

export default function TodoForm() {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      await dispatch(addTodo(trimmed)).unwrap();
      setTitle('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', gap: 1.5, mb: 3 }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: 44,
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!title.trim() || submitting}
        sx={{
          minWidth: 44,
          width: 44,
          height: 44,
          p: 0,
          borderRadius: 2,
          flexShrink: 0,
        }}
      >
        <AddIcon fontSize="small" />
      </Button>
    </Box>
  );
}
