import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { uploadImage } from '../services/api';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
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
      // Convert base64 to blob
      const blob = await fetch(imageSrc).then(res => res.blob());
      const formData = new FormData();
      formData.append('file', blob, 'webcam_capture.jpg');
      
      // Send to backend for detection
      const { data } = await uploadImage(formData);
      setResults(data);
    } catch (error) {
      console.error('Detection failed:', error);
      setError(error.response?.data?.error || 'Detection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Webcam Waste Detection
      </Typography>
      
      <Box sx={{ position: 'relative', mb: 2 }}>
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
            borderRadius: '8px'
          }}
        />
      </Box>

      <Button
        variant="contained"
        startIcon={<CameraAltIcon />}
        onClick={captureAndDetect}
        disabled={loading}
        fullWidth
        size="large"
      >
        {loading ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            Analyzing...
          </>
        ) : (
          'Capture & Detect'
        )}
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      {results ? (
        <ResultsDisplay result={results} />
      ) : capturedImage && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Captured Image
          </Typography>
          <img 
            src={capturedImage} 
            alt="Captured" 
            style={{ 
              maxWidth: '100%',
              border: '2px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <Typography color="textSecondary" sx={{ mt: 1 }}>
            Processing detection results...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WebcamCapture;