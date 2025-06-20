from django.test import TestCase
from references.models import TransportModel, PackageType, Service, DeliveryStatus, CargoType
from delivery_api.models import Delivery
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta
from django.utils import timezone

class DeliveryModelTest(TestCase):
    """
    Тесты модели Delivery: создание, связи со справочниками, корректность полей.
    """
    def setUp(self):
        """
        Создание тестовых справочников для использования в тестах Delivery.
        """
        self.transport = TransportModel.objects.create(name='V01')
        self.package = PackageType.objects.create(name='Коробка')
        self.service = Service.objects.create(name='До клиента')
        self.status = DeliveryStatus.objects.create(name='В ожидании')
        self.cargo = CargoType.objects.create(name='Мед. товары')

    def test_create_delivery(self):
        """
        Проверяет создание доставки и корректность связей со справочниками.
        """
        delivery = Delivery.objects.create(
            transport_model=self.transport,
            transport_number='V01-123',
            departure_time=timezone.now(),
            arrival_time=timezone.now() + timedelta(hours=2),
            distance_km=10.5,
            status=self.status,
            package_type=self.package,
            tech_state='ok',
            cargo_type=self.cargo
        )
        delivery.services.add(self.service)
        self.assertEqual(delivery.transport_model.name, 'V01')
        self.assertEqual(delivery.package_type.name, 'Коробка')
        self.assertIn(self.service, delivery.services.all())
        self.assertEqual(delivery.status.name, 'В ожидании')
        self.assertEqual(delivery.cargo_type.name, 'Мед. товары')
        self.assertEqual(delivery.tech_state, 'ok') 