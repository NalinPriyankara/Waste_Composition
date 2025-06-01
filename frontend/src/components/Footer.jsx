import { Box, Typography, Container, Link, IconButton, Stack, Divider } from '@mui/material';
import { GitHub, LinkedIn, Twitter } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#fdfdfd',
        color: '#333',
        pt: 6,
        pb: 4,
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        {/* App Mission */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          ♻️ Smarter Waste. Cleaner Planet.
        </Typography>

        <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
          AI-powered waste classification for a more sustainable future.
        </Typography>

        {/* Social Media */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          <IconButton
            component="a"
            href="https://github.com/NalinPriyankara"
            target="_blank"
            rel="noopener"
            sx={{
              color: '#333',
              transition: 'transform 0.3s, color 0.3s',
              '&:hover': {
                transform: 'scale(1.2)',
                color: '#000',
              },
            }}
          >
            <GitHub fontSize="medium" />
          </IconButton>

          <IconButton
            component="a"
            href="https://www.linkedin.com/in/nalin-priyankara-079aa524b/"
            target="_blank"
            rel="noopener"
            sx={{
              color: '#0077b5',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.2)',
              },
            }}
          >
            <LinkedIn fontSize="medium" />
          </IconButton>

          <IconButton
            component="a"
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener"
            sx={{
              color: '#1da1f2',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.2)',
              },
            }}
          >
            <Twitter fontSize="medium" />
          </IconButton>
        </Stack>

        {/* Contact */}
        <Typography variant="body2" sx={{ mb: 1 }}>
          📧 <Link href="mailto:contact@wasteapp.com" underline="hover">contact@wasteapp.com</Link>
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Footer Bottom */}
        <Typography variant="caption" display="block" sx={{ color: '#999' }}>
          © {new Date().getFullYear()} Waste Classification App · All rights reserved.
        </Typography>

        <Typography variant="caption" sx={{ color: '#bbb', mt: 1 }}>
          Background illustrations by{' '}
          <Link href="https://www.freepik.com" target="_blank" rel="noopener" color="inherit">
            Freepik
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
