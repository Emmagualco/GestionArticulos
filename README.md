# Gestión de Artículos - Desafío Soporte L2 L3

Aplicación fullstack para la gestión de artículos con importación/exportación Excel, login, roles de usuario y acciones masivas. Dockerizada y lista para producción.

## Tecnologías
- **Frontend:** ReactJS + Axios + CSS moderno
- **Backend:** Django REST Framework + MySQL
- **Contenedores:** Docker, Docker Compose
- **Servidor estático:** Nginx (sirve el build de React)

## Requisitos técnicos y recomendaciones
- **ReactJS:** versión 17 o superior (usado en este proyecto: 18)
- **Python:** versión 3.8 o superior (usado en este proyecto: 3.11)
- **MySQL:** base de datos relacional, dockerizada
- **Docker Compose:** define todos los servicios
- **Backend:** Django REST Framework, API RESTful
- **Frontend:** ReactJS, Axios, CSS

## Instalación y ejecución rápida


## Cómo construir y ejecutar en Windows y Linux

### 1. Clona el repositorio
```sh
git clone https://github.com/Emmagualco/GestionArticulos.git
cd GestionArticulos
```

### 2. Instala Docker y Docker Compose
- **Windows:** Descarga e instala [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- **Linux:** Instala Docker y Docker Compose desde tu gestor de paquetes o desde [docker.com](https://docs.docker.com/get-docker/).

### 3. Construye y ejecuta la aplicación

- **Windows (PowerShell):**
  ```powershell
  docker-compose build --no-cache
  docker-compose up --build
  ```

- **Linux (bash):**
  ```bash
  docker-compose build --no-cache
  docker-compose up --build
  ```

Esto construye y levanta todos los servicios. El frontend estará en `http://localhost:3000` y el backend en `http://localhost:8000`.

4. **Usuarios iniciales:**
   - Admin: `admin` / `admin`
   - User: `user` / `user`

## Funcionalidades principales
- **Login y roles:** Solo usuarios autenticados pueden acceder. El admin puede eliminar y editar masivamente, el user solo editar masivamente.
- **CRUD de artículos:** Crear, editar, eliminar artículos individualmente y en lote.
- **Importar desde Excel:**
  - Formato esperado: columnas `codigo`, `descripcion`, `precio`.
  - Archivos soportados: `.xlsx`, `.xls`.
  - Feedback visual y validación avanzada.
- **Exportar a Excel:** Exporta la lista filtrada de artículos a Excel.
- **Acciones masivas:** Selección por checkbox, edición y eliminación en lote según rol.
- **Persistencia de sesión:** El login se mantiene al recargar la página por 10 minutos de inactividad.
- **Interfaz moderna:** Responsive, accesible, con feedback visual y mensajes claros.
- **Ordenar artículos:** Puedes ordenar la lista por código, descripción o precio haciendo clic en el encabezado de cada columna.

## Importación y exportación de artículos
- **Importar:**
  1. Haz clic en "Importar Excel".
  2. Selecciona el archivo con el formato correcto.
  3. Revisa el feedback visual y corrige errores si aparecen.

### Formato de archivo Excel para importar artículos

El archivo debe tener una hoja principal con las siguientes columnas (en la primera fila):

| codigo | descripcion | precio |
|--------|-------------|--------|
| 123    | Lápiz       | 10.50  |
| 456    | Goma        | 5.00   |
| ...    | ...         | ...    |

**Reglas y recomendaciones:**
- La primera fila debe contener los nombres exactos de las columnas: `codigo`, `descripcion`, `precio` (todo en minúsculas, sin tildes ni espacios extra).
- Los códigos deben ser únicos y no vacíos.
- La columna `precio` debe ser un número (puede tener decimales, usar punto como separador).
- Se aceptan archivos `.xlsx` y `.xls`.
- Si hay errores de formato, el sistema mostrará mensajes claros para corregirlos.
- Puedes exportar un ejemplo desde la app para usarlo como plantilla.
- Si el archivo tiene una columna `id`, debe quedar vacía o no estar presente; el sistema asigna los IDs automáticamente.
- **Exportar:**
  1. Haz clic en "Exportar Excel".
  2. Se descargará el archivo con los artículos filtrados.

## Suposiciones y decisiones de diseño relevantes
- El sistema implementa roles de usuario (admin/user) para demostrar seguridad y control de acciones, aunque el desafío solo exige CRUD básico.
- El usuario admin se crea automáticamente al iniciar el backend si no existe, para facilitar pruebas y acceso inmediato.
- La persistencia de sesión se maneja en el frontend con `localStorage` y expira tras 10 minutos de inactividad para mayor seguridad.
- El backend valida el formato de importación Excel y muestra errores claros, priorizando la experiencia de usuario.
- El frontend está dockerizado y servido por Nginx para simular un entorno productivo real.
- El sistema está preparado para ampliarse fácilmente con más roles, paginación, validaciones avanzadas y nuevas funcionalidades.
- El import/export de Excel usa el mismo formato para facilitar la interoperabilidad y evitar errores de usuario.
- Se priorizó la accesibilidad y el feedback visual en la interfaz para mejorar la usabilidad.
- Las fechas de creación y modificación se agregaron para trazabilidad, aunque no son requeridas explícitamente.
- Se documentaron todos los endpoints y se recomienda agregar pruebas automáticas para robustez.

## Contacto y acceso al repositorio
- Repositorio privado y compartido con:
  - mickaelacrespo@aitsolutions.com.ar
  - federicoalloron@aitsolutions.com.ar

## Ejemplo de uso
1. Inicia sesión como admin o user.
2. Crea, edita o elimina artículos.
3. Importa artículos desde Excel y exporta la lista filtrada.
4. Usa las acciones masivas según tu rol.

## Posibles mejoras futuras para producción
- **Paginación:** Para grandes volúmenes de artículos, agregar paginación en la API y el frontend.
- **Validación avanzada:** Mejorar la validación de importación Excel (duplicados, tipos, rangos).
- **Pruebas automáticas:** Agregar tests unitarios y de integración para backend y frontend.
- **Documentación de la API:** Incluir Swagger/OpenAPI para facilitar el consumo de la API.
- **Internacionalización:** Preparar el frontend para múltiples idiomas.
- **Logs y monitoreo:** Agregar logging y monitoreo en backend y frontend para producción.
- **Seguridad:** Mejorar el manejo de contraseñas y roles, usar HTTPS en producción.

## Documentación de la API
- La API principal está en `/api/articulos/` y soporta operaciones CRUD.
- Endpoints adicionales:
  - `/api/articulos/login/` (login de usuario)
  - `/api/articulos/bulk-delete/` (eliminación masiva)
  - `/api/articulos/bulk-update/` (edición masiva)

## Pruebas automáticas
- Se recomienda agregar tests en `backend/articulos/tests.py` y en el frontend usando Jest/React Testing Library.

---

