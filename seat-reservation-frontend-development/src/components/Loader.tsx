import React from 'react';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

const Loader: React.FC = () => {
  return (
    <Box
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
