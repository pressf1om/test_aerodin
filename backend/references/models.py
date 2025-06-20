from django.db import models

# Модели справочников для доставки
class TransportModel(models.Model):
    """
    Модель транспорта (например: V01, X20, REX и т.д.)
    """
    name = models.CharField('Модель', max_length=50, unique=True)

    class Meta:
        verbose_name = 'Модель транспорта'
        verbose_name_plural = 'Модели транспорта'

    def __str__(self):
        return self.name

class PackageType(models.Model):
    """
    Тип упаковки (например: Пакет до 1 кг, Коробка и т.д.)
    """
    name = models.CharField('Тип упаковки', max_length=50, unique=True)

    class Meta:
        verbose_name = 'Тип упаковки'
        verbose_name_plural = 'Типы упаковки'

    def __str__(self):
        return self.name

class Service(models.Model):
    """
    Услуга (например: До клиента, Хрупкий груз и т.д.)
    """
    name = models.CharField('Услуга', max_length=50, unique=True)

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'

    def __str__(self):
        return self.name

class DeliveryStatus(models.Model):
    """
    Статус доставки (например: В ожидании, Проведено)
    """
    name = models.CharField('Статус', max_length=30, unique=True)

    class Meta:
        verbose_name = 'Статус доставки'
        verbose_name_plural = 'Статусы доставки'

    def __str__(self):
        return self.name

class CargoType(models.Model):
    """
    Тип груза (опционально)
    """
    name = models.CharField('Тип груза', max_length=50, unique=True)

    class Meta:
        verbose_name = 'Тип груза'
        verbose_name_plural = 'Типы груза'

    def __str__(self):
        return self.name
