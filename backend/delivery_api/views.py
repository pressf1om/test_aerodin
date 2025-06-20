from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Delivery
from .serializers import DeliverySerializer

# Create your views here.

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all().order_by('-created_at')
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]
