from rest_framework import serializers
from .models import TransportModel, PackageType, Service, DeliveryStatus, CargoType

class TransportModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportModel
        fields = ['id', 'name']

class PackageTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageType
        fields = ['id', 'name']

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name']

class DeliveryStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryStatus
        fields = ['id', 'name']

class CargoTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CargoType
        fields = ['id', 'name'] 