import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Header from './components/Header'; 
import Home from './pages/Home'; 
import Upload from './pages/Upload'; 
import Webcam from './pages/Webcam'; 
import './App.css'; 
import Footer from './components/Footer';

function App() { 
  return ( 
    <Router> 
      <Header /> 
      <Routes> 
        <Route path="/" element={<Home />} /> 
        <Route path="/upload" element={<Upload />} /> 
        <Route path="/webcam" element={<Webcam />} /> 
      </Routes>
      <Footer />
    </Router> 
  ); 
} 
 
export default App;