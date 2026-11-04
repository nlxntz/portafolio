# Portafolio Profesional — Nicolás Lintz

Aplicación web Full Stack moderna desarrollada con arquitectura desacoplada: **CodeIgniter 4 (PHP 8.3 REST API)**, **Angular 19 (SPA reactiva con Signals & Standalone Components)** y **MySQL 8**.

---

## 🚀 Arquitectura

* **Backend (`/backend`)**: API RESTful construida con **CodeIgniter 4**, autenticación stateless mediante **JWT** (`firebase/php-jwt`), filtros de seguridad CORS y migraciones de base de datos.
* **Frontend (`/frontend`)**: Single Page Application (SPA) construida con **Angular**, estilizada con **Tailwind CSS** en modo oscuro premium (*Dark Glow*), animaciones fluidas y reactividad mediante **Signals**.
* **Base de Datos**: **MySQL 8.0** administrable desde **DBeaver** o phpMyAdmin.
* **Orquestación**: **Docker Compose** para levantar todo el ecosistema con un solo comando.

---

## 📦 Estructura del Proyecto

```text
portafolio/
├── backend/                  # CodeIgniter 4 REST API
│   ├── app/
│   │   ├── Controllers/Api/  # Auth, Project, Contact, Dashboard
│   │   ├── Database/         # Migraciones y Seeds
│   │   ├── Filters/          # CorsFilter y JwtAuthFilter
│   │   └── Models/           # ProjectModel, MessageModel, UserModel
│   ├── Dockerfile            # PHP 8.3-apache con intl, mysqli, pdo, gd
│   └── .env                  # Variables de entorno y JWT secret
├── frontend/                 # Angular SPA
│   ├── src/app/
│   │   ├── core/             # Servicios HTTP, AuthGuard, AuthInterceptor
│   │   └── features/
│   │       ├── portfolio/    # Vista pública (Hero, About, Skills, Projects, Contact)
│   │       └── admin/        # Panel CMS (Login, Dashboard, CRUD proyectos, Mensajes)
└── docker-compose.yml        # Configuración de servicios Docker
```

---

## 🛠️ Puesta en Marcha con Docker

### 1. Iniciar los contenedores

```bash
docker compose up -d --build
```

Esto iniciará:
* **MySQL 8**: Puerto `3306`
* **Backend API (CodeIgniter 4)**: `http://localhost:8080`
* **Frontend (Angular)**: `http://localhost:4200`

### 2. Ejecutar Migraciones y Seeds de Base de Datos

Una vez que los contenedores estén corriendo, inicializa las tablas y los proyectos iniciales:

```bash
# Instalar dependencias de Composer si no se ejecutaron automáticamente
docker compose exec backend composer install

# Ejecutar migraciones de tablas (users, projects, messages)
docker compose exec backend php spark migrate

# Poblar con datos iniciales (proyectos de Nicolás Lintz y usuario admin)
docker compose exec backend php spark db:seed PortfolioSeeder
```

---

## 🔑 Credenciales del Panel Administrativo (CMS)

* **Ruta de acceso:** `http://localhost:4200/admin/login`
* **Usuario:** `admin` (o `lintznicolas2@gmail.com`)
* **Contraseña inicial:** `Admin@2026!`

---

## 🗄️ Conexión con DBeaver

Para gestionar la base de datos visualmente desde DBeaver:

* **Host:** `localhost`
* **Puerto:** `3306`
* **Database:** `portafolio_db`
* **Username:** `portafolio_user` (o `root`)
* **Password:** `portafolio_password` (o `root`)
