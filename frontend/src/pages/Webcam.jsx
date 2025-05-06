import WebcamCapture from '../components/WebcamCapture';
import Background from '../components/Background';
import { Box } from '@mui/material';

const Webcam = () => {
  return (
    <Background type="camera">
      <Box className="content-card">
        <WebcamCapture />
      </Box>
    </Background>
  );
};

export default Webcam;