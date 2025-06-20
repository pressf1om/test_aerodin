from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from references.models import TransportModel, PackageType, Service, DeliveryStatus, CargoType

class ReferencesAPITest(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.transport = TransportModel.objects.create(name='V01')
        self.package = PackageType.objects.create(name='Коробка')
        self.service = Service.objects.create(name='До клиента')
        self.status = DeliveryStatus.objects.create(name='В ожидании')
        self.cargo = CargoType.objects.create(name='Мед. товары')

    def test_transport_model_list(self):
        url = reverse('transportmodel-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['name'], 'V01')

    def test_requires_auth(self):
        self.client.logout()
        url = reverse('transportmodel-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)

    def test_package_type_list(self):
        url = reverse('packagetype-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['name'], 'Коробка')

    def test_service_list(self):
        url = reverse('service-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['name'], 'До клиента')

    def test_status_list(self):
        url = reverse('deliverystatus-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['name'], 'В ожидании')

    def test_cargo_type_list(self):
        url = reverse('cargotype-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['name'], 'Мед. товары') 