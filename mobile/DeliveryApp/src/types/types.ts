// Соответствуют моделям Django и сериализаторам

export interface User {
  id: number;
  username: string;
  // добавьте другие поля пользователя, если они есть
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface ReferenceItem {
  id: number;
  name: string;
}

export type TransportModel = ReferenceItem;
export type PackageType = ReferenceItem;
export type Service = ReferenceItem;
export type DeliveryStatus = ReferenceItem;
export type CargoType = ReferenceItem;

export interface Delivery {
  id: number;
  transport_model: number;
  transport_model_name?: string;
  transport_number: string;
  departure_time: string;
  arrival_time: string;
  distance_km: string; // В Django DecimalField, здесь лучше использовать строку для точности
  media_file?: string | null;
  services: number[];
  service_names?: string[];
  status: number;
  status_name?: string;
  package_type: number;
  package_type_name?: string;
  tech_state: 'ok' | 'broken';
  cargo_type?: number | null;
  created_at: string;
  updated_at: string;
}

// Тип для формы создания/редактирования доставки
export type DeliveryFormValues = Omit<Delivery, 'id' | 'created_at' | 'updated_at' | 'transport_model_name' | 'status_name' | 'package_type_name' | 'service_names'> & {
  media_file_form?: {
    uri: string;
    type: string;
    name: string;
  } | null;
}; 