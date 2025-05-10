import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  Delete as RecycleIcon,
  Spa as OrganicIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ResultsDisplay = ({ result }) => {
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ 
        p: 3, 
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <Typography variant="h5" gutterBottom align="center" sx={{
          fontWeight: 'bold',
          mb: 3,
          color: 'var(--dark)'
        }}>
          Detection Results
        </Typography>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <img
            src={`http://localhost:5000${result.result_url}`}
            alt="Detection result"
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              borderRadius: '12px',
              border: '2px solid #e0e0e0',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
            }}
          />
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(0, 0, 0, 0.1)' }} />

        <Typography variant="h6" gutterBottom sx={{ 
          fontWeight: 'medium',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <InfoIcon color="primary" />
          Detected Items
        </Typography>
        
        <List dense sx={{ mb: 3 }}>
          {result.detected_classes.map((item, index) => (
            <ListItem 
              key={index}
              sx={{
                px: 0,
                py: 1,
                '&:not(:last-child)': { borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }
              }}
            >
              <ListItemText 
                primary={capitalize(item)} 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
              <Chip
                icon={item === 'organic' ? <OrganicIcon /> : <RecycleIcon />}
                label={item === 'organic' ? 'Organic' : 'Recyclable'}
                color={item === 'organic' ? 'success' : 'primary'}
                size="medium"
                sx={{ 
                  fontWeight: 'bold',
                  px: 1,
                  borderRadius: '6px'
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 3, borderColor: 'rgba(0, 0, 0, 0.1)' }} />

        <Typography variant="h6" gutterBottom sx={{ 
          fontWeight: 'medium',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2
        }}>
          <InfoIcon color="primary" />
          Waste Composition Analysis
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              <OrganicIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle', color: 'success.main' }} />
              Organic: {result.waste_percentages.organic}%
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              <RecycleIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
              Recyclable: {result.waste_percentages.recyclable}%
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            height: 12, 
            borderRadius: '6px', 
            overflow: 'hidden',
            mb: 3,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <Box
              sx={{
                width: `${result.waste_percentages.organic}%`,
                background: 'linear-gradient(90deg, #66BB6A, #43A047)'
              }}
            />
            <Box
              sx={{
                width: `${result.waste_percentages.recyclable}%`,
                background: 'linear-gradient(90deg, #42A5F5, #1E88E5)'
              }}
            />
          </Box>

          <Paper elevation={0} sx={{
            p: 2,
            borderRadius: '8px',
            backgroundColor: result.waste_percentages.organic >= result.waste_percentages.recyclable 
              ? 'rgba(102, 187, 106, 0.1)' 
              : 'rgba(66, 165, 245, 0.1)',
            border: '1px solid',
            borderColor: result.waste_percentages.organic >= result.waste_percentages.recyclable 
              ? 'rgba(102, 187, 106, 0.3)' 
              : 'rgba(66, 165, 245, 0.3)'
          }}>
            <Typography
              variant="body1"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontWeight: 'medium',
                color: result.waste_percentages.organic >= result.waste_percentages.recyclable 
                  ? 'success.dark' 
                  : 'primary.dark'
              }}
            >
              <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
              {result.waste_percentages.organic >= result.waste_percentages.recyclable
                ? 'This waste is predominantly organic and should be composted'
                : 'This waste is predominantly recyclable and should be sorted accordingly'}
            </Typography>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResultsDisplay;