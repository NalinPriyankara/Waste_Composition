import { Button, Container, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UploadIcon from '@mui/icons-material/CloudUpload';
import CameraIcon from '@mui/icons-material/CameraAlt';
import Background from '../components/Background';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Background>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              mb: 4
            }}
          >
            Automated Waste Classification System
          </Typography>
          <Typography 
            variant="h5"
            sx={{ 
              mb: 6,
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
            }}
          >
            AI-powered waste analysis for better recycling and sustainability
          </Typography>
        </Box>
        
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={5}>
            <Button
              variant="contained"
              size="large"
              startIcon={<UploadIcon />}
              fullWidth
              sx={{ 
                py: 3, 
                fontSize: '1.1rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(76, 175, 80, 0.6)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
              onClick={() => navigate('/upload')}
            >
              Upload Image
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CameraIcon />}
              fullWidth
              sx={{ 
                py: 3, 
                fontSize: '1.1rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2196F3, #1565C0)',
                boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(33, 150, 243, 0.6)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
              onClick={() => navigate('/webcam')}
            >
              Use Webcam
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Background>
  );
};

export default Home;