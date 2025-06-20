# Delivery Backend (Django + DRF + Docker)

## Описание

Бэкенд для системы учёта и отчётов по доставкам. Реализован на Django + DRF, поддерживает JWT-авторизацию, работу со справочниками, загрузку медиафайлов, покрыт тестами, готов к продакшн-деплою через Docker (nginx + gunicorn).

---

## Структура проекта

```
backend/
  ├── delivery_api/         # Основное приложение (доставки, API)
  ├── references/           # Справочники (транспорт, услуги, упаковка и пр.)
  ├── users/                # Пользователи (расширяемо)
  ├── config/               # Настройки Django
  ├── static/               # Статика (автосборка)
  ├── media/                # Медиафайлы
  ├── requirements.txt      # Зависимости
  ├── Dockerfile            # Docker-образ Django
  ├── docker-compose.yml    # Компоновка сервисов (nginx, gunicorn, postgres)
  ├── nginx.conf            # Конфиг nginx
  └── .env                  # Переменные окружения
```

---

## Быстрый старт (через Docker)

1. **Склонируй репозиторий и перейди в папку backend:**
   ```sh
   cd backend
   ```
2. **Создай файл `.env` (пример):**
   ```env
   SECRET_KEY=your-very-secret-key
   POSTGRES_DB=delivery_db
   POSTGRES_USER=delivery_user
   POSTGRES_PASSWORD=delivery_pass
   POSTGRES_HOST=db
   POSTGRES_PORT=5432
   ```
3. **Построй и запусти контейнеры:**
   ```sh
   docker-compose build
   docker-compose up -d
   ```
4. **Создай суперпользователя:**
   ```sh
   docker-compose exec web python manage.py createsuperuser
   ```
5. **Открой в браузере:**
   - Django Admin: http://localhost/admin/
   - API: http://localhost/api/

---

## Основные возможности
- JWT-авторизация (эндпоинты: `/api/token/`, `/api/token/refresh/`)
- CRUD для доставок (`/api/deliveries/`)
- Справочники (только чтение):
  - `/api/references/transport-models/`
  - `/api/references/package-types/`
  - `/api/references/services/`
  - `/api/references/delivery-statuses/`
  - `/api/references/cargo-types/`
- Загрузка медиафайлов (PDF, фото и др.)
- Управление пользователями и справочниками через Django Admin
- Покрытие тестами (модели, API, права доступа)

---

## Тесты

Запуск всех тестов:
```sh
# В контейнере web
python manage.py test
# Или из хоста
docker-compose exec web python manage.py test
```

---

## Примеры API-запросов

**Получить JWT-токен:**
```sh
curl -X POST http://localhost/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'
```

**Получить список доставок:**
```sh
curl -H "Authorization: Bearer <access>" http://localhost/api/deliveries/
```

**Создать доставку:**
```sh
curl -X POST http://localhost/api/deliveries/ \
  -H "Authorization: Bearer <access>" \
  -H "Content-Type: application/json" \
  -d '{
    "transport_model": 1,
    "transport_number": "V01-123",
    "departure_time": "2025-06-20T12:00:00Z",
    "arrival_time": "2025-06-20T14:00:00Z",
    "distance_km": "15.5",
    "services": [1],
    "status": 1,
    "package_type": 1,
    "tech_state": "ok",
    "cargo_type": 1
  }'
```

---

## Примечания
- Все API защищены JWT, кроме получения токена.
- Для загрузки файлов используй multipart/form-data.
- Для production используется nginx + gunicorn, статика и медиа раздаются nginx.
- Все справочники и пользователи управляются через Django Admin.

---

## Контакты и поддержка
Вопросы по проекту — в Telegram HR или через GitHub Issues. 