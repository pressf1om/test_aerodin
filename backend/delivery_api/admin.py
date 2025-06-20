from django.contrib import admin
from .models import Delivery

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    """
    Админка для модели Delivery. Позволяет удобно фильтровать, искать и просматривать доставки.
    """
    list_display = (
        'id', 'transport_model', 'transport_number', 'departure_time', 'arrival_time',
        'distance_km', 'status', 'package_type', 'tech_state', 'created_at'
    )  # Отображаемые поля в списке
    list_filter = ('status', 'package_type', 'tech_state', 'transport_model', 'services', 'cargo_type')  # Фильтры справа
    search_fields = ('transport_number',)  # Поиск по номеру транспорта
    date_hierarchy = 'departure_time'  # Иерархия по дате отправки
    filter_horizontal = ('services',)  # Удобный выбор ManyToMany услуг
