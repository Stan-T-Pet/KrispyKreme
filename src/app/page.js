import Link from 'next/link';
import { Box, Button, Typography } from '@mui/material';

export default function HomePage() {
  const pages = [
    { name: 'Manager Dashboard', path: '/manager' },
    { name: 'Customer Page', path: '/customer' },
    { name: 'Register', path: '/register' },
    { name: 'Login', path: '/login' },
    { name: 'View Cart', path: '/viewcart' },
    { name: 'Checkout', path: '/checkout' },
  ];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
      <Typography variant="h4" gutterBottom>
        Testing Navigation
      </Typography>
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        {pages.map((page) => (
          <Link key={page.path} href={page.path} passHref>
            <Button variant="contained" fullWidth>
              {page.name}
            </Button>
          </Link>
        ))}
      </Box>
    </Box>
  );
}