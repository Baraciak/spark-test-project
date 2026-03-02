'use client';

import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Todos', href: '/todos' },
    { label: 'Boards', href: '/boards' },
  ];

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar
          sx={{
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
            px: { xs: 2, md: 4 },
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AutoAwesomeIcon sx={{ color: '#007AFF', fontSize: 24 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #007AFF, #5856D6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Spark
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  size="small"
                  sx={{
                    color: isActive ? '#007AFF' : 'rgba(0,0,0,0.5)',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 500,
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    position: 'relative',
                    background: isActive ? 'rgba(0, 122, 255, 0.08)' : 'transparent',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      color: '#007AFF',
                      background: 'rgba(0, 122, 255, 0.06)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, md: 4 },
          py: 4,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </>
  );
}
