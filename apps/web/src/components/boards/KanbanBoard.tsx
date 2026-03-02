'use client';

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import KanbanColumn from './KanbanColumn';
import AddColumnForm from './AddColumnForm';
import type { Board } from '@/types/board';

interface KanbanBoardProps {
  board: Board;
}

export default function KanbanBoard({ board }: KanbanBoardProps) {
  return (
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
        <Box
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
            <KanbanColumn
              key={column.id}
              column={column}
              boardId={board.id}
              index={index}
            />
          ))}
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
    </Box>
  );
}
