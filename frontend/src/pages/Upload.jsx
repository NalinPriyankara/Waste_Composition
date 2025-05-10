import { Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

const Upload = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <div className="content-card">
        <ImageUpload />
        
        {/* Consistent Back to Home Button */}
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
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Back to Home
          </Button>
        </Box>
      </div>
    </Container>
  );
};

export default Upload;