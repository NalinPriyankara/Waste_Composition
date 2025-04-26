import React, { useState } from 'react';
import { uploadImage } from '../services/api';
import { Button, CircularProgress, Box, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const { data } = await uploadImage(formData);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Upload Waste Image
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="contained-button-file"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ mb: 2 }}
          >
            Select Image
          </Button>
        </label>
        
        {file && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            Selected: {file.name}
          </Typography>
        )}
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!file || loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Analyze Waste'}
        </Button>
      </form>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {result && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Detection Results
          </Typography>
          <img 
            src={`http://localhost:5000${result.result_url}`} 
            alt="Detection result" 
            style={{ maxWidth: '100%', borderRadius: 4 }}
          />
          <Typography sx={{ mt: 2 }}>
            Detected: {result.detected_classes.join(', ')}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ImageUpload;