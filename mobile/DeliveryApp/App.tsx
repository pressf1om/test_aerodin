import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import Router from './src/navigation';
import theme from './src/theme/theme';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <StatusBar style="light" />
        <Router />
      </AuthProvider>
    </PaperProvider>
  );
}
