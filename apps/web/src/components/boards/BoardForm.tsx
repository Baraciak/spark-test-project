'use client';

import { useState, FormEvent } from 'react';
import { Box, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from '@/store/hooks';
import { addBoard } from '@/store/boardsSlice';

export default function BoardForm() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      await dispatch(addBoard({ name: trimmed })).unwrap();
      setName('');
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
        placeholder="New board name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: 44,
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!name.trim() || submitting}
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
