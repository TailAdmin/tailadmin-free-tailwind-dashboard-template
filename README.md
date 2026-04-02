# Admin T1 Support — Panel Administrativo

Dashboard administrativo construido con **React + TypeScript + Vite**, con autenticación JWT, control de acceso basado en roles (RBAC) y gestión de usuarios.

## Stack

- **React 18** + **TypeScript**
- **Vite** — servidor de desarrollo y bundler
- **React Router v6** — enrutamiento con rutas protegidas
- **Tailwind CSS** — estilos
- **Axios** — cliente HTTP
- **Framer Motion** — animaciones
- **MUI / Emotion** — componentes de UI complementarios
- **ApexCharts** — visualización de datos

## Requisitos

- Node.js 18+
- API backend corriendo en `http://localhost:3000` (configurable via `.env`)

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd admin-t1-support

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu API

# 4. Iniciar en desarrollo
npm run dev
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el bundle de producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint |

## Estructura del proyecto

```
src/
├── components/
│   ├── Login.tsx          # Pantalla de autenticación
│   ├── Dashboard.tsx      # Layout principal con sidebar
│   ├── DashboardHome.tsx  # Vista de inicio con métricas
│   ├── UsersList.tsx      # Listado y gestión de usuarios
│   ├── CreateUser.tsx     # Formulario de creación de usuarios
│   ├── Profile.tsx        # Perfil del usuario autenticado
│   ├── Header.tsx         # Cabecera del dashboard
│   └── ProtectedRoute.tsx # Guard de rutas con validación de rol
├── models/
│   └── roles.ts           # Enum de roles (SUPER_USER / SECONDARY_USER)
├── services/              # Llamadas a la API (axios)
└── utils/                 # Utilidades compartidas
```

## Roles de usuario

| Rol | Permisos |
|---|---|
| `SUPER_USER` | Acceso total: dashboard, listado de usuarios, creación de usuarios, perfil |
| `SECONDARY_USER` | Acceso limitado: dashboard y perfil únicamente |

## Rutas

| Ruta | Componente | Acceso |
|---|---|---|
| `/auth/login` | `Login` | Público |
| `/dashboard` | `DashboardHome` | Autenticado |
| `/dashboard/users` | `UsersList` | Solo `SUPER_USER` |
| `/dashboard/users/create` | `CreateUser` | Solo `SUPER_USER` |
| `/dashboard/profile` | `Profile` | Autenticado |
