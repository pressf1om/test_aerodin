from django.contrib import admin
from .models import TransportModel, PackageType, Service, DeliveryStatus, CargoType

@admin.register(TransportModel)
class TransportModelAdmin(admin.ModelAdmin):
    """
    Админка для справочника моделей транспорта.
    """
    list_display = ('id', 'name')  # Отображаемые поля
    search_fields = ('name',)  # Поиск по названию

@admin.register(PackageType)
class PackageTypeAdmin(admin.ModelAdmin):
    """
    Админка для справочника типов упаковки.
    """
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    """
    Админка для справочника услуг.
    """
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(DeliveryStatus)
class DeliveryStatusAdmin(admin.ModelAdmin):
    """
    Админка для справочника статусов доставки.
    """
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(CargoType)
class CargoTypeAdmin(admin.ModelAdmin):
    """
    Админка для справочника типов груза.
    """
    list_display = ('id', 'name')
    search_fields = ('name',)
