from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import TransportModel, PackageType, Service, DeliveryStatus, CargoType
from .serializers import (
    TransportModelSerializer, PackageTypeSerializer, ServiceSerializer, DeliveryStatusSerializer, CargoTypeSerializer
)

# ViewSet-ы для справочников (только чтение, доступны только авторизованным)
class TransportModelViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для справочника моделей транспорта (только чтение).
    """
    queryset = TransportModel.objects.all()
    serializer_class = TransportModelSerializer
    permission_classes = [permissions.IsAuthenticated]

class PackageTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для справочника типов упаковки (только чтение).
    """
    queryset = PackageType.objects.all()
    serializer_class = PackageTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для справочника услуг (только чтение).
    """
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

class DeliveryStatusViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для справочника статусов доставки (только чтение).
    """
    queryset = DeliveryStatus.objects.all()
    serializer_class = DeliveryStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

class CargoTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для справочника типов груза (только чтение).
    """
    queryset = CargoType.objects.all()
    serializer_class = CargoTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
