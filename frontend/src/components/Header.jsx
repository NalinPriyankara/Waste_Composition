import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import RecyclingIcon from '@mui/icons-material/Recycling';

const Header = () => {
  return (
    <AppBar position="sticky" sx={{ 
      background: 'linear-gradient(135deg, #4CAF50, #263238)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <Toolbar sx={{ 
        padding: '0 100px !important', // Tight side padding (8px each side)
        minHeight: '56px !important' // Compact height
      }}>
        <RecyclingIcon sx={{ 
          fontSize: 28, // Slightly smaller icon
          marginRight: '8px'
        }} />
        
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            flexGrow: 1,
            fontSize: '1.5rem', // Slightly smaller text
            margin: 0,
            padding: 0
          }}
        >
          WASTE ANALYZER
        </Typography>
        
        <div style={{ display: 'flex', gap: '4px' }}> {/* Tight button grouping */}
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ 
              minWidth: 'auto',
              padding: '4px 8px',
              fontSize: '1.2rem'
            }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/upload"
            sx={{ 
              minWidth: 'auto',
              padding: '4px 8px',
              fontSize: '1.2rem'
            }}
          >
            Upload
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/webcam"
            sx={{ 
              minWidth: 'auto',
              padding: '4px 8px',
              fontSize: '1.2rem'
            }}
          >
            Webcam
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;