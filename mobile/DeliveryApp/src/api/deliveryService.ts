import api from './api';
import { Delivery, ReferenceItem } from '../types/types';

/**
 * Получает список всех доставок
 */
export const getDeliveries = async (): Promise<Delivery[]> => {
    try {
        const response = await api.get('/deliveries/');
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
        const response = await api.get(`/references/${refName}/`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch reference: ${refName}`, error);
        return [];
    }
};

// ... Можно добавить функции для создания, обновления, удаления 