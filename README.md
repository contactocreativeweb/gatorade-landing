# Gatorade Landing Page - Rendimiento Premium

Una landing page inmersiva de alto rendimiento para Gatorade, diseñada con una experiencia de usuario cinematográfica utilizando animaciones controladas por scroll (Apple-style scroll experience).

![Gatorade Page Preview](https://img.shields.io/badge/Status-Live-brightgreen)
![Tech Stack](https://img.shields.io/badge/Tech-JS%20|%20GSAP%20|%20Lenis-orange)

## 🚀 Características Principales

- **Secuencia de Frames en Canvas**: Animación 3D fluida basada en una secuencia de 96 frames de alta calidad que reaccionan al scroll del usuario.
- **Scroll Suave (Smooth Scroll)**: Integración con **Lenis** para una navegación sedosa y natural.
- **Animaciones GSAP**: Uso extensivo de GSAP y ScrollTrigger para revelar contenidos, estadísticas animadas y efectos de transición.
- **Diseño Ultra-Premium**: Estética moderna con modo oscuro, tipografía Inter y un sistema de diseño limpio.
- **Loader Personalizado**: Sistema de precarga inteligente de frames con barra de progreso real.
- **Performance Optimizado**: Carga de frames por lotes (batches) para asegurar una interacción fluida desde el inicio.
- **Totalmente Responsive**: Menú móvil personalizado y ajustes de escala para tablets y smartphones.

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Animaciones**: [GSAP (GreenSock)](https://greensock.com/gsap/) & ScrollTrigger.
- **Scroll Engine**: [Lenis](https://github.com/darkroomengineering/lenis).
- **Renderizado**: HTML5 Canvas para la secuencia de video.
- **Tipografía**: Google Fonts (Inter).

## 📂 Estructura del Proyecto

```text
├── css/
│   └── style.css       # Estilos base y diseño premium
├── js/
│   └── app.js          # Lógica de animaciones, canvas y precarga
├── frames/              # Secuencia de imágenes para la animación 3D
├── index.html          # Estructura principal
├── gatorade_video.mp4  # Video fuente original
└── extract-frames.sh   # Script para procesar frames desde el video
```

## ⚙️ Instalación y Uso

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/contactocreativeweb/gatorade-landing.git
   ```

2. **Abre el proyecto**:
   Simplemente abre el archivo `index.html` en tu navegador o usa una extensión como *Live Server* en VS Code para una mejor experiencia.

3. **Procesamiento de Video (Opcional)**:
   Si deseas actualizar la secuencia de frames, puedes usar el script incluido:
   ```bash
   ./extract-frames.sh
   ```
   *Nota: Requiere tener `ffmpeg` instalado.*

## 🎨 Créditos

Desarrollado con enfoque en **Interactive Design** y **Performance**. Inspirado por los estándares más altos de la industria web moderna.

---
© 2026 Gatorade Landing Project. Todos los derechos reservados.
