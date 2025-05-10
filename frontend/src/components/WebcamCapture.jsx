import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { uploadImage } from '../services/api';
import { 
  Button, 
  Box,
  Container,
  Typography, 
  CircularProgress, 
  Paper,
  Alert
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import ResultsDisplay from './ResultsDisplay';

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const captureAndDetect = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setLoading(true);
    setError(null);

    try {
      const blob = await fetch(imageSrc).then(res => res.blob());
      const formData = new FormData();
      formData.append('file', blob, 'webcam_capture.jpg');

      const { data } = await uploadImage(formData);
      setResults(data);
    } catch (error) {
      console.error('Detection failed:', error);
      setError(error.response?.data?.error || 'Detection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setResults(null);
    setError(null);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)'
      }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ 
          mb: 3,
          fontWeight: 'bold',
          color: 'var(--dark)',
          background: 'linear-gradient(to right, var(--primary), var(--secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Real-time Waste Detection
        </Typography>

        <Box sx={{ 
          position: 'relative', 
          mb: 4,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
        }}>
          <Webcam 
            audio={false} 
            ref={webcamRef} 
            screenshotFormat="image/jpeg"
            videoConstraints={{ 
              facingMode: 'environment', 
              width: { ideal: 1280 }, 
              height: { ideal: 720 } 
            }}
            style={{ 
              width: '100%',
              display: capturedImage ? 'none' : 'block'
            }}
          />
          
          {capturedImage && !results && (
            <img
              src={capturedImage}
              alt="Captured"
              style={{
                width: '100%',
                display: 'block'
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {!capturedImage ? (
            <Button
              variant="contained"
              startIcon={<CameraAltIcon />}
              onClick={captureAndDetect}
              disabled={loading}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, var(--secondary), #1565C0)',
                '&:hover': {
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)'
                }
              }}
            >
              Capture & Analyze
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={resetCapture}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '1.1rem'
                }}
              >
                Retake
              </Button>
              {!results && (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<CameraAltIcon />}
                  onClick={captureAndDetect}
                  disabled={loading}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontSize: '1.1rem'
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Again'
                  )}
                </Button>
              )}
            </>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 3, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        {results && (
          <Box sx={{ mt: 4 }}>
            <ResultsDisplay result={results} />
          </Box>
        )}

        {capturedImage && !results && !loading && (
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              mt: 3,
              color: 'text.secondary',
              fontStyle: 'italic'
            }}
          >
            Processing waste composition analysis...
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default WebcamCapture;