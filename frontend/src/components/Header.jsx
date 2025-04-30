import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Waste Composition
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/upload">Upload</Button>
        <Button color="inherit" component={Link} to="/webcam">Webcam</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;