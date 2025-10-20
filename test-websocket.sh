#!/bin/bash

# Script de prueba para Socket.IO - Smart Routes
# Envía ubicaciones simuladas para probar el WebSocket

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración
API_URL="http://localhost:3000/owntracks/webhook"
NUM_LOCATIONS=10
DELAY=1

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Smart Routes - Test WebSocket          ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📡 Enviando $NUM_LOCATIONS ubicaciones...${NC}"
echo -e "${YELLOW}⏱️  Intervalo: $DELAY segundo(s)${NC}"
echo ""

# Ubicación inicial (Ciudad de México)
BASE_LAT=19.4326
BASE_LON=-99.1332

# Enviar ubicaciones simulando movimiento
for i in $(seq 1 $NUM_LOCATIONS); do
  # Calcular nuevas coordenadas (movimiento simulado)
  LAT=$(echo "$BASE_LAT + $i * 0.001" | bc -l)
  LON=$(echo "$BASE_LON + $i * 0.0015" | bc -l)
  
  # Timestamp actual
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  
  # Payload JSON
  PAYLOAD=$(cat <<EOF
{
  "_type": "location",
  "topic": "owntracks/user/device123",
  "lat": $LAT,
  "lon": $LON,
  "tst": $(date +%s),
  "acc": 10,
  "vel": 5,
  "alt": 2240,
  "batt": 85
}
EOF
)
  
  # Enviar request
  RESPONSE=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "User-Agent: TestScript/1.0" \
    -d "$PAYLOAD" \
    -w "\n%{http_code}")
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  
  if [ "$HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✓${NC} Ubicación $i/$NUM_LOCATIONS enviada - Lat: $LAT, Lon: $LON"
  else
    echo -e "${YELLOW}⚠${NC} Error en ubicación $i - HTTP Code: $HTTP_CODE"
  fi
  
  # Esperar antes de la siguiente ubicación
  if [ $i -lt $NUM_LOCATIONS ]; then
    sleep $DELAY
  fi
done

echo ""
echo -e "${GREEN}✅ Prueba completada!${NC}"
echo -e "${BLUE}💡 Revisa tu frontend para ver las ubicaciones en el mapa${NC}"
echo ""

