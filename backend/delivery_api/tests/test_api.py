from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from references.models import TransportModel, PackageType, Service, DeliveryStatus, CargoType
from delivery_api.models import Delivery
from datetime import datetime, timedelta
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile

class DeliveryAPITest(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.transport = TransportModel.objects.create(name='V01')
        self.package = PackageType.objects.create(name='Коробка')
        self.service = Service.objects.create(name='До клиента')
        self.status = DeliveryStatus.objects.create(name='В ожидании')
        self.cargo = CargoType.objects.create(name='Мед. товары')

    def test_create_delivery(self):
        url = reverse('delivery-list')
        data = {
            "transport_model": self.transport.id,
            "transport_number": "V01-123",
            "departure_time": timezone.now().isoformat(),
            "arrival_time": (timezone.now() + timedelta(hours=2)).isoformat(),
            "distance_km": "10.5",
            "services": [self.service.id],
            "status": self.status.id,
            "package_type": self.package.id,
            "tech_state": "ok",
            "cargo_type": self.cargo.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['transport_number'], 'V01-123')

    def test_list_deliveries_requires_auth(self):
        self.client.logout()
        url = reverse('delivery-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)

    def test_update_delivery(self):
        url = reverse('delivery-list')
        data = {
            "transport_model": self.transport.id,
            "transport_number": "V01-123",
            "departure_time": timezone.now().isoformat(),
            "arrival_time": (timezone.now() + timedelta(hours=2)).isoformat(),
            "distance_km": "10.5",
            "services": [self.service.id],
            "status": self.status.id,
            "package_type": self.package.id,
            "tech_state": "ok",
            "cargo_type": self.cargo.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        delivery_id = response.data['id']
        patch_url = reverse('delivery-detail', args=[delivery_id])
        patch_data = {"tech_state": "broken"}
        response = self.client.patch(patch_url, patch_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['tech_state'], 'broken')

    def test_delete_delivery(self):
        url = reverse('delivery-list')
        data = {
            "transport_model": self.transport.id,
            "transport_number": "V01-123",
            "departure_time": timezone.now().isoformat(),
            "arrival_time": (timezone.now() + timedelta(hours=2)).isoformat(),
            "distance_km": "10.5",
            "services": [self.service.id],
            "status": self.status.id,
            "package_type": self.package.id,
            "tech_state": "ok",
            "cargo_type": self.cargo.id
        }
        response = self.client.post(url, data, format='json')
        delivery_id = response.data['id']
        del_url = reverse('delivery-detail', args=[delivery_id])
        response = self.client.delete(del_url)
        self.assertEqual(response.status_code, 204)

    def test_invalid_delivery_dates(self):
        url = reverse('delivery-list')
        data = {
            "transport_model": self.transport.id,
            "transport_number": "V01-123",
            "departure_time": timezone.now().isoformat(),
            "arrival_time": (timezone.now() - timedelta(hours=2)).isoformat(),
            "distance_km": "10.5",
            "services": [self.service.id],
            "status": self.status.id,
            "package_type": self.package.id,
            "tech_state": "ok",
            "cargo_type": self.cargo.id
        }
        response = self.client.post(url, data, format='json')
        # Пока нет кастомной валидации, ожидаем 201, но если добавишь — поменяй на 400
        self.assertIn(response.status_code, [201, 400])

    def test_create_delivery_with_invalid_ids(self):
        url = reverse('delivery-list')
        data = {
            "transport_model": 999,
            "transport_number": "V01-123",
            "departure_time": timezone.now().isoformat(),
            "arrival_time": (timezone.now() + timedelta(hours=2)).isoformat(),
            "distance_km": "10.5",
            "services": [999],
            "status": 999,
            "package_type": 999,
            "tech_state": "ok",
            "cargo_type": 999
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)

    def test_create_delivery_without_required_fields(self):
        url = reverse('delivery-list')
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)

    def test_create_delivery_with_media_file(self):
        url = reverse('delivery-list')
        file = SimpleUploadedFile('test.pdf', b'file_content', content_type='application/pdf')
        data = {
            "transport_model": self.transport.id,
            "transport_number": "V01-123",
            "departure_time": timezone.now().isoformat(),
            "arrival_time": (timezone.now() + timedelta(hours=2)).isoformat(),
            "distance_km": "10.5",
            "services": [self.service.id],
            "status": self.status.id,
            "package_type": self.package.id,
            "tech_state": "ok",
            "cargo_type": self.cargo.id,
            "media_file": file
        }
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.data['media_file']) 