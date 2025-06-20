from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Delivery
from .serializers import DeliverySerializer
from django_filters import rest_framework as filters
from rest_framework.filters import OrderingFilter

# Create your views here.

class DeliveryFilter(filters.FilterSet):
    arrival_time_after = filters.DateTimeFilter(field_name="arrival_time", lookup_expr='gte')
    arrival_time_before = filters.DateTimeFilter(field_name="arrival_time", lookup_expr='lte')
    
    class Meta:
        model = Delivery
        fields = ['services']

# ViewSet для CRUD операций с доставками
class DeliveryViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления доставками (CRUD). Требует JWT-авторизации.
    """
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = DeliveryFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter)
    ordering_fields = ['delivery_time', 'arrival_time', 'distance']
    ordering = ['-arrival_time'] # Сортировка по умолчанию
