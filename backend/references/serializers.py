from rest_framework import serializers
from .models import TransportModel, PackageType, Service, DeliveryStatus, CargoType

class TransportModelSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели TransportModel (модель транспорта).
    """
    class Meta:
        model = TransportModel
        fields = ['id', 'name']

class PackageTypeSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели PackageType (тип упаковки).
    """
    class Meta:
        model = PackageType
        fields = ['id', 'name']

class ServiceSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Service (услуга).
    """
    class Meta:
        model = Service
        fields = ['id', 'name']

class DeliveryStatusSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели DeliveryStatus (статус доставки).
    """
    class Meta:
        model = DeliveryStatus
        fields = ['id', 'name']

class CargoTypeSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели CargoType (тип груза).
    """
    class Meta:
        model = CargoType
        fields = ['id', 'name'] 