#!/usr/bin/env python
import os
import django
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from delivery_api.models import Delivery
from references.models import TransportModel, PackageType, Service, DeliveryStatus, CargoType

# Create transport models
transport_models = [
    {'name': 'Газель'},
    {'name': 'Фургон'},
    {'name': 'Грузовик'},
    {'name': 'Легковой автомобиль'},
]

for model_data in transport_models:
    TransportModel.objects.get_or_create(name=model_data['name'])

# Create package types
package_types = [
    {'name': 'Пакет до 1 кг'},
    {'name': 'Коробка'},
    {'name': 'Контейнер'},
    {'name': 'Паллета'},
]

for package_data in package_types:
    PackageType.objects.get_or_create(name=package_data['name'])

# Create services
services = [
    {'name': 'До клиента'},
    {'name': 'Хрупкий груз'},
    {'name': 'Срочная доставка'},
    {'name': 'Подъем на этаж'},
]

for service_data in services:
    Service.objects.get_or_create(name=service_data['name'])

# Create delivery statuses
delivery_statuses = [
    {'name': 'В ожидании'},
    {'name': 'В пути'},
    {'name': 'Доставлено'},
    {'name': 'Отменено'},
]

for status_data in delivery_statuses:
    DeliveryStatus.objects.get_or_create(name=status_data['name'])

# Create cargo types
cargo_types = [
    {'name': 'Электроника'},
    {'name': 'Одежда'},
    {'name': 'Продукты'},
    {'name': 'Мебель'},
    {'name': 'Документы'},
]

for cargo_data in cargo_types:
    CargoType.objects.get_or_create(name=cargo_data['name'])

# Create sample deliveries
deliveries = [
    {
        'transport_model': TransportModel.objects.get(name='Газель'),
        'transport_number': 'А123БВ77',
        'departure_time': datetime.now() + timedelta(hours=1),
        'arrival_time': datetime.now() + timedelta(hours=3),
        'distance_km': 25.5,
        'status': DeliveryStatus.objects.get(name='В ожидании'),
        'package_type': PackageType.objects.get(name='Коробка'),
        'cargo_type': CargoType.objects.get(name='Электроника'),
    },
    {
        'transport_model': TransportModel.objects.get(name='Фургон'),
        'transport_number': 'В456ГД77',
        'departure_time': datetime.now() + timedelta(hours=2),
        'arrival_time': datetime.now() + timedelta(hours=4),
        'distance_km': 15.2,
        'status': DeliveryStatus.objects.get(name='В пути'),
        'package_type': PackageType.objects.get(name='Пакет до 1 кг'),
        'cargo_type': CargoType.objects.get(name='Одежда'),
    },
    {
        'transport_model': TransportModel.objects.get(name='Грузовик'),
        'transport_number': 'Е789ЖЗ77',
        'departure_time': datetime.now() - timedelta(hours=2),
        'arrival_time': datetime.now() - timedelta(hours=1),
        'distance_km': 45.0,
        'status': DeliveryStatus.objects.get(name='Доставлено'),
        'package_type': PackageType.objects.get(name='Контейнер'),
        'cargo_type': CargoType.objects.get(name='Мебель'),
    }
]

for delivery_data in deliveries:
    delivery, created = Delivery.objects.get_or_create(
        transport_model=delivery_data['transport_model'],
        transport_number=delivery_data['transport_number'],
        departure_time=delivery_data['departure_time'],
        defaults=delivery_data
    )
    
    # Add services to delivery
    if created:
        delivery.services.add(Service.objects.get(name='До клиента'))
        if delivery.cargo_type.name == 'Электроника':
            delivery.services.add(Service.objects.get(name='Хрупкий груз'))

print('Test data created successfully!')
print(f'Created {TransportModel.objects.count()} transport models')
print(f'Created {PackageType.objects.count()} package types')
print(f'Created {Service.objects.count()} services')
print(f'Created {DeliveryStatus.objects.count()} delivery statuses')
print(f'Created {CargoType.objects.count()} cargo types')
print(f'Created {Delivery.objects.count()} deliveries') 