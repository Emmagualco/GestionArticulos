# Desafío: Gestión de Artículos

## Descripción

Aplicación web para gestionar "Artículos", permitiendo crear, listar, actualizar, eliminar y manejar importación/exportación vía archivos Excel.

## Estructura del proyecto

- **backend/**: API REST en Django + Django Rest Framework + MySQL
- **frontend/**: Interfaz de usuario en ReactJS
- **docker-compose.yml**: Orquestación de servicios con Docker

## Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone <repo_url>
   cd <repo_name>
   ```

2. Copia el archivo `.env.example` a `.env` y completa los datos necesarios.

3. Levanta los servicios con Docker:
   ```bash
   docker-compose up --build
   ```

4. Accede a la interfaz:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)

## Funcionalidades

- Crear, editar, eliminar y listar artículos.
- Importar y exportar artículos en formato Excel (.xlsx).

## Importación y exportación de Excel

- Importa artículos desde la interfaz web seleccionando un archivo Excel con las columnas obligatorias: `codigo`, `descripcion`, `precio`.
- Exporta la lista actual de artículos a Excel desde la interfaz.

## Suposiciones y decisiones

- No se implementó autenticación.
- El modelo de artículo solo incluye los campos pedidos.
- Para la importación/exportación de Excel se utilizan `openpyxl` y `pandas` en backend y `xlsx` en frontend.
- Configuración mínima de MySQL para desarrollo.

## Usuarios con acceso al repo

Agregar permisos de lectura a:
- mickaelacrespo@aitsolutions.com.ar
- federicoalloron@aitsolutions.com.ar
