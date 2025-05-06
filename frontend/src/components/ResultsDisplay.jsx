import React from 'react';
import { 
  Box, 
  Typography, 
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import { 
  Delete as RecycleIcon,
  Spa as OrganicIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const ResultsDisplay = ({ result }) => {
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom align="center">
        Detection Results
      </Typography>
      
      <Box sx={{
        background: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <img 
          src={`http://localhost:5000${result.result_url}`} 
          alt="Detection result" 
          style={{ 
            maxWidth: '100%', 
            borderRadius: 4,
            border: '1px solid #ddd'
          }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Detected Items:
      </Typography>
      <List dense sx={{ mb: 2 }}>
        {result.detected_classes.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={capitalize(item)} />
            <Chip 
              icon={item === 'organic' ? <OrganicIcon /> : <RecycleIcon />}
              label={item === 'organic' ? 'Organic' : 'Recyclable'}
              color={item === 'organic' ? 'success' : 'primary'}
              size="small"
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Waste Composition:
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            <OrganicIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
            Organic: {result.waste_percentages.organic}%
          </Typography>
          <Typography variant="body2">
            <RecycleIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
            Recyclable: {result.waste_percentages.recyclable}%
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden' }}>
          <Box 
            sx={{ 
              width: `${result.waste_percentages.organic}%`,
              bgcolor: 'success.main'
            }}
          />
          <Box 
            sx={{ 
              width: `${result.waste_percentages.recyclable}%`,
              bgcolor: 'primary.main'
            }}
          />
        </Box>
      </Box>

      <Typography 
        variant="body2" 
        color={result.waste_percentages.organic >= result.waste_percentages.recyclable ? 'success.main' : 'primary.main'} 
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
        {result.waste_percentages.organic >= result.waste_percentages.recyclable
          ? 'This waste is predominantly organic and should be composted'
          : 'This waste is predominantly recyclable and should be sorted accordingly'}
      </Typography>
    </Box>
  );
};

export default ResultsDisplay;