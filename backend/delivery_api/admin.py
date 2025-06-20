from django.contrib import admin
from .models import Delivery

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'transport_model', 'transport_number', 'departure_time', 'arrival_time',
        'distance_km', 'status', 'package_type', 'tech_state', 'created_at'
    )
    list_filter = ('status', 'package_type', 'tech_state', 'transport_model', 'services', 'cargo_type')
    search_fields = ('transport_number',)
    date_hierarchy = 'departure_time'
    filter_horizontal = ('services',)
