import React from 'react';
import { Box } from '@mui/material';
import backgroundImage from '../assets/background.jpg';

const Background = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
          url(${backgroundImage})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
      }}
    >
      {children}
    </Box>
  );
};

export default Background;