import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Text, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import SelectionRow from '../components/SelectionRow';

type RootStackParamList = {
  DeliveryForm: { deliveryId?: number };
};

type DeliveryFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DeliveryForm'>;
type DeliveryFormScreenRouteProp = RouteProp<RootStackParamList, 'DeliveryForm'>;

type Props = {
  navigation: DeliveryFormScreenNavigationProp;
  route: DeliveryFormScreenRouteProp;
};

const DeliveryFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { deliveryId } = route.params;
  const theme = useTheme();
  const isEditing = deliveryId !== undefined;

  // TODO: Загружать данные доставки по deliveryId, если isEditing
  
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? `№${deliveryId}` : 'Новая доставка'} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text variant="labelLarge" style={[styles.groupTitle, {color: theme.colors.onSurfaceVariant}]}>КУРЬЕР</Text>
        <View style={[styles.section, {backgroundColor: theme.colors.surface, borderRadius: 12}]}>
            <SelectionRow icon="car-side" label="Модель и номер" value="V01, №123" onPress={() => { /* TODO */ }} />
            <SelectionRow icon="clock-time-four-outline" label="Время в пути" value="2ч" onPress={() => { /* TODO */ }} />
            <SelectionRow icon="map-marker-distance" label="Дистанция" value="2 км" onPress={() => { /* TODO */ }} />
            <SelectionRow icon="paperclip" label="Медиафайл" value="отчет.pdf" onPress={() => { /* TODO */ }} />
        </View>

        <Text variant="labelLarge" style={[styles.groupTitle, {color: theme.colors.onSurfaceVariant}]}>СТАТУС</Text>
        <View style={[styles.section, {backgroundColor: theme.colors.surface, borderRadius: 12}]}>
            <SelectionRow icon="information-outline" label="Услуга" value="До клиента, хрупкий груз" onPress={() => { /* TODO */ }} />
            <SelectionRow icon="circle-slice-8" label="Статус доставки" value="В ожидании" onPress={() => { /* TODO */ }} />
            <SelectionRow icon="package-variant-closed" label="Упаковка" value="Пакет до 1 кг" onPress={() => { /* TODO */ }} />
            <SelectionRow icon="cog-outline" label="Тех. исправность" value="Исправно" onPress={() => { /* TODO */ }} />
        </View>

        <Button mode="contained" style={styles.button}>
          {isEditing ? 'Сохранить' : 'Создать'}
        </Button>
        {isEditing && (
            <View style={styles.editButtons}>
                <Button mode="outlined" style={{flex: 1, marginRight: 8}}>Удалить</Button>
                <Button mode="contained" style={{flex: 1}}>Провести</Button>
            </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  groupTitle: {
    marginLeft: 4,
    marginBottom: 8,
  },
  section: {
    marginTop: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  button: {
      marginTop: 16,
      paddingVertical: 8,
  },
  editButtons: {
      flexDirection: 'row',
      marginTop: 16,
  }
});

export default DeliveryFormScreen; 