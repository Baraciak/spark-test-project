'use client';

import { useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import AddColumnForm from './AddColumnForm';
import { useAppDispatch } from '@/store/hooks';
import {
  moveTaskOptimistic,
  moveTask,
  reorderColumnsOptimistic,
  reorderColumns,
} from '@/store/boardsSlice';
import type { Board } from '@/types/board';

interface KanbanBoardProps {
  board: Board;
}

export default function KanbanBoard({ board }: KanbanBoardProps) {
  const dispatch = useAppDispatch();

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, type, draggableId } = result;

      // Dropped outside a droppable area
      if (!destination) return;

      // Dropped in same position
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      if (type === 'COLUMN') {
        // Column reorder
        dispatch(
          reorderColumnsOptimistic({
            sourceIndex: source.index,
            destinationIndex: destination.index,
          }),
        );

        const newColumns = [...board.columns];
        const [moved] = newColumns.splice(source.index, 1);
        newColumns.splice(destination.index, 0, moved);

        dispatch(
          reorderColumns({
            boardId: board.id,
            columnIds: newColumns.map((c) => c.id),
          }),
        );
        return;
      }

      // Task drag (type === 'TASK')
      dispatch(
        moveTaskOptimistic({
          taskId: draggableId,
          sourceColumnId: source.droppableId,
          sourceIndex: source.index,
          destinationColumnId: destination.droppableId,
          destinationIndex: destination.index,
        }),
      );

      dispatch(
        moveTask({
          id: draggableId,
          data: {
            columnId: destination.droppableId,
            order: destination.index,
          },
          boardId: board.id,
        }),
      );
    },
    [dispatch, board.id, board.columns],
  );
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
    <Box>
      {/* Header */}
      <Box
        className="animate-in"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
        }}
      >
        <Button
          component={Link}
          href="/boards"
          size="small"
          startIcon={<ArrowBackIcon />}
          sx={{
            color: '#007AFF',
            minWidth: 'auto',
            fontWeight: 500,
            fontSize: '0.85rem',
          }}
        >
          Boards
        </Button>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {board.name}
          </Typography>
          {board.description && (
            <Typography
              variant="body2"
              sx={{ color: 'rgba(0,0,0,0.45)', fontSize: '0.8rem' }}
            >
              {board.description}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Columns */}
      {board.columns.length === 0 ? (
        <Box
          className="animate-in"
          sx={{
            textAlign: 'center',
            py: 8,
            animationDelay: '0.1s',
          }}
        >
          <ViewColumnIcon
            sx={{ fontSize: 48, color: 'rgba(0,0,0,0.15)', mb: 2 }}
          />
          <Typography
            variant="h6"
            sx={{ color: 'rgba(0,0,0,0.4)', mb: 1, fontWeight: 500 }}
          >
            No columns yet
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(0,0,0,0.3)', mb: 3 }}
          >
            Add your first column to get started
          </Typography>
          <Box sx={{ maxWidth: 300, mx: 'auto' }}>
            <AddColumnForm boardId={board.id} />
          </Box>
        </Box>
      ) : (
        <Droppable
          droppableId="board-columns"
          type="COLUMN"
          direction="horizontal"
        >
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 2,
                minHeight: 'calc(100vh - 200px)',
                alignItems: 'flex-start',
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0,0,0,0.04)',
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0,0,0,0.15)',
                  borderRadius: 3,
                },
              }}
            >
              {board.columns.map((column, index) => (
                <Draggable
                  key={column.id}
                  draggableId={column.id}
                  index={index}
                >
                  {(dragProvided, dragSnapshot) => (
                    <Box
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      sx={{
                        opacity: dragSnapshot.isDragging ? 0.9 : 1,
                        transform: dragSnapshot.isDragging
                          ? 'rotate(1deg)'
                          : undefined,
                      }}
                    >
                      <KanbanColumn
                        column={column}
                        boardId={board.id}
                        index={index}
                        dragHandleProps={dragProvided.dragHandleProps}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <Box
                className="animate-in"
                sx={{
                  minWidth: 280,
                  flexShrink: 0,
                  animationDelay: `${board.columns.length * 0.05}s`,
                }}
              >
                <AddColumnForm boardId={board.id} />
              </Box>
            </Box>
          )}
        </Droppable>
      )}
    </Box>
    </DragDropContext>
  );
}
