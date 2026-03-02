'use client';

import { Card, CardContent, Box, Typography } from '@mui/material';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Board } from '@/types/board';

interface BoardCardProps {
  board: Board;
  index: number;
}

export default function BoardCard({ board, index }: BoardCardProps) {
  return (
    <Card
      component={Link}
      href={`/boards/${board.id}`}
      className="animate-in"
      sx={{
        textDecoration: 'none',
        cursor: 'pointer',
        animationDelay: `${index * 0.05}s`,
        background:
          'linear-gradient(135deg, rgba(0, 122, 255, 0.06) 0%, rgba(88, 86, 214, 0.04) 100%)',
        border: '1px solid rgba(0, 122, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.25s ease',
        '&:hover': {
          background:
            'linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.07) 100%)',
          border: '1px solid rgba(0, 122, 255, 0.2)',
          transform: 'translateY(-2px)',
          '& .arrow': { transform: 'translateX(4px)' },
        },
      }}
    >
      <CardContent
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          '&:last-child': { pb: 3 },
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              color: 'rgba(0,0,0,0.87)',
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {board.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(0,0,0,0.45)',
              fontSize: '0.8rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {board.description || 'No description'}
          </Typography>
        </Box>
        <ArrowForwardIcon
          className="arrow"
          sx={{
            color: '#007AFF',
            fontSize: 22,
            ml: 2,
            flexShrink: 0,
            transition: 'transform 0.25s ease',
          }}
        />
      </CardContent>
    </Card>
  );
}
