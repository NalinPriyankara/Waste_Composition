import { Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WebcamCapture from '../components/WebcamCapture';

const Webcam = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        linear-gradient(45deg, rgb(189, 255, 181) 0%,rgb(194, 227, 251) 100%),
        url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="20" fill="none" stroke="%232196F3" stroke-width="0.5" stroke-opacity="0.1"/></svg>')
      `,
      backgroundSize: 'cover, 60px 60px',
      py: 4
    }}>
      <Container maxWidth="md">
        <div className="content-card">
          <WebcamCapture />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              sx={{ px: 4, py: 1.5, borderRadius: '8px' }}
            >
              Back to Home
            </Button>
          </Box>
        </div>
      </Container>
    </Box>
  );
};

export default Webcam;