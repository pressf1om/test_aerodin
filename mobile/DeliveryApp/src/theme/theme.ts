import { MD3DarkTheme } from 'react-native-paper';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#B69DF8', // Фиолетовый из макета
    background: '#141218', // Очень темный фон
    surface: '#211F26', // Цвет фона карточек
    surfaceVariant: '#49454F', // Цвет для инпутов, чипсов
    onSurface: '#E6E1E5', // Основной цвет текста
    onSurfaceVariant: '#CAC4D0', // Второстепенный цвет текста
    primaryContainer: '#4F378B', // Цвет для кнопок
    onPrimaryContainer: '#EADDFF', // Цвет текста на кнопках
    outline: '#938F99', // Цвет границ
    error: '#F2B8B5',
    onError: '#601410',
    // ... другие цвета можно добавить по необходимости
  },
};

export default theme; 