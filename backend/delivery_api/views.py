from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Delivery
from .serializers import DeliverySerializer

# Create your views here.

# ViewSet для CRUD операций с доставками
class DeliveryViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления доставками (CRUD). Требует JWT-авторизации.
    """
    queryset = Delivery.objects.all().order_by('-created_at')  # Все доставки, новые сверху
    serializer_class = DeliverySerializer  # Используемый сериализатор
    permission_classes = [permissions.IsAuthenticated]  # Только для авторизованных пользователей
