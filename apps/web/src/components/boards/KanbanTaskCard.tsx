'use client';

import { Card, CardContent, Typography } from '@mui/material';
import type { Task } from '@/types/board';

interface KanbanTaskCardProps {
  task: Task;
  onClick: () => void;
}

export default function KanbanTaskCard({ task, onClick }: KanbanTaskCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.85)',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderColor: 'rgba(0, 122, 255, 0.15)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: '0.85rem',
            color: 'rgba(0,0,0,0.85)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {task.title}
        </Typography>
        {task.description && (
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(0,0,0,0.4)',
              fontSize: '0.75rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mt: 0.5,
              lineHeight: 1.4,
            }}
          >
            {task.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
