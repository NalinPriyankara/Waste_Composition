import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { uploadImage } from '../services/api';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const captureAndDetect = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setLoading(true);
    
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Webcam Waste Detection
      </Typography>
      
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ 
            facingMode: 'environment',
            width: 1280,
            height: 720
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
      >
        {loading ? <CircularProgress size={24} /> : 'Capture & Detect'}
      </Button>

      {capturedImage && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Detection Results
          </Typography>
          <img 
            src={results?.result_url ? `http://localhost:5000${results.result_url}` : capturedImage} 
            alt="Detection results" 
            style={{ 
              maxWidth: '100%',
              border: '2px solid',
              borderColor: results ? 'success.main' : 'grey.500',
              borderRadius: '4px'
            }}
          />
          
          {results?.detected_classes?.length > 0 ? (
            <Typography sx={{ mt: 2 }}>
              Detected: {results.detected_classes.join(', ')}
            </Typography>
          ) : (
            <Typography color="error" sx={{ mt: 2 }}>
              No waste objects detected
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default WebcamCapture;