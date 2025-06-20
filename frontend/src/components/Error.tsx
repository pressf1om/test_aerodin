import React from 'react';
import { Alert, Box } from '@mui/material';

interface ErrorProps {
  message: string;
}

/**
 * Компонент для отображения ошибки.
 */
const Error: React.FC<ErrorProps> = ({ message }) => (
  <Box my={2}>
    <Alert severity="error">{message}</Alert>
  </Box>
);

export default Error; 