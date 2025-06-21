import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Укажите IP вашего компьютера, чтобы эмулятор мог достучаться до локального сервера
// На Windows можно узнать командой ipconfig в терминале
const API_BASE_URL = 'http://192.168.1.66:8000/api/'; // ЗАМЕНЕН НА ВАШ IP

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