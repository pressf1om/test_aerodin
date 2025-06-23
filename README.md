# 🚚 Delivery Report — Fullstack Project

## Оглавление

1. [Описание](#описание)
2. [Структура проекта](#структура-проекта)
3. [Backend (Django)](#backend-django)
4. [Frontend (React)](#frontend-react)
5. [Mobile (React Native)](#mobile-react-native)
6. [Инструкция по запуску](#инструкция-по-запуску)
7. [Docker](#docker)
8. [Полезные команды](#полезные-команды)
9. [Production deploy (VPS, Docker Compose)](#production-deploy-vps-docker-compose)

---

## Описание

**Delivery Report** — система для учёта и отчёта по доставкам, реализованная на Django (backend), React (web frontend) и React Native (mobile).  
Включает авторизацию, справочники, загрузку медиа, отчёты, фильтры, тёмную тему (Material 3).

---

## Структура проекта

```
test_aerodin/
│
├── backend/           # Django backend (API, админка, справочники, медиа)
│   ├── config/        # Настройки Django, urls, wsgi/asgi
│   ├── delivery_api/  # Основная бизнес-логика доставок (модели, views, serializers, тесты)
│   ├── references/    # Справочники (модели транспорта, упаковки, услуги, статусы)
│   ├── users/         # Пользователи и авторизация
│   ├── media/         # Загружаемые файлы (PDF, фото)
│   ├── static/        # Статика для админки и фронта
│   ├── venv/          # Виртуальное окружение (локально)
│   ├── Dockerfile     # Docker-образ backend
│   ├── nginx.conf     # Конфиг nginx для backend
│   ├── requirements.txt # Python-зависимости
│   └── manage.py      # Django CLI
│
├── frontend/          # Веб-приложение (React + Vite + Material UI)
│   ├── src/           # Исходный код (pages, components, api, theme, types)
│   ├── public/        # Статические файлы
│   ├── Dockerfile     # Docker-образ frontend
│   ├── nginx.conf     # Конфиг nginx для frontend
│   ├── package.json   # JS-зависимости
│
├── mobile/DeliveryApp/ # Мобильное приложение (React Native)
│   ├── src/           # Исходный код (screens, components, api, context, theme, types)
│   ├── assets/        # Иконки, splash, изображения
│   ├── app.json       # Expo/React Native конфиг
│   ├── package.json   # JS-зависимости
│   └── index.ts       # Точка входа
│
├── docker-compose.yml # Docker Compose для всего проекта
└── README.md          # (Вы здесь) Главная документация
```

---

## Backend (Django)

- **config/** — настройки проекта, точки входа (asgi/wsgi), маршрутизация.
- **delivery_api/** — модели доставок, сериализаторы, views, urls, тесты.
- **references/** — справочники (модели транспорта, упаковки, услуги, статусы), админка, API, тесты.
- **users/** — кастомная модель пользователя, views, тесты, админка.
- **media/** — директория для загружаемых файлов.
- **static/** — статика для админки и фронта.
- **requirements.txt** — зависимости Python.
- **Dockerfile, nginx.conf** — для деплоя backend.
- **create_test_data.py** — генерация тестовых данных.
- **set_password.py** — скрипт для смены пароля пользователя.

### Основные команды

```sh
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## Frontend (React)

- **src/pages/** — страницы приложения (Login, Report).
- **src/components/** — переиспользуемые компоненты (Loader, Error).
- **src/context/** — контекст авторизации.
- **src/api/** — взаимодействие с backend (axios).
- **src/types/** — типы данных (delivery, user).
- **src/theme/** — Material 3, dark mode.
- **public/** — favicon, иконки.
- **Dockerfile, nginx.conf** — для деплоя SPA.
- **README.md** — документация по frontend.

### Основные команды

```sh
cd frontend
npm install
npm run dev
# или для продакшн
npm run build
```

---

## Mobile (React Native)

- **src/screens/** — экраны приложения (DeliveryForm, DeliveryList, Login).
- **src/components/** — переиспользуемые компоненты (SelectionRow).
- **src/api/** — взаимодействие с backend (deliveryService, api).
- **src/context/** — контекст авторизации.
- **src/navigation/** — навигация (AppStack, AuthStack).
- **src/theme/** — Material 3, dark mode.
- **src/types/** — типы данных.
- **assets/** — иконки, splash.
- **app.json** — конфиг Expo/React Native.
- **package.json** — зависимости.

### Основные команды

```sh
cd mobile/DeliveryApp
npm install
npx expo start
# Для сборки APK:
npx expo build:android
```

---

## Инструкция по запуску

### 1. Backend

```sh
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. Frontend

```sh
cd frontend
npm install
npm run dev
```

### 3. Mobile

```sh
cd mobile/DeliveryApp
npm install
npx expo start
```

---

## Docker

### Запуск всего проекта через Docker Compose

```sh
docker-compose up --build
```

- Backend будет доступен на http://localhost:8000
- Frontend — на http://localhost:8080

---

## Production deploy (VPS, Docker Compose)

1. Установите Docker и docker-compose на сервер (Ubuntu/Debian):
   ```sh
   sudo apt update
   sudo apt install -y docker.io docker-compose
   sudo usermod -aG docker $USER
   # Перезайдите в сессию или выполните: newgrp docker
   ```
2. Клонируйте проект:
   ```sh
   git clone <URL_ВАШЕГО_РЕПО>
   cd <имя_проекта>
   ```
3. Создайте файл .env на основе .env.example:
   ```sh
   cp .env.example .env
   # Отредактируйте SECRET_KEY и другие параметры при необходимости
   ```
4. Запустите проект:
   ```sh
   docker-compose up --build -d
   ```
5. Проверьте логи (если нужно):
   ```sh
   docker-compose logs -f
   ```
6. Создайте суперпользователя Django (один раз):
   ```sh
   docker-compose exec backend python manage.py createsuperuser + миграции
   ```
7. Откройте в браузере:
   - Backend: http://<IP_СЕРВЕРА>:8000
   - Frontend: http://<IP_СЕРВЕРА>:8080
   - Django admin: http://<IP_СЕРВЕРА>:8000/admin

---

## Полезные команды

- **Создать тестовые данные:**  
  `python backend/create_test_data.py`
- **Сменить пароль пользователя:**  
  `python backend/set_password.py`

---

**Проект реализован с использованием современных технологий, поддерживает тёмную тему, авторизацию, работу со справочниками и медиа, а также легко масштабируется и деплоится.** 