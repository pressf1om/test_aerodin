import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Card, useTheme, Chip, FAB, Appbar, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Delivery } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { getDeliveries } from '../api/deliveryService';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

// Моковые данные для разработки
const mockDeliveries: Delivery[] = [
  {
    id: 126,
    transport_model: 1,
    transport_number: '126',
    departure_time: '2025-04-30T10:00:00Z',
    arrival_time: '2025-04-30T12:00:00Z',
    distance_km: '2',
    services: [1, 2],
    service_names: ['Хрупкий груз', 'До клиента'],
    status: 1,
    status_name: 'Проведено',
    package_type: 1,
    package_type_name: 'Пакет до 1 кг',
    tech_state: 'ok',
    created_at: '2025-04-30T09:00:00Z',
    updated_at: '2025-04-30T09:00:00Z',
  },
  {
    id: 1265,
    transport_model: 1,
    transport_number: '1265',
    departure_time: '2025-04-30T11:00:00Z',
    arrival_time: '2025-04-30T13:00:00Z',
    distance_km: '5',
    services: [2],
    service_names: ['До клиента'],
    status: 2,
    status_name: 'В ожидании',
    package_type: 2,
    package_type_name: 'Коробка',
    tech_state: 'ok',
    created_at: '2025-04-30T10:00:00Z',
    updated_at: '2025-04-30T10:00:00Z',
  },
    {
    id: 1264,
    transport_model: 1,
    transport_number: '1264',
    departure_time: '2025-04-29T11:00:00Z',
    arrival_time: '2025-04-29T13:00:00Z',
    distance_km: '15',
    services: [1, 2],
    service_names: ['Хрупкий груз', 'До клиента'],
    status: 1,
    status_name: 'Проведено',
    package_type: 1,
    package_type_name: 'Пакет до 1 кг',
    tech_state: 'ok',
    created_at: '2025-04-29T10:00:00Z',
    updated_at: '2025-04-29T10:00:00Z',
  },
];

type DeliveryListScreenNavigationProp = StackNavigationProp<{
  DeliveryForm: { deliveryId?: number };
}>;

type Props = {
  navigation: DeliveryListScreenNavigationProp;
};

const DeliveryListScreen: React.FC<Props> = ({ navigation }) => {
  const { signOut } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Используем useFocusEffect, чтобы обновлять список каждый раз,
  // когда экран оказывается в фокусе (например, после создания/редактирования доставки)
  useFocusEffect(
    React.useCallback(() => {
      const fetchDeliveries = async () => {
        setLoading(true);
        const data = await getDeliveries();
        setDeliveries(data);
        setLoading(false);
      };

      fetchDeliveries();
    }, [])
  );

  const calculateDuration = (start: string, end: string) => {
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    // const minutes = Math.floor((duration / (1000 * 60)) % 60);
    return `${hours} часа`; // Упрощенно
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Delivery }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('DeliveryForm', { deliveryId: item.id })}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>№{item.transport_number}</Text>
        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={16} color={theme.colors.onSurfaceVariant} />
          <Text style={styles.infoText}>{calculateDuration(item.departure_time, item.arrival_time)}</Text>
          <Icon name="map-marker-distance" size={16} color={theme.colors.onSurfaceVariant} style={{ marginLeft: 16 }}/>
          <Text style={styles.infoText}>{item.distance_km} км</Text>
        </View>
        <View style={styles.infoRow}>
            <Icon name="information-outline" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={styles.infoText}>{item.service_names?.join(', ')}</Text>
        </View>
        <View style={styles.infoRow}>
            <Icon name="package-variant-closed" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={styles.infoText}>{item.package_type_name}</Text>
        </View>
         <View style={styles.chipContainer}>
          <Chip
            style={[styles.chip, { backgroundColor: item.status_name === 'Проведено' ? '#388E3C' : '#FBC02D' }]}
            textStyle={styles.chipText}
          >
            {item.status_name}
          </Chip>
           <Chip 
            style={[styles.chip, { backgroundColor: item.tech_state === 'ok' ? theme.colors.surfaceVariant : theme.colors.errorContainer }]}
            textStyle={styles.chipText}
           >
            {item.tech_state === 'ok' ? 'Исправно' : 'Неисправно'}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Доставки" />
        <Appbar.Action icon="logout" onPress={signOut} />
      </Appbar.Header>
      <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
        <FlatList
          data={deliveries}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>Список доставок пуст</Text>
            </View>
          }
        />
        <FAB
          icon="plus"
          style={{...styles.fab, backgroundColor: theme.colors.primaryContainer}}
          onPress={() => navigation.navigate('DeliveryForm', {})}
          color={theme.colors.onPrimaryContainer}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
      fontWeight: 'bold',
      marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
      marginLeft: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  chip: {
      marginRight: 8,
      marginBottom: 8,
  },
  chipText: {
      color: 'white',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DeliveryListScreen; 