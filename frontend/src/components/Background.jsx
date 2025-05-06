import React from 'react';
import PropTypes from 'prop-types';

const Background = ({ type = 'gradient', children }) => {
  const backgrounds = {
    gradient: {
      backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    pattern: {
      backgroundImage: 'url(/images/waste-pattern.png)',
      backgroundSize: '300px',
      opacity: 0.1
    },
    camera: {
      background: 'rgba(0,0,0,0.7) url(/images/camera-bg.jpg)',
      backgroundBlendMode: 'darken',
      backgroundSize: 'cover'
    }
  };

  return (
    <div style={{
      ...backgrounds[type],
      minHeight: '100vh',
      width: '100%',
      padding: '20px',
      position: 'relative'
    }}>
      {children}
    </div>
  );
};

Background.propTypes = {
  type: PropTypes.oneOf(['gradient', 'pattern', 'camera']),
  children: PropTypes.node
};

export default Background;