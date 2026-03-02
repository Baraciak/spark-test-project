'use client';

import { useState, FormEvent } from 'react';
import { Box, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from '@/store/hooks';
import { addColumn } from '@/store/boardsSlice';

interface AddColumnFormProps {
  boardId: string;
}

export default function AddColumnForm({ boardId }: AddColumnFormProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      await dispatch(addColumn({ name: trimmed, boardId })).unwrap();
      setName('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', gap: 1 }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="New column..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.85rem' },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!name.trim() || submitting}
        sx={{
          minWidth: 36,
          width: 36,
          height: 36,
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
