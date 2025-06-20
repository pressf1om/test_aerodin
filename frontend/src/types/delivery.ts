// Типы для доставки и справочников
export interface Delivery {
  id: number;
  transport_model: number;
  transport_number: string;
  departure_time: string;
  arrival_time: string;
  distance_km: number;
  media_file?: string | null;
  services: number[];
  status: number;
  package_type: number;
  tech_state: 'ok' | 'broken';
  cargo_type?: number | null;
  created_at: string;
  updated_at: string;
}

export interface ReferenceItem {
  id: number;
  name: string;
} 