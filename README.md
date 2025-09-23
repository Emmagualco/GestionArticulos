# 📦 Gestión de Artículos - Desafío Soporte L2 L3

Aplicación **fullstack** para la gestión de artículos con importación/exportación Excel, login, roles de usuario y acciones masivas.  
La solución está **dockerizada y lista para producción**.

---

## 📑 Índice
1. [Descripción](#-descripción)
2. [Tecnologías](#-tecnologías)
3. [Requisitos técnicos y recomendaciones](#-requisitos-técnicos-y-recomendaciones)
4. [Instalación y ejecución rápida](#-instalación-y-ejecución-rápida)
5. [Funcionalidades principales](#-funcionalidades-principales)
6. [Importación y exportación de artículos](#-importación-y-exportación-de-artículos)
7. [Suposiciones y decisiones de diseño relevantes](#-suposiciones-y-decisiones-de-diseño-relevantes)
8. [Posibles mejoras futuras](#-posibles-mejoras-futuras-para-producción)
9. [Documentación de la API](#-documentación-de-la-api)
10. [Pruebas automáticas](#-pruebas-automáticas)
11. [Contacto y acceso al repositorio](#-contacto-y-acceso-al-repositorio)

---

## 🚀 Descripción
La aplicación permite gestionar artículos con funcionalidades de login, control de roles, CRUD completo, acciones masivas y soporte para importación/exportación en formato Excel.  
Incluye un frontend moderno (ReactJS) y un backend robusto (Django REST Framework + MySQL), orquestados con **Docker Compose**.

---

## 🛠 Tecnologías
- **Frontend**: ReactJS + Axios + CSS moderno
- **Backend**: Django REST Framework + MySQL
- **Contenedores**: Docker, Docker Compose
- **Servidor estático**: Nginx (sirve el build de React)

---

## 📋 Requisitos técnicos y recomendaciones
- **ReactJS**: versión 17 o superior *(usado en este proyecto: 18)*
- **Python**: versión 3.8 o superior *(usado en este proyecto: 3.11)*
- **MySQL**: base de datos relacional, dockerizada
- **Docker Compose**: define todos los servicios

---

## ⚙️ Instalación y ejecución rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/Emmagualco/GestionArticulos.git
cd GestionArticulos
```

### 2. Instalar Docker y Docker Compose
- **Windows**: instalar [Docker Desktop](https://www.docker.com/products/docker-desktop/).  
- **Linux**: instalar Docker y Docker Compose desde tu gestor de paquetes o desde [docker.com](https://www.docker.com/).

### 3. Construir y ejecutar la aplicación

**Windows (PowerShell):**
```powershell
docker-compose build --no-cache
docker-compose up --build
```

**Linux (bash):**
```bash
docker-compose build --no-cache
docker-compose up --build
```

👉 Esto construye y levanta todos los servicios.  
- Frontend: [http://localhost:3000](http://localhost:3000)  
- Backend: [http://localhost:8000](http://localhost:8000)

### 4. Usuarios iniciales
- **Admin** → usuario: `admin` | contraseña: `admin`  
- **User** → usuario: `user` | contraseña: `user`

---

## ✨ Funcionalidades principales
- **Login y roles**:  
  - *Admin*: CRUD completo, edición y eliminación masiva.  
  - *User*: edición masiva únicamente.  
- **CRUD de artículos**: alta, baja y modificación de forma individual o en lote.  
- **Importar desde Excel**: validación avanzada, feedback visual.  
- **Exportar a Excel**: exporta lista filtrada.  
- **Acciones masivas**: selección por checkbox con permisos según rol.  
- **Persistencia de sesión**: 10 minutos de inactividad con `localStorage`.  
- **Interfaz moderna**: responsive, accesible, con feedback visual.  
- **Ordenar artículos**: por código, descripción o precio.  

---

## 📊 Importación y exportación de artículos

### Importar
1. Haz clic en **"Importar Excel"**.  
2. Selecciona el archivo con el formato correcto.  
3. Revisa el feedback visual y corrige errores si aparecen.  

**Formato de archivo Excel:**

| codigo | descripcion | precio |
|--------|-------------|--------|
| 123    | Lápiz       | 10.50  |
| 456    | Goma        | 5.00   |

**Reglas:**
- La primera fila debe contener: `codigo`, `descripcion`, `precio` (minúsculas, sin acentos).  
- Los códigos deben ser **únicos y no vacíos**.  
- `precio` debe ser numérico (punto como separador decimal).  
- Archivos soportados: `.xlsx`, `.xls`.  
- Si hay errores → el sistema muestra mensajes claros.  
- El campo `id` se genera automáticamente.  

👉 Puedes exportar un ejemplo desde la app para usarlo como plantilla.  

### Exportar
1. Haz clic en **"Exportar Excel"**.  
2. Se descargará el archivo con los artículos filtrados.  

---

## 📑 Suposiciones y decisiones de diseño relevantes
- Se implementaron **roles de usuario (admin/user)** para demostrar control de seguridad.  
- El usuario **admin se crea automáticamente** en el backend para facilitar pruebas.  
- La **persistencia de sesión** se maneja con `localStorage` y expira a los 10 minutos.  
- El backend valida los Excel con mensajes claros, priorizando la experiencia de usuario.  
- El **frontend está dockerizado y servido con Nginx**, simulando un entorno real de producción.  
- Se reutiliza el mismo formato en import/export para evitar errores de usuario.  
- Se priorizó la **accesibilidad** y el **feedback visual** en la interfaz.  
- Se agregaron **fechas de creación y modificación** para trazabilidad.  
- El sistema es fácilmente escalable (más roles, validaciones, paginación).  

---

## 🔮 Posibles mejoras futuras para producción
- Paginación para grandes volúmenes de artículos.  
- Validación avanzada de Excel (duplicados, tipos, rangos).  
- Pruebas automáticas backend y frontend.  
- Documentación de la API con Swagger/OpenAPI.  
- Internacionalización del frontend.  
- Logs y monitoreo.  
- Seguridad avanzada: encriptación de contraseñas, HTTPS.  

---

## 📚 Documentación de la API
- **Principal**: `/api/articulos/` → operaciones CRUD.  
- **Login**: `/api/articulos/login/`  
- **Eliminación masiva**: `/api/articulos/bulk-delete/`  
- **Edición masiva**: `/api/articulos/bulk-update/`  

---

## 🧪 Pruebas automáticas
- **Backend**: agregar en `backend/articulos/tests.py`.  
- **Frontend**: Jest + React Testing Library.  

---

## 👥 Contacto y acceso al repositorio
El repositorio es **privado** y compartido con:  
- mickaelacrespo@aitsolutions.com.ar  
- federicoalloron@aitsolutions.com.ar  

---
