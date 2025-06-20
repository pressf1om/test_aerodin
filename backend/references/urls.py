from rest_framework.routers import DefaultRouter
from .views import (
    TransportModelViewSet, PackageTypeViewSet, ServiceViewSet, DeliveryStatusViewSet, CargoTypeViewSet
)

router = DefaultRouter()
router.register(r'transport-models', TransportModelViewSet, basename='transportmodel')
router.register(r'package-types', PackageTypeViewSet, basename='packagetype')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'delivery-statuses', DeliveryStatusViewSet, basename='deliverystatus')
router.register(r'cargo-types', CargoTypeViewSet, basename='cargotype')

urlpatterns = router.urls 