/**
 * GATORADE PREMIUM LANDING PAGE
 * Scroll-driven animation experience
 */

// ===========================================
// CONFIGURACIÓN
// ===========================================

const CONFIG = {
    // Frames
    totalFrames: 96,
    framePath: 'frames/frame_',
    frameExtension: '.jpg',
    imageScale: 0.88,

    // Velocidad de frames (1.8-2.2 recomendado)
    frameSpeed: 2.0,
    animationEndPercent: 0.55,

    // Scroll
    scrollHeight: 800,

    // Animaciones
    animationTypes: ['fade-up', 'slide-left', 'slide-right', 'scale-up', 'rotate-in', 'stagger-up', 'clip-reveal']
};

// ===========================================
// VARIABLES GLOBALES
// ===========================================

let frames = [];
let currentFrame = 0;
let lenis = null;
let isLoaded = false;

const canvas = document.getElementById('product-canvas');
const ctx = canvas.getContext('2d');

// ===========================================
// LENIS - SCROLL SUAVE
// ===========================================

function initLenis() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false
    });

    // Integrar con GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

// ===========================================
// PRECARGA DE FRAMES
// ===========================================

function preloadFrames() {
    return new Promise((resolve) => {
        const loaderProgress = document.getElementById('loader-progress');
        const loaderPercent = document.getElementById('loader-percent');
        const loader = document.getElementById('loader');

        let loadedCount = 0;
        const firstBatch = 10;
        const batchSize = 15;

        // Función para cargar un frame
        const loadFrame = (index) => {
            return new Promise((resolveFrame) => {
                const img = new Image();
                const frameNum = String(index).padStart(4, '0');
                img.src = `${CONFIG.framePath}${frameNum}${CONFIG.frameExtension}`;

                img.onload = () => {
                    frames[index] = img;
                    loadedCount++;
                    const percent = Math.round((loadedCount / CONFIG.totalFrames) * 100);
                    loaderProgress.style.width = `${percent}%`;
                    loaderPercent.textContent = `${percent}%`;
                    resolveFrame();
                };

                img.onerror = () => {
                    console.warn(`Frame ${index} no encontrado`);
                    loadedCount++;
                    const percent = Math.round((loadedCount / CONFIG.totalFrames) * 100);
                    loaderProgress.style.width = `${percent}%`;
                    loaderPercent.textContent = `${percent}%`;
                    resolveFrame();
                };
            });
        };

        // Cargar en batches
        const loadBatch = async (start, end) => {
            const promises = [];
            for (let i = start; i < end && i < CONFIG.totalFrames; i++) {
                promises.push(loadFrame(i));
            }
            await Promise.all(promises);
        };

        // Proceso de carga
        (async () => {
            // Primero cargar los primeros 10 frames
            await loadBatch(0, firstBatch);

            // Luego cargar el resto en batches
            for (let i = firstBatch; i < CONFIG.totalFrames; i += batchSize) {
                await loadBatch(i, i + batchSize);
            }

            isLoaded = true;

            // Ocultar loader con transición
            setTimeout(() => {
                loader.classList.add('hidden');
                resolve();
            }, 500);
        })();
    });
}

// ===========================================
// CANVAS SETUP
// ===========================================

function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
}

// ===========================================
// RENDERIZADO DE CANVAS
// ===========================================

function renderFrame(frameIndex) {
    if (!frames[frameIndex]) return;

    const img = frames[frameIndex];
    const canvasRect = canvas.getBoundingClientRect();

    ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);

    // Calcular dimensiones manteniendo proporción
    const scale = CONFIG.imageScale;
    const imgAspect = img.width / img.height;
    const canvasAspect = canvasRect.width / canvasRect.height;

    let drawWidth, drawHeight, drawX, drawY;

    // CONTAIN LOGIC (El texto y producto serán totalmente visibles)
    if (imgAspect > canvasAspect) {
        drawWidth = canvasRect.width * scale;
        drawHeight = drawWidth / imgAspect;
    } else {
        drawHeight = canvasRect.height * scale;
        drawWidth = drawHeight * imgAspect;
    }

    drawX = (canvasRect.width - drawWidth) / 2;
    drawY = (canvasRect.height - drawHeight) / 2;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}

// ===========================================
// SINCRONIZACIÓN SCROLL -> FRAME
// ===========================================

let targetFrame = 0;
let displayFrame = 0;

function setupScrollAnimation() {
    const scrollContainer = document.getElementById('scroll-container');

    // Calcular frame según scroll
    const updateFrameFromScroll = () => {
        const scrollProgress = window.scrollY / (scrollContainer.offsetHeight - window.innerHeight);
        targetFrame = Math.floor(scrollProgress * CONFIG.totalFrames * CONFIG.frameSpeed);
        targetFrame = Math.min(targetFrame, CONFIG.totalFrames - 1);
    };

    // Render loop separado del scroll
    const renderLoop = () => {
        if (!isLoaded) {
            requestAnimationFrame(renderLoop);
            return;
        }

        // Interpolación suave
        displayFrame += (targetFrame - displayFrame) * 0.1;

        const frameIndex = Math.round(displayFrame);
        if (frameIndex >= 0 && frameIndex < CONFIG.totalFrames) {
            renderFrame(frameIndex);
        }

        requestAnimationFrame(renderLoop);
    };

    window.addEventListener('scroll', updateFrameFromScroll);
    requestAnimationFrame(renderLoop);
}

// ===========================================
// TRANSICIÓN HERO -> CANVAS
// ===========================================

function setupHeroTransition() {
    const hero = document.getElementById('hero');
    const canvasEl = document.getElementById('product-canvas');

    ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
            const progress = self.progress;

            // Hero fade out
            hero.style.opacity = 1 - progress;

            // Canvas clip reveal
            const circleSize = progress * 150;
            canvasEl.style.clipPath = `circle(${circleSize}% at 50% 50%)`;
        }
    });
}

// ===========================================
// OVERLAY OSCURO
// ===========================================

function setupOverlay() {
    const overlay = document.getElementById('overlay');
    const statsSection = document.querySelector('.stats-section');

    ScrollTrigger.create({
        trigger: statsSection,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            overlay.style.opacity = 0.88 + (progress * 0.04);
        }
    });
}

// ===========================================
// ANIMACIÓN DE SECCIONES
// ===========================================

function setupSectionAnimations() {
    const sections = document.querySelectorAll('.content-section, .stats-section, .cta-section');

    let lastAnimationType = '';

    sections.forEach((section) => {
        const enter = parseFloat(section.dataset.enter) / 100;
        const leave = parseFloat(section.dataset.leave) / 100;

        const content = section.querySelector('.section-content, .cta-content, .stats-overlay');

        if (!content) return;

        // Obtener tipo de animación
        let animationType = section.dataset.animation || 'fade-up';

        // Evitar repetir la misma animación
        if (animationType === lastAnimationType) {
            const availableTypes = CONFIG.animationTypes.filter(t => t !== lastAnimationType);
            animationType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        }
        lastAnimationType = animationType;

        // Aplicar animación según tipo
        ScrollTrigger.create({
            trigger: '#scroll-container',
            start: `${enter * 100}% top`,
            end: `${leave * 100}% top`,
            onEnter: () => animateSection(content, animationType, true),
            onLeave: () => animateSection(content, animationType, false),
            onEnterBack: () => animateSection(content, animationType, true),
            onLeaveBack: () => animateSection(content, animationType, false)
        });
    });
}

function animateSection(element, type, entering) {
    const elements = element.querySelectorAll('[data-animation]');

    if (entering) {
        elements.forEach((el, index) => {
            gsap.fromTo(el,
                getAnimationStart(type),
                {
                    ...getAnimationEnd(type),
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'power3.out'
                }
            );
        });
    } else {
        elements.forEach((el) => {
            gsap.set(el, getAnimationStart(type));
        });
    }
}

function getAnimationStart(type) {
    switch (type) {
        case 'fade-up':
            return { y: 50, opacity: 0 };
        case 'slide-left':
            return { x: -80, opacity: 0 };
        case 'slide-right':
            return { x: 80, opacity: 0 };
        case 'scale-up':
            return { scale: 0.85, opacity: 0 };
        case 'rotate-in':
            return { y: 40, rotation: 3, opacity: 0 };
        case 'stagger-up':
            return { y: 60, opacity: 0 };
        case 'clip-reveal':
            return { clipPath: 'inset(100% 0 0 0)', opacity: 0 };
        default:
            return { y: 50, opacity: 0 };
    }
}

function getAnimationEnd(type) {
    switch (type) {
        case 'fade-up':
            return { y: 0, opacity: 1 };
        case 'slide-left':
            return { x: 0, opacity: 1 };
        case 'slide-right':
            return { x: 0, opacity: 1 };
        case 'scale-up':
            return { scale: 1, opacity: 1 };
        case 'rotate-in':
            return { y: 0, rotation: 0, opacity: 1 };
        case 'stagger-up':
            return { y: 0, opacity: 1 };
        case 'clip-reveal':
            return { clipPath: 'inset(0% 0 0 0)', opacity: 1 };
        default:
            return { y: 0, opacity: 1 };
    }
}

// ===========================================
// CONTADORES ANIMADOS
// ===========================================

function setupCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    counters.forEach((counter) => {
        const target = parseInt(counter.dataset.target);

        ScrollTrigger.create({
            trigger: counter.closest('.stats-section'),
            start: 'top 80%',
            onEnter: () => animateCounter(counter, target),
            onEnterBack: () => animateCounter(counter, target)
        });
    });
}

function animateCounter(element, target) {
    gsap.fromTo(element,
        { textContent: 0 },
        {
            textContent: target,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function () {
                element.textContent = Math.round(this.targets()[0].textContent);
            }
        }
    );
}

// ===========================================
// MARQUEE HORIZONTAL
// ===========================================

function setupMarquee() {
    const marquee = document.querySelector('.marquee-wrap');
    const marqueeText = document.querySelector('.marquee-text');

    if (!marquee || !marqueeText) return;

    gsap.to(marqueeText, {
        x: '-50%',
        ease: 'none',
        scrollTrigger: {
            trigger: '#scroll-container',
            start: '45% top',
            end: '55% top',
            scrub: 1
        }
    });
}

// ===========================================
// ANIMACIÓN HERO INICIAL
// ===========================================

function animateHero() {
    const heroTag = document.querySelector('.hero-tag');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');

    gsap.timeline({ delay: 0.5 })
        .to(heroTag, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .to(heroTitle, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .to(heroSubtitle, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4');
}

// ===========================================
// RESPONSIVE HANDLER
// ===========================================

function handleResize() {
    setupCanvas();

    // Ajustar configuración para móvil
    if (window.innerWidth < 768) {
        CONFIG.scrollHeight = 550;
        CONFIG.totalFrames = Math.min(CONFIG.totalFrames, 150);
    }
}

// ===========================================
// MOBILE MENU
// ===========================================

function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const links = document.querySelectorAll('.mobile-nav-link');

    if (!toggle || !overlay) return;

    const toggleMenu = () => {
        const isActive = toggle.classList.contains('active');
        
        if (isActive) {
            toggle.classList.remove('active');
            overlay.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            if (lenis) lenis.start();
        } else {
            toggle.classList.add('active');
            overlay.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            if (lenis) lenis.stop();
        }
    };

    toggle.addEventListener('click', toggleMenu);

    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            overlay.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            if (lenis) lenis.start();
        });
    });
}

// ===========================================
// INICIALIZACIÓN
// ===========================================

async function init() {
    // Setup canvas primero
    setupCanvas();

    // Precarga de frames
    await preloadFrames();

    // Inicializar Lenis
    initLenis();

    // Configurar animaciones
    setupScrollAnimation();
    setupHeroTransition();
    setupOverlay();
    setupSectionAnimations();
    setupCounters();
    setupMarquee();
    setupMobileMenu();

    // Animación inicial del hero
    animateHero();

    // Resize handler
    window.addEventListener('resize', handleResize);
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);