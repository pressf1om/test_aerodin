from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import TransportModel, PackageType, Service, DeliveryStatus, CargoType
from .serializers import (
    TransportModelSerializer, PackageTypeSerializer, ServiceSerializer, DeliveryStatusSerializer, CargoTypeSerializer
)

# Create your views here.

class TransportModelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TransportModel.objects.all()
    serializer_class = TransportModelSerializer
    permission_classes = [permissions.IsAuthenticated]

class PackageTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PackageType.objects.all()
    serializer_class = PackageTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

class DeliveryStatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DeliveryStatus.objects.all()
    serializer_class = DeliveryStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

class CargoTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CargoType.objects.all()
    serializer_class = CargoTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
