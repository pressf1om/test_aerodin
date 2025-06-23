import api from './api';
import { Delivery, ReferenceItem } from '../types/types';
import { DeliveryFormValues } from '../types/types';

export interface DeliveryFormData {
  delivery?: Delivery;
  transportModels: ReferenceItem[];
  packageTypes: ReferenceItem[];
  services: ReferenceItem[];
  deliveryStatuses: ReferenceItem[];
  cargoTypes: ReferenceItem[];
}

/**
 * Получает список всех доставок
 */
export const getDeliveries = async (): Promise<Delivery[]> => {
    try {
        const response = await api.get('deliveries/');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch deliveries', error);
        // В реальном приложении здесь была бы обработка ошибок
        return [];
    }
};

/**
 * Получает данные для указанного справочника
 * @param refName - Имя справочника в URL (например, 'package-types')
 */
export const getReference = async (refName: string): Promise<ReferenceItem[]> => {
    try {
        const response = await api.get(`references/${refName}/`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch reference: ${refName}`, error);
        return [];
    }
};

/**
 * Загружает все данные, необходимые для формы создания/редактирования доставки.
 * Если передан deliveryId, загружает и саму доставку.
 * @param deliveryId - ID доставки для режима редактирования
 */
export const getDeliveryFormData = async (deliveryId?: number): Promise<DeliveryFormData> => {
  try {
    const data: Partial<DeliveryFormData> = {};

    // Параллельно загружаем все справочники
    const [
      transportModels,
      packageTypes,
      services,
      deliveryStatuses,
      cargoTypes,
    ] = await Promise.all([
      getReference('transport-models'),
      getReference('package-types'),
      getReference('services'),
      getReference('delivery-statuses'),
      getReference('cargo-types'),
    ]);

    data.transportModels = transportModels;
    data.packageTypes = packageTypes;
    data.services = services;
    data.deliveryStatuses = deliveryStatuses;
    data.cargoTypes = cargoTypes;
    
    // Если есть ID, загружаем саму доставку
    if (deliveryId) {
      const response = await api.get(`deliveries/${deliveryId}/`);
      data.delivery = response.data;
    }

    return data as DeliveryFormData;
  } catch (error) {
    console.error('Failed to fetch delivery form data', error);
    // В случае ошибки возвращаем пустые массивы, чтобы форма не "упала"
    return {
      transportModels: [],
      packageTypes: [],
      services: [],
      deliveryStatuses: [],
      cargoTypes: [],
    };
  }
};

/**
 * Создает новую доставку.
 * @param data - Данные из формы.
 */
export const createDelivery = async (data: DeliveryFormValues | FormData, isFormData = false): Promise<Delivery> => {
    try {
        const response = await api.post('deliveries/', data, isFormData ? {
          headers: { 'Content-Type': 'multipart/form-data' }
        } : undefined);
        return response.data;
    } catch (error) {
        console.error('Failed to create delivery', error);
        throw error; // Передаем ошибку дальше для обработки в UI
    }
};

/**
 * Обновляет существующую доставку.
 * @param id - ID доставки.
 * @param data - Данные из формы.
 */
export const updateDelivery = async (id: number, data: DeliveryFormValues | FormData, isFormData = false): Promise<Delivery> => {
    try {
        const response = await api.put(`deliveries/${id}/`, data, isFormData ? {
          headers: { 'Content-Type': 'multipart/form-data' }
        } : undefined);
        return response.data;
    } catch (error) {
        console.error(`Failed to update delivery ${id}`, error);
        throw error; // Передаем ошибку дальше для обработки в UI
    }
};

/**
 * Переводит доставку в указанный статус
 */
export const conductDelivery = async (id: number, statusId: number): Promise<Delivery> => {
  try {
    const response = await api.patch(`deliveries/${id}/`, { status: statusId });
    return response.data;
  } catch (error) {
    console.error('Failed to conduct delivery', error);
    throw error;
  }
};

/**
 * Удаляет доставку
 */
export const deleteDelivery = async (id: number): Promise<void> => {
  try {
    await api.delete(`deliveries/${id}/`);
  } catch (error) {
    console.error('Failed to delete delivery', error);
    throw error;
  }
};

// ... Можно добавить функции для создания, обновления, удаления 