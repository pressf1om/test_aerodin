from rest_framework import serializers
from .models import Delivery
from references.models import TransportModel, PackageType, Service, DeliveryStatus, CargoType

class DeliverySerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Delivery. Осуществляет преобразование между моделью и JSON для API.
    """
    # Поля для получения названий из связанных моделей
    transport_model_name = serializers.CharField(source='transport_model.name', read_only=True)
    status_name = serializers.CharField(source='status.name', read_only=True)
    package_type_name = serializers.CharField(source='package_type.name', read_only=True)
    service_names = serializers.StringRelatedField(source='services', many=True, read_only=True)

    # Поля для записи (принимают ID)
    transport_model = serializers.PrimaryKeyRelatedField(queryset=TransportModel.objects.all(), write_only=True)
    status = serializers.PrimaryKeyRelatedField(queryset=DeliveryStatus.objects.all(), write_only=True)
    package_type = serializers.PrimaryKeyRelatedField(queryset=PackageType.objects.all(), write_only=True)
    services = serializers.PrimaryKeyRelatedField(many=True, queryset=Service.objects.all(), write_only=True)
    
    cargo_type = serializers.PrimaryKeyRelatedField(queryset=CargoType.objects.all(), allow_null=True, required=False)
    media_file = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Delivery
        fields = [
            'id', 'transport_model', 'transport_model_name', 'transport_number', 
            'departure_time', 'arrival_time', 'distance_km', 'media_file', 
            'services', 'service_names', 'status', 'status_name', 
            'package_type', 'package_type_name', 'tech_state', 'cargo_type', 
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'created_at', 'updated_at', 'transport_model_name', 
            'status_name', 'package_type_name', 'service_names'
        ] 