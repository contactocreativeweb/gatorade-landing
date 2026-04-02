#!/bin/bash

# ===========================================
# EXTRACCIÓN DE FRAMES PARA GATORADE LANDING
# ===========================================

VIDEO_PATH="gatorade_video.mp4"
OUTPUT_DIR="frames"
FPS=12
WIDTH=1920
QUALITY=80

echo "========================================"
echo "GATORADE - Extracción de Frames"
echo "========================================"

# Verificar que el video existe
if [ ! -f "$VIDEO_PATH" ]; then
    echo "❌ Error: No se encuentra el video '$VIDEO_PATH'"
    echo "   Coloca el archivo gatorade_video.mp4 en este directorio"
    exit 1
fi

# Crear directorio de frames
mkdir -p "$OUTPUT_DIR"

# Obtener info del video
echo ""
echo "📹 Analizando video..."
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,r_frame_rate,nb_frames -of default=noprint_wrappers=1 "$VIDEO_PATH"

# Extraer frames
echo ""
echo "🎬 Extrayendo frames..."
echo "   FPS: $FPS"
echo "   Ancho máximo: ${WIDTH}px"
echo "   Calidad WebP: ${QUALITY}%"

ffmpeg -i "$VIDEO_PATH" \
    -vf "fps=$FPS,scale=$WIDTH:-1" \
    -c:v libwebp \
    -quality $QUALITY \
    "$OUTPUT_DIR/frame_%04d.webp"

# Contar frames extraídos
FRAME_COUNT=$(ls -1 "$OUTPUT_DIR"/*.webp 2>/dev/null | wc -l)

echo ""
echo "========================================"
echo "✅ Completado"
echo "   Frames extraídos: $FRAME_COUNT"
echo "   Ubicación: $OUTPUT_DIR/"
echo "========================================"
echo ""
echo "Para probar la landing:"
echo "   cd /Users/gustavoflorez/Claude/Integracion/Gatorade"
echo "   npx serve ."
echo "   o"
echo "   python -m http.server 8000"