import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DeliveryListScreen from '../screens/DeliveryListScreen'; // Будет создан позже
import DeliveryFormScreen from '../screens/DeliveryFormScreen'; // Будет создан позже

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DeliveryList" component={DeliveryListScreen} />
      <Stack.Screen name="DeliveryForm" component={DeliveryFormScreen} />
    </Stack.Navigator>
  );
};

export default AppStack; 