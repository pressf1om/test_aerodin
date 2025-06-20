from django.db import models
from references.models import (
    TransportModel, PackageType, Service, DeliveryStatus, CargoType
)

class Delivery(models.Model):
    """
    Модель доставки. Хранит информацию о доставке: транспорт, время, дистанция, услуги, статус, упаковка, тех. состояние, тип груза, медиафайл.
    """
    TECH_STATE_CHOICES = [
        ('ok', 'Исправно'),
        ('broken', 'Неисправно'),
    ]

    transport_model = models.ForeignKey(
        TransportModel, on_delete=models.PROTECT, verbose_name='Модель транспорта'
    )  # Справочник моделей транспорта
    transport_number = models.CharField('Номер транспорта', max_length=50)
    departure_time = models.DateTimeField('Время отправки')
    arrival_time = models.DateTimeField('Время доставки')
    distance_km = models.DecimalField('Дистанция (км)', max_digits=7, decimal_places=2)
    media_file = models.FileField('Медиафайл', upload_to='deliveries/', blank=True, null=True)  # Необязательный файл
    services = models.ManyToManyField(Service, verbose_name='Услуги')  # Справочник услуг
    status = models.ForeignKey(
        DeliveryStatus, on_delete=models.PROTECT, verbose_name='Статус доставки'
    )  # Справочник статусов
    package_type = models.ForeignKey(
        PackageType, on_delete=models.PROTECT, verbose_name='Тип упаковки'
    )  # Справочник упаковок
    tech_state = models.CharField(
        'Техническое состояние', max_length=10, choices=TECH_STATE_CHOICES, default='ok'
    )  # Исправно/Неисправно
    cargo_type = models.ForeignKey(
        CargoType, on_delete=models.SET_NULL, verbose_name='Тип груза', blank=True, null=True
    )  # Опциональный справочник типа груза
    created_at = models.DateTimeField('Создано', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Доставка'
        verbose_name_plural = 'Доставки'
        ordering = ['-created_at']

    def __str__(self):
        """
        Строковое представление доставки для админки и shell.
        """
        return f"{self.transport_model} {self.transport_number} ({self.departure_time:%d.%m.%Y %H:%M})"
