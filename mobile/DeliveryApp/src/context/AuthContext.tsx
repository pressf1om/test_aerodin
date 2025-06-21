import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { User } from '../types/types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn(credentials: any): Promise<boolean>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (accessToken && storedUser) {
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(credentials: any): Promise<boolean> {
    try {
      const response = await api.post('token/', credentials);
      const { access, refresh } = response.data;

      await AsyncStorage.setItem('accessToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);
      
      // В ТЗ не указано отображение имени пользователя, поэтому просто сохраняем сам факт
      // успешного входа, создав объект пользователя "заглушку"
      const loggedInUser: User = { id: 0, username: credentials.username };
      await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));

      api.defaults.headers.Authorization = `Bearer ${access}`;
      setUser(loggedInUser);
      return true;
    } catch (error) {
      console.error("Failed to sign in:", error);
      // TODO: Показать ошибку пользователю
      return false;
    }
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
} 