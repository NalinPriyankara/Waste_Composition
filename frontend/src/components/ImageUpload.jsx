import React, { useState } from 'react';
import { uploadImage } from '../services/api';
import { 
  Button, 
  CircularProgress, 
  Box, 
  Typography, 
  Paper,
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import ResultsDisplay from './ResultsDisplay';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null); // Clear previous results when new file is selected
      setError(null); // Clear previous errors
    }
  };

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
      <Typography variant="h5" gutterBottom align="center">
        Upload Waste Image
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="contained-button-file"
          type="file"
          onChange={handleFileChange}
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
        
        {file ? (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="body1" gutterBottom>
              Selected: {file.name}
            </Typography>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px',
                borderRadius: 4,
                border: '1px solid #ddd'
              }} 
            />
          </Box>
        ) : (
          <Box sx={{ 
            mb: 2, 
            textAlign: 'center',
            p: 4,
            border: '1px dashed #ddd',
            borderRadius: 1
          }}>
            <ImageIcon color="disabled" sx={{ fontSize: 60 }} />
            <Typography color="textSecondary">
              No image selected
            </Typography>
          </Box>
        )}
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!file || loading}
          fullWidth
          size="large"
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Analyzing...
            </>
          ) : (
            'Analyze Waste'
          )}
        </Button>
      </form>

      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      {result && <ResultsDisplay result={result} />}
    </Paper>
  );
};

export default ImageUpload;