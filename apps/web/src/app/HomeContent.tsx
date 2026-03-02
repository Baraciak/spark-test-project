'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StorageIcon from '@mui/icons-material/Storage';
import WebIcon from '@mui/icons-material/Web';
import ApiIcon from '@mui/icons-material/Api';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

const techStack = [
  { name: 'Next.js 15', desc: 'App Router + SSR', icon: <WebIcon /> },
  { name: 'NestJS 11', desc: 'REST API + Swagger', icon: <ApiIcon /> },
  { name: 'TypeORM', desc: 'MariaDB ORM', icon: <StorageIcon /> },
  { name: 'Redux Toolkit', desc: 'State management', icon: <ViewInArIcon /> },
  { name: 'MUI 6', desc: 'Component library', icon: <WebIcon /> },
  { name: 'Tailwind CSS', desc: 'Utility-first CSS', icon: <WebIcon /> },
  { name: 'Docker', desc: 'Containerization', icon: <ViewInArIcon /> },
  { name: 'MariaDB', desc: 'SQL Database', icon: <StorageIcon /> },
];

export default function HomeContent() {
  return (
    <AppLayout>
      {/* Hero */}
      <Box sx={{ textAlign: 'center', pt: { xs: 6, md: 10 }, pb: 8 }}>
        <Typography
          variant="h1"
          className="animate-in"
          sx={{
            fontSize: { xs: '2.5rem', md: '4rem' },
            lineHeight: 1.1,
            mb: 2,
            background: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 30%, #818cf8 60%, #22d3ee 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Spark Test Project
        </Typography>
        <Typography
          variant="h5"
          className="animate-in"
          sx={{
            color: 'rgba(255,255,255,0.45)',
            fontWeight: 400,
            maxWidth: 500,
            mx: 'auto',
            animationDelay: '0.1s',
          }}
        >
          Full-stack demo showcasing modern web technologies
        </Typography>
      </Box>

      {/* CTA Card */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
        <Card
          component={Link}
          href="/todos"
          className="animate-in"
          sx={{
            textDecoration: 'none',
            width: '100%',
            maxWidth: 480,
            cursor: 'pointer',
            animationDelay: '0.15s',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(129, 140, 248, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(6, 182, 212, 0.12) 100%)',
              border: '1px solid rgba(129, 140, 248, 0.3)',
              '& .arrow': { transform: 'translateX(4px)' },
            },
          }}
        >
          <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                Todo App
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Full CRUD with Redux Toolkit + NestJS API
              </Typography>
            </Box>
            <ArrowForwardIcon
              className="arrow"
              sx={{ color: '#818cf8', fontSize: 28, transition: 'transform 0.25s ease' }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Tech Stack Grid */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="overline"
          className="animate-in"
          sx={{
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.15em',
            fontSize: '0.7rem',
            display: 'block',
            textAlign: 'center',
            mb: 3,
            animationDelay: '0.2s',
          }}
        >
          Tech Stack
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {techStack.map((tech, i) => (
            <Card
              key={tech.name}
              className="animate-in"
              sx={{
                animationDelay: `${0.25 + i * 0.05}s`,
                '&:hover': {
                  '& .tech-icon': { color: '#818cf8' },
                },
              }}
            >
              <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                <Box
                  className="tech-icon"
                  sx={{
                    color: 'rgba(255,255,255,0.2)',
                    mb: 1.5,
                    transition: 'color 0.25s ease',
                    '& svg': { fontSize: 28 },
                  }}
                >
                  {tech.icon}
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 0.25 }}
                >
                  {tech.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem' }}
                >
                  {tech.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </AppLayout>
  );
}
