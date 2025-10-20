# 📍 Monitor de Ubicaciones en Tiempo Real

Este archivo HTML muestra las ubicaciones recibidas por WebSocket en tiempo real.

## 🚀 Cómo Usar

### 1. Iniciar el servidor
```bash
npm run start:dev
```

### 2. Abrir el monitor
Abre tu navegador en:
```
http://localhost:3000/index.html
```

### 3. Enviar ubicaciones de prueba

#### Opción A: Usar el script de prueba
```bash
./test-websocket.sh
```

#### Opción B: Enviar manualmente
```bash
curl -X POST http://localhost:3000/owntracks/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "_type": "location",
    "topic": "owntracks/user/device123",
    "lat": 19.4326,
    "lon": -99.1332
  }'
```

#### Opción C: Enviar múltiples ubicaciones
```bash
for i in {1..50}; do
  lat=$(echo "19.4326 + $i * 0.001" | bc -l)
  lon=$(echo "-99.1332 + $i * 0.001" | bc -l)
  
  curl -X POST http://localhost:3000/owntracks/webhook \
    -H "Content-Type: application/json" \
    -d "{
      \"_type\": \"location\",
      \"topic\": \"owntracks/user/device$i\",
      \"lat\": $lat,
      \"lon\": $lon
    }"
  
  sleep 0.5
done
```

## ✨ Características

- ✅ **Tiempo Real**: Las ubicaciones aparecen instantáneamente
- ✅ **Límite de 30**: Solo muestra las últimas 30 ubicaciones
- ✅ **Auto-limpieza**: Las más antiguas se eliminan automáticamente
- ✅ **Animaciones**: Entrada y salida suaves
- ✅ **Responsive**: Se adapta a móviles y tablets
- ✅ **Estado de conexión**: Indicador visual en tiempo real
- ✅ **Botón limpiar**: Elimina todas las ubicaciones

## 📊 Información Mostrada

Cada ubicación muestra:
- 📍 Icono visual
- 👤 Nombre del usuario
- 🆔 ID del dispositivo
- 🌍 Latitud y Longitud
- 📝 Tipo de ubicación
- ⏰ Hora de recepción
- 📅 Fecha de recepción

## 🎨 Personalización

Puedes modificar el archivo `index.html` para:

### Cambiar el límite de ubicaciones
```javascript
const MAX_LOCATIONS = 30; // Cambia este número
```

### Cambiar la URL del servidor
```javascript
const SOCKET_URL = 'http://localhost:3000'; // Cambia la URL
```

### Modificar colores
Edita las variables CSS en la sección `<style>`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Cambia los colores del gradiente */
```

## 🐛 Solución de Problemas

### No aparece ninguna ubicación
1. Verifica que el servidor esté corriendo: `npm run start:dev`
2. Abre la consola del navegador (F12) para ver errores
3. Envía una ubicación de prueba con curl
4. Verifica que el estado de conexión sea "Conectado"

### Error de conexión WebSocket
1. Asegúrate de que el servidor esté en `http://localhost:3000`
2. Verifica que no haya errores en la consola del servidor
3. Prueba recargar la página

### Las ubicaciones no se limpian automáticamente
- El límite está en 30, las más antiguas se eliminan automáticamente
- Puedes usar el botón "🗑️ Limpiar Todo" para eliminar todas

## 📱 Uso con Dispositivos Reales

Si tienes un dispositivo con OwnTracks:

1. Configura el endpoint en OwnTracks:
   - URL: `http://TU_IP:3000/owntracks/webhook`
   - Modo: HTTP

2. Las ubicaciones aparecerán automáticamente en el monitor

## 🔜 Próximos Pasos

Este es un monitor básico. Próximamente se agregará:
- 🗺️ Integración con Google Maps
- 📈 Gráficos de rutas
- 🔔 Notificaciones
- 📊 Estadísticas
- 🎯 Filtros por usuario
- 📅 Historial de ubicaciones

---

**¡Disfruta monitoreando tus ubicaciones en tiempo real! 🚀**
