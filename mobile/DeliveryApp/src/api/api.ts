import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Используем localhost для разработки
// Для эмулятора Android можно использовать 10.0.2.2 вместо localhost
// Для физического устройства нужно будет указать IP компьютера
const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:8081/api/' // Для Android эмулятора
  : 'http://localhost:8081/api/'; // Для iOS симулятора

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// TODO: добавить interceptor для обновления токена по refresh token

export default api; 