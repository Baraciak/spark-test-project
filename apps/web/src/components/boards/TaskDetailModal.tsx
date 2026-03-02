'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useAppDispatch } from '@/store/hooks';
import { updateTask, removeTask } from '@/store/boardsSlice';
import type { Task } from '@/types/board';

interface TaskDetailModalProps {
  task: Task;
  boardId: string;
  open: boolean;
  onClose: () => void;
}

export default function TaskDetailModal({
  task,
  boardId,
  open,
  onClose,
}: TaskDetailModalProps) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
  }, [task]);

  const hasChanges =
    title.trim() !== task.title ||
    (description.trim() || null) !== (task.description || null);

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || saving) return;

    setSaving(true);
    try {
      await dispatch(
        updateTask({
          id: task.id,
          data: {
            title: trimmedTitle,
            description: description.trim() || undefined,
          },
          boardId,
        }),
      ).unwrap();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(removeTask({ id: task.id, boardId })).unwrap();
      setShowDeleteDialog(false);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
            fontWeight: 600,
            fontSize: '1.1rem',
          }}
        >
          Task Details
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={3}
            maxRows={8}
            sx={{ mb: 2 }}
          />
          <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.35)' }}>
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            justifyContent: 'space-between',
          }}
        >
          <Button
            startIcon={<DeleteOutlineIcon />}
            onClick={() => setShowDeleteDialog(true)}
            size="small"
            sx={{ color: '#FF3B30' }}
          >
            Delete
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={onClose}
              size="small"
              sx={{ color: 'rgba(0,0,0,0.5)' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              size="small"
              disabled={!title.trim() || !hasChanges || saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        title="Delete Task"
        message={`Delete "${task.title}"? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
