import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import ImageUpload from '../components/ImageUpload';

const Upload = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <ImageUpload />
      
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
        >
          Back to Home
        </Button>
      </Box>
    </div>
  );
};

export default Upload;