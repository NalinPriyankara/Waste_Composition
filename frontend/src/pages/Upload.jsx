import { Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

const Upload = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        linear-gradient(135deg,rgb(189, 255, 181) 0%,rgb(194, 227, 251) 100%),
        url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M30,10 L50,30 L70,10" fill="none" stroke="%234CAF50" stroke-width="0.5" stroke-opacity="0.1"/></svg>')
      `,
      backgroundSize: 'cover, 50px 50px',
      py: 4
    }}>
      <Container maxWidth="md">
        <div className="content-card">
          <ImageUpload />
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

export default Upload;