import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button, Box, Typography, Paper } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    // Here you would send the image to your backend
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Real-time Waste Detection
      </Typography>
      
      <Box sx={{ 
        position: 'relative',
        width: '100%',
        height: 0,
        paddingBottom: '56.25%',
        mb: 3,
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'environment' }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
      </Box>

      <Button
        variant="contained"
        startIcon={<CameraAltIcon />}
        onClick={capture}
        fullWidth
        size="large"
      >
        Capture Image
      </Button>

      {capturedImage && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Captured Image
          </Typography>
          <img 
            src={capturedImage} 
            alt="Captured" 
            style={{ maxWidth: '100%', borderRadius: 4 }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default WebcamCapture;