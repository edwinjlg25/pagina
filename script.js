// Configuración de animaciones según especificaciones de Figma
const ANIMATION_CONFIG = {
  // Animación 1 a 2: Custom Bezier curve (0.99, 0, 0, 1) - 1000ms
  anim1to2: {
    duration: 1000,
    easing: 'cubic-bezier(0.99, 0, 0, 1)'
  },
  // Animación 2 a 3: Custom Spring (stiffness: 459.2, damping: 12, mass: 1) - 800ms
  anim2to3: {
    duration: 800,
    stiffness: 459.2,
    damping: 12,
    mass: 1
  },
  // Animación 3 a 4: Quick - 400ms
  anim3to4: {
    duration: 400,
    easing: 'ease-out'
  },
  // Animación 4 a 5: Gentle - 600ms
  anim4to5: {
    duration: 600,
    easing: 'ease-in-out'
  },
  // Animación 5 a Home: Ease Out - 300ms
  anim5toHome: {
    duration: 300,
    easing: 'ease-out'
  }
};

// Función para crear curva de bezier personalizada
function cubicBezier(x1, y1, x2, y2) {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

// Función para crear animación spring personalizada
function springAnimation(element, properties, config) {
  const startTime = performance.now();
  const startValues = {};
  const endValues = {};
  
  // Obtener valores iniciales
  Object.keys(properties).forEach(prop => {
    startValues[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
    endValues[prop] = properties[prop];
  });
  
  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / config.duration, 1);
    
    // Aplicar función spring
    const springProgress = springEasing(progress, config.stiffness, config.damping, config.mass);
    
    Object.keys(properties).forEach(prop => {
      const startValue = startValues[prop];
      const endValue = endValues[prop];
      const currentValue = startValue + (endValue - startValue) * springProgress;
      element.style[prop] = currentValue + (prop === 'opacity' ? '' : 'px');
    });
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  requestAnimationFrame(animate);
}

// Función de easing spring
function springEasing(t, stiffness, damping, mass) {
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  
  if (zeta < 1) {
    const omega_d = omega * Math.sqrt(1 - zeta * zeta);
    const A = 1;
    const phi = Math.atan2(omega_d, omega * (1 - zeta));
    return 1 - A * Math.exp(-zeta * omega * t) * Math.cos(omega_d * t - phi);
  } else {
    const A = 1;
    const B = zeta * omega;
    return 1 - A * Math.exp(-B * t);
  }
}

// Función para animación estándar
function animateElement(element, properties, config) {
  element.style.transition = `all ${config.duration}ms ${config.easing}`;
  
  Object.keys(properties).forEach(prop => {
    element.style[prop] = properties[prop];
  });
  
  return new Promise(resolve => {
    setTimeout(resolve, config.duration);
  });
}

// Nueva animación de carga simple
function animateSimpleLoading() {
  const loadingContainer = document.getElementById('loading-animation');
  const mainContent = document.getElementById('main-content');
  const text = document.getElementById('loading-animated-text');
  const subtext = document.getElementById('loading-animated-subtext');
  if (!loadingContainer || !mainContent || !text || !subtext) return;

  const fullText = text.textContent;
  const fullSubtext = subtext.textContent;
  text.textContent = '';
  subtext.textContent = '';
  text.style.borderRight = '2px solid #fff';
  subtext.style.borderRight = '2px solid #e3e9f5';

  // Animar el texto de izquierda a derecha en 1 segundo
  let i = 0;
  const revealDuration = 1000;
  const revealInterval = revealDuration / fullText.length;
  function revealNextChar() {
    if (i < fullText.length) {
      text.textContent += fullText[i];
      i++;
      setTimeout(revealNextChar, revealInterval);
    } else {
      text.textContent = fullText;
      text.style.borderRight = 'none';
      // Animar el subtítulo
      let j = 0;
      const subRevealDuration = 1000;
      const subRevealInterval = subRevealDuration / fullSubtext.length;
      function revealNextSubChar() {
        if (j < fullSubtext.length) {
          subtext.textContent += fullSubtext[j];
          j++;
          setTimeout(revealNextSubChar, subRevealInterval);
        } else {
          subtext.textContent = fullSubtext;
          subtext.style.borderRight = 'none';
          setTimeout(() => {
            // Esperar 1 segundo con ambos textos completos
            loadingContainer.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(20px)';
            mainContent.style.transition = 'all 500ms ease-out';
            setTimeout(() => {
              mainContent.style.opacity = '1';
              mainContent.style.transform = 'translateY(0)';
            }, 100);
          }, 1000);
        }
      }
      revealNextSubChar();
    }
  }
  revealNextChar();
}

// Función para navegar entre páginas
function navigateToPage(pageId) {
  const pages = document.querySelectorAll('.page');
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');

  // Iconos para cada pestaña
  const iconMap = {
    home: {
      open: 'assets/inicio_open.png',
      normal: 'assets/inicio.png'
    },
    contact: {
      open: 'assets/contacto_open.png',
      normal: 'assets/contacto.png'
    },
    about: {
      open: 'assets/acerca_open.png',
      normal: 'assets/acerca.png'
    }
  };

  // Ocultar todas las páginas
  pages.forEach(page => {
    page.classList.remove('active');
  });

  // Remover clase active de todos los elementos de navegación y actualizar iconos
  navItems.forEach(item => {
    item.classList.remove('active');
    const page = item.getAttribute('data-page');
    const icon = item.querySelector('.nav-icon');
    if (icon && iconMap[page]) {
      icon.src = iconMap[page].normal;
    }
  });

  // Mostrar página seleccionada
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // Activar elemento de navegación correspondiente y actualizar icono
  const activeNavItem = document.querySelector('.bottom-nav .nav-item[data-page="' + pageId.replace('-page', '') + '"]');
  if (activeNavItem) {
    activeNavItem.classList.add('active');
    const page = activeNavItem.getAttribute('data-page');
    const icon = activeNavItem.querySelector('.nav-icon');
    if (icon && iconMap[page]) {
      icon.src = iconMap[page].open;
    }
  }
}

// Función para manejar clics en navegación
function handleNavigationClick(event) {
  const navItem = event.currentTarget;
  const pageId = navItem.getAttribute('data-page');
  
  if (pageId) {
    navigateToPage(`${pageId}-page`);
  }
}

// Función para inicializar la aplicación
function initApp() {
  // Agregar event listeners a elementos de navegación
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', handleNavigationClick);
  });

  // Iniciar nueva animación de carga simple
  animateSimpleLoading();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);

// Función para manejar el historial del navegador (opcional)
function updateURL(pageId) {
  const url = new URL(window.location);
  url.searchParams.set('page', pageId);
  window.history.pushState({}, '', url);
}

// Manejar navegación con botones del navegador
window.addEventListener('popstate', function() {
  const url = new URL(window.location);
  const pageId = url.searchParams.get('page') || 'home';
  navigateToPage(`${pageId}-page`);
});

// Exportar funciones para uso global (opcional)
window.navigateToPage = navigateToPage;
window.handleNavigationClick = handleNavigationClick; 

// --- Carrusel de cabecera ---
const carouselFolder = 'assets/carrusel/';
const carouselImg = document.getElementById('carousel-img');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

// Puedes cambiar este array por los nombres de tus imágenes
let carouselImages = ['image.png', 'image1.png', 'image2.png'];
let currentIndex = 0;

function updateCarousel() {
  if (carouselImages.length === 0) {
    carouselImg.src = '';
    carouselImg.classList.add('no-image');
    carouselImg.alt = 'Sin imagen';
    carouselImg.style.background = '#e3f2fd';
    carouselImg.style.display = 'flex';
    carouselImg.style.alignItems = 'center';
    carouselImg.style.justifyContent = 'center';
    carouselImg.style.color = '#90a4ae';
    carouselImg.style.fontSize = '1.2rem';
    carouselImg.style.fontFamily = 'Roboto, sans-serif';
    carouselImg.style.fontWeight = '500';
    carouselImg.setAttribute('data-empty', 'true');
    carouselImg.alt = 'Sin imagen';
    carouselImg.title = 'Sin imagen';
    carouselImg.onerror = null;
    carouselImg.src = '';
    carouselImg.style.content = '"Sin imagen"';
  } else {
    carouselImg.classList.remove('no-image');
    carouselImg.style = '';
    carouselImg.src = carouselFolder + carouselImages[currentIndex];
    carouselImg.alt = 'Foto carrusel';
    carouselImg.onerror = function() {
      carouselImg.classList.add('no-image');
      carouselImg.src = '';
      carouselImg.style.background = '#e3f2fd';
      carouselImg.style.display = 'flex';
      carouselImg.style.alignItems = 'center';
      carouselImg.style.justifyContent = 'center';
      carouselImg.style.color = '#90a4ae';
      carouselImg.style.fontSize = '1.2rem';
      carouselImg.style.fontFamily = 'Roboto, sans-serif';
      carouselImg.style.fontWeight = '500';
      carouselImg.setAttribute('data-empty', 'true');
      carouselImg.alt = 'Sin imagen';
      carouselImg.title = 'Sin imagen';
    };
  }
}

prevBtn.addEventListener('click', () => {
  if (carouselImages.length === 0) return;
  currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
  updateCarousel();
});
nextBtn.addEventListener('click', () => {
  if (carouselImages.length === 0) return;
  currentIndex = (currentIndex + 1) % carouselImages.length;
  updateCarousel();
});

// Inicializar carrusel al cargar
updateCarousel(); 