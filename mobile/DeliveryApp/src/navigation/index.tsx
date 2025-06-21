import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { ActivityIndicator, View } from 'react-native';
import paperTheme from '../theme/theme'; // Наша тема из react-native-paper

// Адаптируем тему для @react-navigation
const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: paperTheme.colors.primary,
    background: paperTheme.colors.background,
    card: paperTheme.colors.surface,
    text: paperTheme.colors.onSurface,
    border: paperTheme.colors.outline,
    notification: paperTheme.colors.primary, // или другой подходящий цвет
  },
};

const Router = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: paperTheme.colors.background }}>
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Router; 