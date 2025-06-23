import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Platform, Alert } from 'react-native';
import { Appbar, Button, Chip, Menu, SegmentedButtons, Text, TextInput, TouchableRipple, useTheme } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { getDeliveryFormData, DeliveryFormData, createDelivery, updateDelivery } from '../api/deliveryService';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ReferenceItem } from '../types/types';
import * as DocumentPicker from 'expo-document-picker';

// Определяем типы для навигации
type RootStackParamList = {
  DeliveryList: undefined;
  DeliveryForm: { deliveryId?: number };
};

type DeliveryFormScreenRouteProp = RouteProp<RootStackParamList, 'DeliveryForm'>;
type DeliveryFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DeliveryForm'>;

interface Props {
  route: DeliveryFormScreenRouteProp;
  navigation: DeliveryFormScreenNavigationProp;
}

// Компонент для выпадающего списка
const Dropdown: React.FC<{
  label: string;
  items: ReferenceItem[];
  selectedValue: number | undefined;
  onSelect: (value: number) => void;
}> = ({ label, items, selectedValue, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const selectedItem = items.find(item => item.id === selectedValue);

  return (
    <View style={styles.dropdownContainer}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TouchableRipple onPress={openMenu} style={styles.dropdownAnchor}>
            <View>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.dropdownValue}>{selectedItem ? selectedItem.name : 'Не выбрано'}</Text>
            </View>
          </TouchableRipple>
        }>
        {items.map(item => (
          <Menu.Item
            key={item.id}
            onPress={() => {
              onSelect(item.id);
              closeMenu();
            }}
            title={item.name}
          />
        ))}
      </Menu>
    </View>
  );
};

// Компонент для выбора даты и времени
const DateTimePickerRow: React.FC<{
  label: string;
  value: Date;
  onDateChange: (date: Date) => void;
}> = ({ label, value, onDateChange }) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || value;
    setShow(Platform.OS === 'ios'); // на iOS picker не закрывается сам
    onDateChange(currentDate);

    // После выбора даты, предлагаем выбрать время
    if (mode === 'date' && event.type === 'set') {
      setMode('time');
      setShow(true); // Сразу открываем выбор времени
    } else {
      setShow(false); // Закрываем после выбора времени
    }
  };

  const showPicker = (currentMode: 'date' | 'time') => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <View style={styles.dropdownContainer}>
       <TouchableRipple onPress={() => showPicker('date')} style={styles.dropdownAnchor}>
        <View>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.dropdownValue}>{value.toLocaleString('ru-RU')}</Text>
        </View>
      </TouchableRipple>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const DeliveryFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { deliveryId } = route.params;
  const theme = useTheme();

  const [formData, setFormData] = useState<DeliveryFormData>({
    transportModels: [],
    packageTypes: [],
    services: [],
    deliveryStatuses: [],
    cargoTypes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние для полей формы
  const [transportModelId, setTransportModelId] = useState<number | undefined>();
  const [transportNumber, setTransportNumber] = useState('');
  const [distance, setDistance] = useState('');
  const [statusId, setStatusId] = useState<number | undefined>();
  const [packageTypeId, setPackageTypeId] = useState<number | undefined>();
  const [cargoTypeId, setCargoTypeId] = useState<number | undefined>();
  const [techState, setTechState] = useState<'ok' | 'broken'>('ok');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  // --- Состояния полей формы ---
  const [departureTime, setDepartureTime] = useState(new Date());
  const [arrivalTime, setArrivalTime] = useState(new Date());

  const [isSaving, setIsSaving] = useState(false);

  const [mediaFile, setMediaFile] = useState<{ uri: string; name: string; mimeType: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // Сбрасываем ошибку при перезагрузке
        const data = await getDeliveryFormData(deliveryId);

        // Сначала устанавливаем все данные для справочников
        setFormData({
          transportModels: data.transportModels,
          packageTypes: data.packageTypes,
          services: data.services,
          deliveryStatuses: data.deliveryStatuses,
          cargoTypes: data.cargoTypes,
        });

        // Затем, если это редактирование, устанавливаем значения для полей
        if (data.delivery) {
          setTransportModelId(data.delivery.transport_model);
          setTransportNumber(data.delivery.transport_number);
          setDistance(String(data.delivery.distance_km));
          setStatusId(data.delivery.status);
          setPackageTypeId(data.delivery.package_type);
          setCargoTypeId(data.delivery.cargo_type ?? undefined);
          setDepartureTime(new Date(data.delivery.departure_time));
          setArrivalTime(new Date(data.delivery.arrival_time));
          setTechState(data.delivery.tech_state);
          setSelectedServices(data.delivery.services || []);
        }

      } catch (err) {
        setError('Не удалось загрузить данные для формы.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deliveryId]);

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        // Сортируем для консистентного порядка
        : [...prev, serviceId].sort((a, b) => a - b) 
    );
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setMediaFile({
          uri: file.uri,
          name: file.name,
          mimeType: file.mimeType || 'application/octet-stream',
        });
      }
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось выбрать файл.');
    }
  };

  const handleSave = async () => {
    if (!transportModelId || !transportNumber || !distance || !statusId || !packageTypeId) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля.');
      return;
    }
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('transport_model', String(transportModelId));
      formData.append('transport_number', transportNumber);
      formData.append('departure_time', departureTime.toISOString());
      formData.append('arrival_time', arrivalTime.toISOString());
      formData.append('distance_km', distance);
      selectedServices.forEach((id: number) => formData.append('services', String(id)));
      formData.append('status', String(statusId));
      formData.append('package_type', String(packageTypeId));
      formData.append('tech_state', techState);
      if (cargoTypeId) formData.append('cargo_type', String(cargoTypeId));
      if (mediaFile) {
        formData.append('media_file', {
          uri: mediaFile.uri,
          name: mediaFile.name,
          type: mediaFile.mimeType,
        } as any);
      }
      if (deliveryId) {
        await updateDelivery(deliveryId, formData, true);
      } else {
        await createDelivery(formData, true);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save delivery', error);
      Alert.alert('Ошибка сохранения', 'Не удалось сохранить данные. Попробуйте снова.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator animating={true} size="large" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={deliveryId ? 'Редактировать' : 'Новая доставка'} />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        <Dropdown
          label="Модель транспорта"
          items={formData.transportModels}
          selectedValue={transportModelId}
          onSelect={setTransportModelId}
        />
        
        <TextInput
          label="Номер транспорта"
          value={transportNumber}
          onChangeText={setTransportNumber}
          style={styles.input}
        />

        <DateTimePickerRow
          label="Время отправки"
          value={departureTime}
          onDateChange={setDepartureTime}
        />
        
        <DateTimePickerRow
          label="Время доставки"
          value={arrivalTime}
          onDateChange={setArrivalTime}
        />

        <TextInput
          label="Дистанция (км)"
          value={distance}
          onChangeText={setDistance}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.groupLabel}>Услуги</Text>
        <View style={styles.chipContainer}>
          {formData.services.map(service => (
            <Chip
              key={service.id}
              mode="outlined"
              selected={selectedServices.includes(service.id)}
              onPress={() => handleServiceToggle(service.id)}
              style={styles.chip}
            >
              {service.name}
            </Chip>
          ))}
        </View>
        
        <Dropdown
          label="Статус доставки"
          items={formData.deliveryStatuses}
          selectedValue={statusId}
          onSelect={setStatusId}
        />
        
        <Dropdown
          label="Тип упаковки"
          items={formData.packageTypes}
          selectedValue={packageTypeId}
          onSelect={setPackageTypeId}
        />
        
        <Text style={styles.groupLabel}>Тех. состояние</Text>
        <SegmentedButtons
          value={techState}
          onValueChange={(value) => setTechState(value as 'ok' | 'broken')}
          style={styles.segmentedButtons}
          buttons={[
            { value: 'ok', label: 'Исправно', icon: 'check-circle' },
            { value: 'broken', label: 'Неисправно', icon: 'alert-circle' },
          ]}
        />

        <Dropdown
          label="Тип груза"
          items={formData.cargoTypes}
          selectedValue={cargoTypeId}
          onSelect={setCargoTypeId}
        />
        
        <Button
          mode="outlined"
          onPress={handlePickFile}
          style={{ marginBottom: 12 }}
          icon="attachment"
        >
          {mediaFile ? `Файл: ${mediaFile.name}` : 'Загрузить файл (PDF, фото)'}
        </Button>
        
        <Button 
          mode="contained" 
          onPress={handleSave} 
          style={styles.button}
          loading={isSaving}
          disabled={isSaving}
        >
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 12,
    color: '#888'
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownAnchor: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  dropdownValue: {
    fontSize: 16,
    marginTop: 4,
  },
  groupLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#888',
    marginTop: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
});

export default DeliveryFormScreen; 