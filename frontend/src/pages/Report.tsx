import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TableSortLabel,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { BarChart } from '@mui/x-charts/BarChart';

/**
 * Страница отчёта по доставкам: фильтры, график, таблица.
 */

// Тип для одной доставки в соответствии с DRF Serializer
interface Delivery {
  id: number;
  transport_model_name: string;
  transport_number: string;
  departure_time: string;
  arrival_time: string;
  distance_km: string;
  service_names: string[];
  status_name: string;
  package_type_name: string;
  tech_state: string;
}

interface Service {
  id: number;
  name: string;
}

const Report: React.FC = () => {
  const { logout } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние фильтров
  const [selectedService, setSelectedService] = useState<string>('');
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

  // Состояние для сортировки
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = useState<string>('arrival_time');

  // Агрегация данных для графика
  const chartData = useMemo(() => {
    if (!deliveries.length) return { xAxis: [], series: [] };

    const countsByDate: { [key: string]: number } = {};
    deliveries.forEach(delivery => {
      const date = dayjs(delivery.arrival_time).format('YYYY-MM-DD');
      countsByDate[date] = (countsByDate[date] || 0) + 1;
    });

    const sortedDates = Object.keys(countsByDate).sort((a, b) => dayjs(a).diff(dayjs(b)));

    const xAxisData = sortedDates.map(date => dayjs(date).format('DD.MM'));
    const seriesData = sortedDates.map(date => countsByDate[date]);

    return {
      xAxis: [{ scaleType: 'band' as const, data: xAxisData, label: 'Дата' }],
      series: [{ data: seriesData, label: 'Кол-во доставок' }],
    };
  }, [deliveries]);

  const handleSortRequest = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('arrival_time_after', startDate.toISOString());
      if (endDate) params.append('arrival_time_before', endDate.toISOString());
      if (selectedService) params.append('services', selectedService);
      
      // Добавляем параметр сортировки
      const ordering = order === 'desc' ? `-${orderBy}` : orderBy;
      params.append('ordering', ordering);

      const response = await api.get('/deliveries/', { params });
      setDeliveries(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при загрузке данных.');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedService, order, orderBy]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get<Service[]>('/references/services/');
        setServices(response.data);
      } catch (err) {
        console.error('Не удалось загрузить список услуг:', err);
      }
    };

    fetchServices();
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleFilterChange = () => {
      fetchDeliveries();
  }
  
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('ru-RU');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Отчёт по доставкам
            </Typography>
            <Button color="inherit" onClick={logout}>
              Выход
            </Button>
          </Toolbar>
        </AppBar>

        <Paper sx={{ margin: 2, padding: 2 }}>
          <Grid container spacing={2} sx={{ marginBottom: 2, alignItems: 'center' }}>
            {/* График */}
            <Grid item xs={12}>
              {deliveries.length > 0 && (
                <Box sx={{ width: '100%', height: 300 }}>
                  <BarChart
                    xAxis={chartData.xAxis}
                    series={chartData.series}
                    colors={['#4dabf5']}
                  />
                </Box>
              )}
            </Grid>

            {/* Фильтры */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DatePicker
                  label="Дата начала"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <DatePicker
                  label="Дата окончания"
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Услуга</InputLabel>
                <Select
                  value={selectedService}
                  label="Услуга"
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <MenuItem value=""><em>Все</em></MenuItem>
                  {services.map(service => (
                    <MenuItem key={service.id} value={service.id}>{service.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleFilterChange} fullWidth>Применить</Button>
            </Grid>
          </Grid>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Alert severity="error">{error}</Alert>
          )}
          {!loading && !error && deliveries.length === 0 && (
            <Typography>Нет данных для отображения.</Typography>
          )}
          {!loading && !error && deliveries.length > 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Транспорт</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'delivery_time'}
                        direction={orderBy === 'delivery_time' ? order : 'asc'}
                        onClick={() => handleSortRequest('delivery_time')}
                      >
                        Перевод
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'arrival_time'}
                        direction={orderBy === 'arrival_time' ? order : 'asc'}
                        onClick={() => handleSortRequest('arrival_time')}
                      >
                        Прибытие
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Дистанция (км)</TableCell>
                    <TableCell>Услуги</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Упаковка</TableCell>
                    <TableCell>Состояние</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell>{delivery.transport_model_name} {delivery.transport_number}</TableCell>
                      <TableCell>{formatDateTime(delivery.departure_time)}</TableCell>
                      <TableCell>{formatDateTime(delivery.arrival_time)}</TableCell>
                      <TableCell>{delivery.distance_km}</TableCell>
                      <TableCell>{delivery.service_names?.join(', ') || '—'}</TableCell>
                      <TableCell>{delivery.status_name}</TableCell>
                      <TableCell>{delivery.package_type_name}</TableCell>
                      <TableCell>{delivery.tech_state === 'ok' ? 'Исправно' : 'Неисправно'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default Report; 