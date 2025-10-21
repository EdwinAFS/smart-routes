# Guía de Despliegue en Railway 🚂

## ✅ Cambios Realizados

El código ya está configurado para funcionar en Railway. Los cambios incluyen:

- **Detección automática de entorno**: El código detecta si está corriendo en Railway
- **Soporte para volúmenes**: Si montas un volumen en `/data`, se usará automáticamente
- **Fallback inteligente**: Si no hay volumen, usa un directorio local (pero los datos no persistirán entre redespliegues)

## 📋 Pasos para Desplegar

### 1. Crear Proyecto en Railway

```bash
# Instala Railway CLI (si no lo tienes)
npm i -g @railway/cli

# Inicia sesión
railway login

# Inicializa el proyecto
railway init
```

### 2. Variables de Entorno

Configura estas variables en Railway Dashboard:

```env
NODE_ENV=production
PORT=3000

# Si usas Firebase para notificaciones push
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY=tu-private-key
FIREBASE_CLIENT_EMAIL=tu-client-email
```

### 3. (Opcional pero Recomendado) Configurar Volumen

Para que tu base de datos SQLite persista entre redespliegues:

1. Ve al dashboard de Railway → tu servicio
2. Click en "Volumes" → "Add Volume"
3. Mount Path: `/data`
4. Size: 1 GB (o el que necesites)

### 4. Desplegar

```bash
# Opción 1: Desde CLI
railway up

# Opción 2: Conectar repositorio de GitHub
# Ve a Railway Dashboard → Connect GitHub Repo
```

## ⚠️ Consideraciones Importantes

### SQLite en Producción

SQLite funciona para proyectos pequeños, pero tiene limitaciones:

- ❌ No soporta múltiples instancias (si escalas horizontalmente)
- ❌ Problemas de concurrencia con muchos usuarios simultáneos
- ❌ Sin backups automáticos

### Recomendación: Usar PostgreSQL

Railway ofrece PostgreSQL gratis en el plan hobby. Para migrar:

1. **Agrega PostgreSQL en Railway:**
   - Dashboard → "New" → "Database" → "Add PostgreSQL"
   - Railway automáticamente crea la variable `DATABASE_URL`

2. **Instala el driver de PostgreSQL:**
   ```bash
   npm install pg
   ```

3. **Actualiza `app.module.ts`:**
   ```typescript
   TypeOrmModule.forRoot({
     type: 'postgres',
     url: process.env.DATABASE_URL,
     entities: [User, DeviceToken, OwnTracksPayload],
     synchronize: process.env.NODE_ENV !== 'production', // ¡Solo en desarrollo!
     ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
   }),
   ```

4. **Para producción, usa migraciones en lugar de `synchronize: true`:**
   ```bash
   npm install @nestjs/typeorm typeorm
   npx typeorm migration:generate -n InitialMigration
   npx typeorm migration:run
   ```

## 🔍 Verificación

Después de desplegar, verifica que todo funcione:

```bash
# Obtén la URL de tu app
railway domain

# Prueba el health check
curl https://tu-app.railway.app/

# Verifica la documentación de la API
# Abre en navegador: https://tu-app.railway.app/api
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- Verifica que el volumen esté montado correctamente
- Revisa los logs: `railway logs`

### Error: "Port already in use"
- Railway asigna el puerto automáticamente a través de `$PORT`
- Asegúrate que tu app use `process.env.PORT`

### Base de datos se borra en cada deploy
- Necesitas configurar un volumen en `/data`
- O migrar a PostgreSQL para persistencia real

## 📊 Monitoreo

```bash
# Ver logs en tiempo real
railway logs --follow

# Ver métricas
railway status
```

## 🔄 Actualizar

```bash
# Cada vez que hagas cambios
git push origin main  # Si usas GitHub integration

# O desde CLI
railway up
```

---

**¿Preguntas?** Railway tiene excelente documentación: https://docs.railway.app/

