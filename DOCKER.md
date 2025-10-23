# Docker Setup for Smart Routes

Este proyecto incluye configuración completa de Docker para desarrollo y producción.

## Archivos incluidos

- `docker-compose.yml` - Configuración principal de Docker Compose
- `Dockerfile` - Imagen de la aplicación NestJS
- `.dockerignore` - Archivos excluidos del contexto de build
- `.env.example` - Variables de entorno de ejemplo

## Servicios incluidos

### smart-routes (Aplicación principal)
- **Puerto**: 3000
- **Base**: Node.js 18 Alpine
- **Características**:
  - Build optimizado para producción
  - Usuario no-root para seguridad
  - Health check integrado
  - Soporte para SQLite y PostgreSQL

### redis (Cache y sesiones)
- **Puerto**: 6379
- **Base**: Redis 7 Alpine
- **Características**:
  - Persistencia de datos
  - Configuración optimizada

### postgres (Base de datos alternativa)
- **Puerto**: 5432
- **Base**: PostgreSQL 15 Alpine
- **Características**:
  - Base de datos: `smart_routes`
  - Usuario: `smart_routes`
  - Contraseña: `smart_routes_password`
- **Nota**: Servicio opcional (usar con `--profile postgres`)

## Uso

### Desarrollo

1. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   # Editar .env con tus valores reales
   ```

2. **Iniciar servicios**:
   ```bash
   docker-compose up -d
   ```

3. **Ver logs**:
   ```bash
   docker-compose logs -f smart-routes
   ```

4. **Parar servicios**:
   ```bash
   docker-compose down
   ```

### Con PostgreSQL

Para usar PostgreSQL en lugar de SQLite:

```bash
docker-compose --profile postgres up -d
```

### Comandos útiles

```bash
# Rebuild de la aplicación
docker-compose build smart-routes

# Ejecutar comandos en el contenedor
docker-compose exec smart-routes npm run test

# Ver estado de servicios
docker-compose ps

# Limpiar volúmenes
docker-compose down -v
```

## Variables de entorno requeridas

### Obligatorias
- `GOOGLE_MAPS_API_KEY` - API Key de Google Maps
- `FIREBASE_CREDENTIALS_JSON` - Credenciales de Firebase (JSON)

### Opcionales
- `NODE_ENV` - Entorno (default: development)
- `PORT` - Puerto (default: 3000)
- `DATABASE_URL` - URL de base de datos (para PostgreSQL)

## URLs de acceso

- **Aplicación**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api
- **WebSocket Monitor**: http://localhost:3000/index.html

## Estructura de volúmenes

```
./tmp          -> /app/tmp          # Base de datos SQLite
./public       -> /app/public       # Archivos estáticos
redis_data     -> /data             # Datos de Redis
postgres_data  -> /var/lib/postgresql/data  # Datos de PostgreSQL
```

## Producción

Para despliegue en producción:

1. **Configurar variables de entorno de producción**
2. **Usar imagen optimizada**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. **Configurar proxy reverso** (nginx/traefik) para SSL y dominio

## Troubleshooting

### Problemas comunes

1. **Error de permisos en SQLite**:
   ```bash
   sudo chown -R $USER:$USER ./tmp
   ```

2. **Puerto ya en uso**:
   ```bash
   # Cambiar puerto en docker-compose.yml
   ports:
     - "3001:3000"
   ```

3. **Problemas de memoria**:
   ```bash
   # Aumentar memoria para Docker
   # En Docker Desktop: Settings -> Resources -> Memory
   ```

### Logs y debugging

```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs smart-routes

# Entrar al contenedor
docker-compose exec smart-routes sh

# Ver estadísticas de recursos
docker stats
```
