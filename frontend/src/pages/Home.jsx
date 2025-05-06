import { Button, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UploadIcon from '@mui/icons-material/CloudUpload';
import CameraIcon from '@mui/icons-material/CameraAlt';
import Background from '../components/Background';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Background type="gradient">
      <Box className="content-card">
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Automated Waste Classification System
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Upload an image or use your webcam to automatically classify waste
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<UploadIcon />}
              fullWidth
              sx={{ py: 3, fontSize: '1.1rem' }}
              onClick={() => navigate('/upload')}
            >
              Upload Image
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<CameraIcon />}
              fullWidth
              sx={{ py: 3, fontSize: '1.1rem' }}
              onClick={() => navigate('/webcam')}
            >
              Use Webcam
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Background>
  );
};

export default Home;