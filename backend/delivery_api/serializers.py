from rest_framework import serializers
from .models import Delivery
from references.models import TransportModel, PackageType, Service, DeliveryStatus, CargoType

class DeliverySerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Delivery. Осуществляет преобразование между моделью и JSON для API.
    """
    services = serializers.PrimaryKeyRelatedField(many=True, queryset=Service.objects.all())  # Список ID услуг
    transport_model = serializers.PrimaryKeyRelatedField(queryset=TransportModel.objects.all())  # ID модели транспорта
    status = serializers.PrimaryKeyRelatedField(queryset=DeliveryStatus.objects.all())  # ID статуса доставки
    package_type = serializers.PrimaryKeyRelatedField(queryset=PackageType.objects.all())  # ID типа упаковки
    cargo_type = serializers.PrimaryKeyRelatedField(queryset=CargoType.objects.all(), allow_null=True, required=False)  # ID типа груза (опционально)
    media_file = serializers.FileField(required=False, allow_null=True)  # Медиафайл (опционально)

    class Meta:
        model = Delivery
        fields = [
            'id', 'transport_model', 'transport_number', 'departure_time', 'arrival_time',
            'distance_km', 'media_file', 'services', 'status', 'package_type', 'tech_state',
            'cargo_type', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']  # Эти поля только для чтения 