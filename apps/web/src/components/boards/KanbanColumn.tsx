'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import KanbanTaskCard from './KanbanTaskCard';
import TaskDetailModal from './TaskDetailModal';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useAppDispatch } from '@/store/hooks';
import {
  updateColumn,
  removeColumn,
  addTask,
} from '@/store/boardsSlice';
import type { BoardColumn, Task } from '@/types/board';

interface KanbanColumnProps {
  column: BoardColumn;
  boardId: string;
  index: number;
}

export default function KanbanColumn({ column, boardId, index }: KanbanColumnProps) {
  const dispatch = useAppDispatch();

  // Inline edit column name
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(column.name);

  // Add task form
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Task detail modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleSaveName = async () => {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === column.name) {
      setEditName(column.name);
      setIsEditingName(false);
      return;
    }
    await dispatch(updateColumn({ id: column.id, data: { name: trimmed }, boardId }));
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditName(column.name);
      setIsEditingName(false);
    }
  };

  const handleDeleteColumn = async () => {
    setDeleting(true);
    try {
      await dispatch(removeColumn({ id: column.id, boardId })).unwrap();
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed || addingTask) return;

    setAddingTask(true);
    try {
      await dispatch(
        addTask({ data: { title: trimmed, columnId: column.id }, boardId }),
      ).unwrap();
      setNewTaskTitle('');
      setIsAddingTask(false);
    } finally {
      setAddingTask(false);
    }
  };

  return (
    <Paper
      className="animate-in"
      sx={{
        width: 300,
        minWidth: 300,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 200px)',
        animationDelay: `${index * 0.05}s`,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {isEditingName ? (
          <TextField
            autoFocus
            size="small"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={handleNameKeyDown}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem' },
            }}
          />
        ) : (
          <Typography
            variant="subtitle2"
            onClick={() => {
              setEditName(column.name);
              setIsEditingName(true);
            }}
            sx={{
              flex: 1,
              fontWeight: 600,
              fontSize: '0.85rem',
              color: 'rgba(0,0,0,0.7)',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              '&:hover': { color: '#007AFF' },
            }}
          >
            {column.name}
            <Box
              component="span"
              sx={{
                ml: 1,
                color: 'rgba(0,0,0,0.3)',
                fontWeight: 400,
                fontSize: '0.75rem',
              }}
            >
              {column.tasks.length}
            </Box>
          </Typography>
        )}
        <IconButton
          size="small"
          onClick={() => setShowDeleteDialog(true)}
          sx={{
            ml: 0.5,
            opacity: 0.4,
            '&:hover': { opacity: 1, color: '#FF3B30' },
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Tasks List */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 1.5,
          py: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: 2,
          },
        }}
      >
        {column.tasks.map((task) => (
          <KanbanTaskCard
            key={task.id}
            task={task}
            onClick={() => setSelectedTask(task)}
          />
        ))}
      </Box>

      {/* Add Task */}
      <Box sx={{ px: 1.5, py: 1, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
        {isAddingTask ? (
          <Box component="form" onSubmit={handleAddTask}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                }
              }}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.85rem' },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={!newTaskTitle.trim() || addingTask}
                sx={{ fontSize: '0.75rem', py: 0.5, px: 2 }}
              >
                Add
              </Button>
              <IconButton
                size="small"
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Button
            fullWidth
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setIsAddingTask(true)}
            sx={{
              justifyContent: 'flex-start',
              color: 'rgba(0,0,0,0.4)',
              fontSize: '0.8rem',
              fontWeight: 500,
              '&:hover': { color: '#007AFF', background: 'rgba(0, 122, 255, 0.06)' },
            }}
          >
            Add task
          </Button>
        )}
      </Box>

      {/* Delete Column Dialog */}
      <ConfirmDeleteDialog
        open={showDeleteDialog}
        title="Delete Column"
        message={`Delete "${column.name}" and all its tasks? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDeleteColumn}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          boardId={boardId}
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </Paper>
  );
}
