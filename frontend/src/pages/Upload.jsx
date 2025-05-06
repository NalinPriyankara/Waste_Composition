import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import ImageUpload from '../components/ImageUpload';
import Background from '../components/Background';

const Upload = () => {
  const navigate = useNavigate();

  return (
    <Background type="pattern">
      <Box className="content-card">
        <ImageUpload />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Background>
  );
};

export default Upload;