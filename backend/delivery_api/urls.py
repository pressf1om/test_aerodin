from rest_framework.routers import DefaultRouter
from .views import DeliveryViewSet

# Роутер для CRUD операций с доставками
router = DefaultRouter()
router.register(r'deliveries', DeliveryViewSet, basename='delivery')

#: urlpatterns содержит все маршруты для DeliveryViewSet
urlpatterns = router.urls 