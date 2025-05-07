import React from 'react';
import { Box } from '@mui/material';

const Background = ({ children, imageUrl }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        sx={{
          //backgroundColor: 'rgba(255, 255, 255, 0.9)',
          minHeight: '100vh',
          padding: '2rem',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Background;