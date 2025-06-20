import React from 'react';
import { CircularProgress, Box } from '@mui/material';

/**
 * Круглый лоадер по центру экрана.
 */
const Loader: React.FC = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
    <CircularProgress />
  </Box>
);

export default Loader; 