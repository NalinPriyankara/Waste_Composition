import React, { useState } from 'react';
import { uploadImage } from '../services/api';
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  Paper,
  Alert
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Cancel as CancelIcon
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
      setResult(null);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
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
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ 
      p: 4, 
      width: '100%',
      maxWidth: 700,
      borderRadius: '16px',
      background: 'rgba(255, 255, 255, 0.98)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ 
        mb: 3,
        fontWeight: 'bold',
        color: 'var(--dark)',
        background: 'linear-gradient(to right, var(--primary), var(--secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
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
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ 
              mb: 3,
              py: 2,
              border: '2px dashed',
              borderColor: 'var(--primary)',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: 'rgba(76, 175, 80, 0.05)',
                borderColor: 'var(--secondary)'
              }
            }}
          >
            Select Waste Image
          </Button>
        </label>

        {file ? (
          <Box sx={{ 
            mb: 3, 
            textAlign: 'center',
            position: 'relative'
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1
            }}>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                Selected: {file.name}
              </Typography>
              <Button 
                size="small" 
                startIcon={<CancelIcon />}
                onClick={handleRemoveFile}
                sx={{ color: 'error.main' }}
              >
                Remove
              </Button>
            </Box>
            
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}
            />
          </Box>
        ) : (
          <Box sx={{
            mb: 3,
            textAlign: 'center',
            p: 4,
            border: '2px dashed #e0e0e0',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }}>
            <ImageIcon color="disabled" sx={{ fontSize: 60, mb: 1 }} />
            <Typography color="textSecondary" variant="body1">
              No image selected
            </Typography>
            <Typography color="textSecondary" variant="caption" sx={{ mt: 1 }}>
              Supported formats: JPG, PNG, WEBP
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
          sx={{
            py: 1.5,
            borderRadius: '12px',
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, var(--primary), #2E7D32)',
            '&:hover': {
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)'
            },
            '&:disabled': {
              background: '#e0e0e0'
            }
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
              Analyzing Waste...
            </>
          ) : (
            'Analyze Waste Composition'
          )}
        </Button>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      {result && <ResultsDisplay result={result} />}
    </Paper>
  );
};

export default ImageUpload;