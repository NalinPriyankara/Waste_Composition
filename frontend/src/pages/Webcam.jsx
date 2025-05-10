import { Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WebcamCapture from '../components/WebcamCapture';

const Webcam = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <div className="content-card">
        <WebcamCapture />
        
        {/* Matching "Back to Home" button */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mt: 4
        }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            Back to Home
          </Button>
        </Box>
      </div>
    </Container>
  );
};

export default Webcam;