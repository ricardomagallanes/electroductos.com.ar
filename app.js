// Catálogo Oficial de Productos - Electroductos de Argentina S.A.
// Datos extraídos del Catálogo Técnico V2
const products = [
  {
    id: 'pam1u',
    code: 'PAM1U',
    name: 'Pilar Hormigón Acometida Aérea Monofásica (1 Usuario)',
    group: 'aerea',
    tag: 'Acometida Aérea Monofásica',
    plan: 'Plano PAM1U (Versión 28/01/19)',
    description: 'Pilar de hormigón armado premoldeado para acometida aérea monofásica a 1 usuario. Máxima durabilidad mecánica frente a la intemperie y actos vandálicos.',
    specs: [
      'Dimensiones: 350 mm ancho x 365 mm profundidad',
      'Altura libre: 1370 mm | Altura medidor: 1035 mm',
      'Empotramiento: 450 mm + 50 mm cama de arena',
      'Caño de acometida con pipeta superior y rack con aislador',
      'Caja plástica y tapa de policarbonato para medidor'
    ],
    components: [
      'Módulo de extensión con salida de cables',
      'Módulo de medición y protección',
      'Caja plástica y soporte para medidor',
      'Tapa de policarbonato alto impacto',
      'Caño de acometida con pipeta y rack aislador',
      'Caja plástica para protección lado Usuario',
      'Interruptor termomagnético y aro de goma'
    ],
    image: 'assets/catalogo/pilares/pam1u.png',
    sheet: 'assets/catalogo/pilares/pam1u-ficha.png'
  },
  {
    id: 'pam2u',
    code: 'PAM2U',
    name: 'Pilar Hormigón Acometida Aérea Monofásica (2 Usuarios)',
    group: 'aerea',
    tag: 'Acometida Aérea Monofásica Doble',
    plan: 'Plano PAM2U (Versión 28/01/19)',
    description: 'Solución premoldeada para 2 suministros monofásicos independientes con acometida aérea común y compartimentos individuales de medición y corte.',
    specs: [
      'Dimensiones: 350 mm ancho x 365 mm profundidad',
      'Altura libre: 1370 mm | Alturas medidores: 710 y 1035 mm',
      'Capacidad: 2 medidores monofásicos independientes',
      'Empotramiento: 450 mm con salida de cables independiente',
      'Dos cajas posteriores de protección termomagnética'
    ],
    components: [
      'Módulo de extensión con salida de cables',
      'Módulo de medición y protección doble',
      '2 Cajas plásticas y soportes para medidor',
      '2 Tapas de policarbonato con visor de lectura',
      'Caño de acometida con pipeta y rack aislador',
      '2 Cajas de protección lado usuario',
      '2 Interruptores termomagnéticos'
    ],
    image: 'assets/catalogo/pilares/pam2u.png',
    sheet: 'assets/catalogo/pilares/pam2u-ficha.png'
  },
  {
    id: 'pat1u',
    code: 'PAT1U',
    name: 'Pilar Hormigón Acometida Aérea Trifásica (1 Usuario)',
    group: 'aerea',
    tag: 'Acometida Aérea Trifásica',
    plan: 'Plano PAT1U (Versión 28/01/19)',
    description: 'Estructura premoldeada reforzada para suministros trifásicos comerciales o residenciales de alta demanda con acometida aérea de 4 conductores.',
    specs: [
      'Dimensiones: 350 mm ancho x 365 mm profundidad',
      'Altura libre: 1370 mm | Altura de medición: 930 mm',
      'Empotramiento: 450 mm sobre lecho de arena nivelado',
      'Caño de acometida aérea de gran sección con pipeta',
      'Gabinete para medidor trifásico homologado'
    ],
    components: [
      'Módulo base y extensión con salida de cables',
      'Módulo de medición y protección trifásica',
      'Caja plástica para medidor trifásico',
      'Soporte interior y tapa de policarbonato',
      'Caño de acometida con pipeta y rack aislador',
      'Caja plástica y llave termomagnética usuario'
    ],
    image: 'assets/catalogo/pilares/pat1u.png',
    sheet: 'assets/catalogo/pilares/pat1u-ficha.png'
  },
  {
    id: 'pst1u',
    code: 'PST1U',
    name: 'Pilar Hormigón Acometida Subterránea Trifásica (1 Usuario)',
    group: 'subterranea',
    tag: 'Acometida Subterránea Trifásica',
    plan: 'Plano PST1U (Versión 29/01/19)',
    description: 'Pilar premoldeado específico para redes subterráneas con caja de toma de 60A integrada y compartimento de medición trifásica con accesos independientes.',
    specs: [
      'Dimensiones: 300 mm frente x 365 mm profundidad',
      'Altura sobre nivel terreno: 1300 mm | Enterramiento: 625 mm',
      'Caja de toma 60A seccionable con fusibles incorporada',
      'Ventana frontal para distribuidora y ventana posterior usuario',
      'Alojamiento superior para medidor trifásico y señales débiles'
    ],
    components: [
      'Módulo de extensión con entrada/salida de cables',
      'Módulo de medición y protección',
      'Caja de toma 60 A',
      'Caja plástica y soporte para medidor trifásico',
      'Tapa de policarbonato transparente',
      'Caja plástica de protección usuario y señales débiles'
    ],
    image: 'assets/catalogo/pilares/pst1u.png',
    sheet: 'assets/catalogo/pilares/pst1u-ficha.png'
  },
  {
    id: 'pst2u',
    code: 'PST2U',
    name: 'Pilar Hormigón Acometida Subterránea Trifásica (2 Usuarios)',
    group: 'subterranea',
    tag: 'Acometida Subterránea Trifásica Doble',
    plan: 'Plano PST2U (Versión 26/01/17)',
    description: 'Conjunto modular de doble ancho (700 mm) con envolvente interior para barras colectoras y protecciones para 2 suministros trifásicos subterráneos.',
    specs: [
      'Dimensiones: 700 mm frente x 405 mm profundidad',
      'Altura sobre terreno: 1650 mm | Enterramiento: 800 mm',
      'Base y ducto de acometida con ventanas para cables subterráneos',
      '2 Cajas para medidor trifásico montadas en paralelo',
      'Caja plástica para barras colectoras y protecciones'
    ],
    components: [
      'Base y ducto de acometida subterránea reforzada',
      'Ducto de extensión y caja para barras distribuidora',
      'Envolvente de cajas para medición y protección',
      '2 Cajas plásticas para medidor trifásico',
      '2 Tapas de policarbonato con visor',
      '2 Cajas plásticas de protección usuario y señales débiles'
    ],
    image: 'assets/catalogo/pilares/pst2u.png',
    sheet: 'assets/catalogo/pilares/pst2u-ficha.png'
  },
  {
    id: 'caja-barras',
    code: 'CBP-DIST',
    name: 'Caja Plástica para Barras y Protecciones Distribuidora',
    group: 'cajas',
    tag: 'Gabinete de Distribución',
    plan: 'Plano Caja Barras (Versión 08/11/16)',
    description: 'Caja técnica en material plástico de 4 mm de espesor mínimo, equipada con juego de barras colectoras de cobre o aluminio (30x5 mm) y aisladores escalonados.',
    specs: [
      'Dimensiones: 555 mm ancho x 680 mm alto x 217 mm fondo',
      'Material plástico autoextinguible de alto impacto (≥ 4 mm)',
      'Barras colectoras de Cu / Al de 30 x 5 mm normalizadas',
      'Aisladores escalonados de alta rigidez dieléctrica'
    ],
    components: [
      'Caja plástica estanca con pestaña perimetral',
      'Aisladores escalonados portabarras de alta tensión',
      'Juego de barras conductoras mecanizadas',
      'Tornillería en acero bicromatado / inoxidable'
    ],
    image: 'assets/catalogo/pilares/caja-barras.png',
    sheet: 'assets/catalogo/pilares/caja-barras-ficha.png'
  },
  {
    id: 'caja-seccionadores',
    code: 'CSF-160',
    name: 'Caja Plástica con Seccionadores Fusible y Bornera',
    group: 'cajas',
    tag: 'Seccionamiento y Protección',
    plan: 'Plano Seccionadores (Versión 10/11/20)',
    description: 'Gabinete técnico equipado con 2 seccionadores fusible en carga de 160 A y bornera de interconexión de 100 A montados sobre placa metálica con pantalla protectora.',
    specs: [
      'Dimensiones: 555 mm ancho x 680 mm alto x 217 mm fondo',
      '2 Seccionadores fusible bajo carga de 160 A (tamaño NH)',
      'Bornera de conexión tipo T4-100 para hasta 100 A',
      'Pantalla frontal transparente contra contactos accidentales directos'
    ],
    components: [
      'Caja plástica con protección UV de alta resistencia',
      'Placa metálica galvanizada para montajes de potencia',
      '2 Seccionadores fusible 160 A',
      'Bornera 100 A con bornes aislados',
      'Pantalla de policarbonato de seguridad'
    ],
    image: 'assets/catalogo/pilares/caja-seccionadores.png',
    sheet: 'assets/catalogo/pilares/caja-seccionadores-ficha.png'
  },
  {
    id: 'pst2u-ct',
    code: 'PST2U-CT',
    name: 'Pilar Trifásico Subterráneo 2 Usuarios con Caja Técnica',
    group: 'subterranea',
    tag: 'Acometida con Caja Técnica Inferior',
    plan: 'Plano PST2U-CT (Versión 22/02/18)',
    description: 'Variante de gran capacidad con caja técnica inferior extendida de 1265 mm para derivaciones complejas y acometidas de potencia en urbanizaciones y parques.',
    specs: [
      'Dimensiones torre: 700x405x1650 mm | Base técnica: 1265 mm ancho',
      'Enterramiento total: 800 mm sobre lecho de arena nivelado',
      'Caja técnica espaciosa para radio de curvatura de conductores',
      'Capacidad para 2 suministros trifásicos simultáneos',
      'Envolvente de barras y doble compartimento de usuario'
    ],
    components: [
      'Caja técnica subterránea de 1265 mm',
      'Ducto de extensión y caja para barras distribuidora',
      'Envolvente de medición y protección lado usuario',
      '2 Cajas para medidor trifásico + soportes y tapas',
      '2 Cajas de protección usuario y señales débiles'
    ],
    image: 'assets/catalogo/pilares/pst2u-ct.png',
    sheet: 'assets/catalogo/pilares/pst2u-ct-ficha.png'
  },
  {
    id: 'pst2u-1',
    code: 'PST2U-1',
    name: 'Pilar Hormigón Subterráneo Trifásico 2 Usuarios (PST2U-1)',
    group: 'subterranea',
    tag: 'Acometida Subterránea Compacta',
    plan: 'Plano PST2U-1 (Diseño 30/03/22)',
    description: 'Diseño compacto optimizado de 600 mm de frente con 2 cajas toma, 6 bases portafusibles NH-00 integradas, bornera de neutro y 4 cajas de protecciones.',
    specs: [
      'Dimensiones: 600 mm frente x 315 mm fondo x 1300 mm altura libre',
      'Enterramiento: 760 mm con base y ducto de acometida',
      '2 Cajas toma con 6 Bases NH-00 incorporadas',
      '2 Borneras de neutro y tubos de acometida plásticos',
      '4 Cajas plásticas para termomagnéticas y diferenciales'
    ],
    components: [
      'Base y ducto de acometida + ducto extensión',
      '2 Cajas toma con 6 bases NH-00',
      '2 Borneras de neutro',
      '2 Cajas y soportes para medidor trifásico',
      '4 Cajas plásticas para interruptores de protección',
      'Caja para señales débiles + 5 Cuplas plásticas'
    ],
    image: 'assets/catalogo/pilares/pst2u-1.png',
    sheet: 'assets/catalogo/pilares/pst2u-1-ficha.png'
  },
  {
    id: 'set-630kva',
    code: 'SET-630',
    name: 'Subestación Transformadora a Nivel de hasta 630 kVA',
    group: 'cajas',
    tag: 'Subestación Monolítica MT/BT',
    plan: 'Plano Subestación a Nivel (Versión 20/02/16)',
    description: 'Cabina prefabricada monolítica de hormigón armado de 80 mm de espesor para subestación transformadora MT/BT de hasta 630 kVA con recintos segregados.',
    specs: [
      'Dimensiones exteriores: 3840 mm largo x 2760 mm ancho x 2680 mm alto',
      'Paredes y losa superior de hormigón armado de 80 mm',
      'Recintos independientes: Media Tensión (con reserva), Trafo y Cuadro BT',
      'Ventilación natural reforzada mediante celosías perimetrales tipo laberinto',
      'Apta transformadores en aceite o secos de hasta 630 kVA'
    ],
    components: [
      'Estructura premoldeada monolítica sismorresistente',
      'Alojamiento para celdas MT compactas con espacio de reserva',
      'Recinto para transformador de hasta 630 kVA con fosa',
      'Espacio para tablero general de distribución en baja tensión (TGBT)',
      'Puertas metálicas reforzadas y celosías técnicas'
    ],
    image: 'assets/catalogo/pilares/set-630kva.png',
    sheet: 'assets/catalogo/pilares/set-630kva-ficha.png'
  }
];

// DOM Elements
const grid = document.getElementById('products-display-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const navItems = document.querySelectorAll('.nav-item');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
const siteHeader = document.getElementById('site-header');

const telemetrySection = document.getElementById('telemedicion');
const productsSection = document.getElementById('productos');
const heroSection = document.getElementById('inicio');

const telemetryPanel = document.getElementById('telemetry-panel');
const telemetryIframe = document.getElementById('telemetry-iframe');
const telemetryLoader = document.getElementById('telemetry-loader');
const activeCoopTitle = document.getElementById('active-coop-title');
const closeIframeBtn = document.getElementById('close-iframe-btn');

// Clerk DOM Elements
const adminControlsDiv = document.getElementById('clerk-admin-controls');
const manageOrgBtn = document.getElementById('clerk-manage-org-btn');
const orgProfileModal = document.getElementById('clerk-org-profile-modal');
const closeOrgProfileModalBtn = document.getElementById('close-org-profile-modal-btn');
const orgProfileContainer = document.getElementById('clerk-org-profile-container');

// Technical Sheet Modal Elements
const techModal = document.getElementById('technical-sheet-modal');
const modalProductTitle = document.getElementById('modal-product-title');
const modalProductSubtitle = document.getElementById('modal-product-subtitle');
const modalProductImg = document.getElementById('modal-product-img');
const modalDownloadLink = document.getElementById('modal-download-link');
const modalWhatsappInquire = document.getElementById('modal-whatsapp-inquire');
const closeTechModalBtn = document.getElementById('close-tech-modal');

// WhatsApp Floating Widget Elements
const whatsappWidget = document.getElementById('whatsapp-widget');
const whatsappToggleBtn = document.getElementById('whatsapp-toggle-btn');
const whatsappChatBox = document.getElementById('whatsapp-chat-box');
const whatsappCloseBtn = document.getElementById('whatsapp-close-btn');
const whatsappInputText = document.getElementById('whatsapp-input-text');
const whatsappSendBtn = document.getElementById('whatsapp-send-btn');
const WHATSAPP_PHONE = '5493516336043';

// Initialize Website
document.addEventListener('DOMContentLoaded', () => {
  initWelcomePreloader();
  initThemeSwitcher();
  renderProducts('all');
  initNavigation();
  initMobileMenu();
  initTelemetryEvents();
  initTechnicalModal();
  initWhatsAppWidget();

  // Header scroll class toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // Botón "Ver Catálogo" del Hero
  const heroBtnCatalog = document.getElementById('hero-btn-catalog');
  if (heroBtnCatalog) {
    heroBtnCatalog.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('productos');
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Init Clerk Authentication
  initClerk();

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// Modern Industrial Welcome Preloader Animation
function initWelcomePreloader() {
  const preloader = document.getElementById('welcome-preloader');
  const progressBar = document.getElementById('preloader-progress');
  const statusText = document.getElementById('preloader-status-text');

  if (!preloader || !progressBar) return;

  const messages = [
    { p: 25, text: 'Iniciando sistemas de ingeniería...' },
    { p: 60, text: 'Cargando catálogo técnico de pilares...' },
    { p: 90, text: 'Verificando especificaciones y planos...' },
    { p: 100, text: '¡Bienvenido a Electroductos!' }
  ];

  let step = 0;
  const interval = setInterval(() => {
    if (step < messages.length) {
      progressBar.style.width = messages[step].p + '%';
      if (statusText) statusText.innerText = messages[step].text;
      step++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600);
      }, 350);
    }
  }, 220);
}

// Render products dynamically based on group filter
function renderProducts(groupFilter) {
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = groupFilter === 'all'
    ? products
    : products.filter(p => p.group === groupFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted); background: var(--bg-secondary); border-radius: var(--border-radius); border: 1px dashed var(--border-light);">
        <i data-lucide="info" style="width: 44px; height: 44px; margin-bottom: 12px; color: var(--color-primary);"></i>
        <p style="font-size: 1.1rem; font-weight: 600; color: var(--color-dark);">No hay modelos en esta categoría.</p>
        <p style="font-size: 0.9rem;">Seleccione otra categoría o descargue el catálogo general.</p>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);

    // Render 4 main specs
    const specsHtml = product.specs.slice(0, 4).map(spec => `
      <li>
        <i data-lucide="check" style="width: 14px; height: 14px;"></i>
        <span>${spec}</span>
      </li>
    `).join('');

    card.innerHTML = `
      <div class="product-image-container" onclick="openTechnicalModal('${product.id}')" title="Clic para ampliar plano constructivo">
        <div class="product-badge-group">
          <span class="product-badge-code">${product.code}</span>
          <span class="product-badge-type">${product.tag}</span>
        </div>
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
        <div class="product-zoom-hint">
          <i data-lucide="zoom-in" style="width: 14px; height: 14px;"></i> Ver Plano
        </div>
      </div>
      <div class="product-info">
        <div class="product-plan-info">
          <i data-lucide="file-text" style="width: 13px; height: 13px; vertical-align: middle; margin-right: 2px;"></i> ${product.plan}
        </div>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        
        <div class="product-specs-box">
          <div class="product-specs-title">
            <i data-lucide="sliders" style="width: 13px; height: 13px;"></i> Características Constructivas:
          </div>
          <ul class="product-specs-list">
            ${specsHtml}
          </ul>
        </div>

        <div class="product-footer">
          <button class="btn-card-sheet" onclick="openTechnicalModal('${product.id}')">
            <i data-lucide="eye" style="width: 15px; height: 15px;"></i> Ver Plano
          </button>
          <button class="btn-card-quote" onclick="contactViaWhatsApp('${product.code}', '${product.name}')">
            <i data-lucide="message-circle" style="width: 15px; height: 15px;"></i> Consultar
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Navigation & Routing Logic
function initNavigation() {
  // Filter buttons in catalog
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(filter);
    });
  });

  // Global helper for footer links
  window.filterByGroup = (groupName) => {
    showSection('productos');
    const targetBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === groupName);
    if (targetBtn) {
      targetBtn.click();
    }
    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Header Nav links
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const target = item.getAttribute('data-target');
      if (!target) return;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      if (target === 'telemedicion') {
        showSection('telemedicion');
        telemetrySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (target === 'productos') {
        showSection('productos');
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (target === 'contacto') {
        showSection('productos');
        const footerElem = document.getElementById('contacto');
        if (footerElem) footerElem.scrollIntoView({ behavior: 'smooth' });
      } else if (target === 'inicio') {
        showSection('productos');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Close mobile menu
      if (navLinks.classList.contains('mobile-active')) {
        navLinks.classList.remove('mobile-active');
        mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });
  });
}

function showSection(section) {
  if (section === 'telemedicion') {
    productsSection.style.display = 'none';
    heroSection.style.display = 'none';
    telemetrySection.classList.add('active');
  } else {
    productsSection.style.display = 'block';
    heroSection.style.display = 'block';
    telemetrySection.classList.remove('active');
  }
}

// Mobile responsive menu toggle
function initMobileMenu() {
  if (!mobileMenuBtn) return;
  mobileMenuBtn.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('mobile-active');
    mobileMenuBtn.innerHTML = isActive
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });
}

// ==========================================
// TECHNICAL SHEET MODAL
// ==========================================
function initTechnicalModal() {
  if (!techModal) return;

  closeTechModalBtn.addEventListener('click', () => {
    techModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });

  techModal.addEventListener('click', (e) => {
    if (e.target === techModal) {
      techModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });

  // ESC key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && techModal.classList.contains('active')) {
      techModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
}

window.openTechnicalModal = (productId) => {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  modalProductTitle.innerText = `${prod.name}`;
  modalProductSubtitle.innerText = `${prod.plan} | ${prod.tag}`;
  modalProductImg.src = prod.sheet;
  modalProductImg.alt = prod.name;
  modalDownloadLink.href = prod.sheet;
  modalDownloadLink.setAttribute('download', `Plano-${prod.code}-Electroductos.png`);

  modalWhatsappInquire.onclick = () => {
    contactViaWhatsApp(prod.code, prod.name);
  };

  techModal.classList.add('active');
  document.body.classList.add('no-scroll');
  if (typeof lucide !== 'undefined') lucide.createIcons();
};

// ==========================================
// WHATSAPP FLOATING WIDGET
// ==========================================
function initWhatsAppWidget() {
  if (!whatsappToggleBtn || !whatsappChatBox) return;

  // Toggle chat popup
  whatsappToggleBtn.addEventListener('click', () => {
    const isOpen = whatsappChatBox.classList.toggle('open');
    if (isOpen) {
      whatsappInputText.focus();
      // Set timestamp
      const timeElem = document.getElementById('chat-current-time');
      if (timeElem) {
        const now = new Date();
        timeElem.innerText = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      }
    }
  });

  whatsappCloseBtn.addEventListener('click', () => {
    whatsappChatBox.classList.remove('open');
  });

  // Send button
  whatsappSendBtn.addEventListener('click', () => {
    sendWhatsAppFromInput();
  });

  // Enter to send
  whatsappInputText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendWhatsAppFromInput();
    }
  });
}

function sendWhatsAppFromInput() {
  const text = whatsappInputText.value.trim() || 'Hola, me comunico desde el sitio web de Electroductos de Argentina. Quisiera recibir información técnica y comercial.';
  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
  window.open(url, '_blank');
  whatsappChatBox.classList.remove('open');
  whatsappInputText.value = '';
}

window.contactViaWhatsApp = (code, name) => {
  const msg = `Hola, me comunico desde la web de Electroductos de Argentina. Quisiera consultar por el producto ${code} - ${name}. ¿Tienen disponibilidad y cotización?`;
  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
};

// ==========================================
// CLERK AUTH & TELEMETRY LOGIC
// ==========================================
async function initClerk() {
  const loginBtn = document.getElementById('clerk-login-btn');
  const telemetryLoginBtn = document.getElementById('clerk-telemetry-login-btn');

  let interval = setInterval(async () => {
    if (window.Clerk) {
      clearInterval(interval);
      try {
        await window.Clerk.load();
        updateAuthState();

        const openLogin = () => {
          window.Clerk.openSignIn({
            appearance: {
              variables: {
                colorPrimary: '#EB5B28',
                colorBackground: '#FFFFFF',
                colorText: '#0F172A',
                colorInputBackground: '#F8FAFC',
                colorInputText: '#0F172A'
              }
            }
          });
        };

        if (loginBtn) loginBtn.addEventListener('click', openLogin);
        if (telemetryLoginBtn) telemetryLoginBtn.addEventListener('click', openLogin);

        if (manageOrgBtn) {
          manageOrgBtn.addEventListener('click', () => {
            orgProfileModal.style.display = 'flex';
            if (orgProfileContainer.children.length === 0) {
              window.Clerk.mountOrganizationProfile(orgProfileContainer, {
                appearance: {
                  variables: {
                    colorPrimary: '#EB5B28',
                    colorBackground: '#FFFFFF',
                    colorText: '#0F172A'
                  }
                }
              });
            }
          });
        }

        if (closeOrgProfileModalBtn) {
          closeOrgProfileModalBtn.addEventListener('click', () => {
            orgProfileModal.style.display = 'none';
          });
        }

        if (orgProfileModal) {
          orgProfileModal.addEventListener('click', (e) => {
            if (e.target === orgProfileModal) {
              orgProfileModal.style.display = 'none';
            }
          });
        }

        window.Clerk.addListener(() => {
          updateAuthState();
        });
      } catch (err) {
        console.error("Clerk could not load:", err);
      }
    }
  }, 100);
}

function updateAuthState() {
  const userButtonDiv = document.getElementById('clerk-user-button');
  const loginBtn = document.getElementById('clerk-login-btn');
  const authPanel = document.getElementById('clerk-auth-required-panel');
  const coopGrid = document.getElementById('cooperatives-display-grid');
  const telemetrySubtitle = document.getElementById('telemetry-subtitle');

  if (!window.Clerk) return;

  if (window.Clerk.user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userButtonDiv) userButtonDiv.style.display = 'block';

    if (userButtonDiv && userButtonDiv.children.length === 0) {
      window.Clerk.mountUserButton(userButtonDiv, {
        appearance: {
          variables: {
            colorBackground: '#FFFFFF',
            colorText: '#0F172A',
            colorTextSecondary: '#64748B',
            colorPrimary: '#EB5B28'
          }
        }
      });
    }

    if (authPanel) authPanel.style.display = 'none';
    if (coopGrid) coopGrid.style.display = 'grid';
    if (telemetrySubtitle) telemetrySubtitle.style.display = 'block';

    renderUserCooperatives();
  } else {
    if (loginBtn) loginBtn.style.display = 'block';
    if (userButtonDiv) userButtonDiv.style.display = 'none';
    if (adminControlsDiv) adminControlsDiv.style.display = 'none';
    if (coopGrid) {
      coopGrid.innerHTML = '';
      coopGrid.style.display = 'none';
    }
    if (authPanel) authPanel.style.display = 'block';
    if (telemetrySubtitle) telemetrySubtitle.style.display = 'none';

    if (telemetryPanel) telemetryPanel.classList.remove('active');
    if (telemetryIframe) telemetryIframe.src = '';
    document.body.classList.remove('no-scroll');
    if (orgProfileModal) orgProfileModal.style.display = 'none';
  }
}

function renderUserCooperatives() {
  const coopGrid = document.getElementById('cooperatives-display-grid');
  if (!coopGrid) return;
  coopGrid.innerHTML = '';

  const user = window.Clerk.user;
  const memberships = user.organizationMemberships || [];

  // Check admin role
  const isSuperAdmin = user.publicMetadata?.role === 'admin' || user.unsafeMetadata?.role === 'admin';
  if (adminControlsDiv) {
    adminControlsDiv.style.display = isSuperAdmin ? 'block' : 'none';
  }

  // Cooperativas asignadas
  let assignedOrgs = memberships.map(m => ({
    id: m.organization.id,
    name: m.organization.name,
    role: m.role,
    imageUrl: m.organization.imageUrl,
    metadata: m.organization.publicMetadata || {}
  }));

  // Demo / Fallback default if empty
  if (assignedOrgs.length === 0) {
    assignedOrgs.push({
      id: 'org_default',
      name: 'Cooperativa Piloto Eléctrica',
      role: 'Visualizador',
      imageUrl: 'assets/logo.png',
      metadata: {
        dashboardUrl: 'https://demo.thingsboard.io/dashboards'
      }
    });
  }

  assignedOrgs.forEach(org => {
    const card = document.createElement('div');
    card.className = 'coop-card';
    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
        <img src="${org.imageUrl || 'assets/logo.png'}" alt="${org.name}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: contain; border: 1px solid var(--border-light); padding: 2px;">
        <div>
          <h3 style="font-size: 1.15rem; color: var(--color-dark); margin-bottom: 2px;">${org.name}</h3>
          <span style="font-size: 0.75rem; background: var(--color-primary-light); color: var(--color-primary); padding: 2px 8px; border-radius: 4px; font-weight: 600;">${org.role}</span>
        </div>
      </div>
      <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 20px;">
        Acceso directo al panel SCADA / Telemetría IoT en tiempo real para transformadores y redes de distribución.
      </p>
      <button class="btn btn-primary" style="width: 100%; font-size: 0.88rem; padding: 10px;" onclick="openTelemetryPanel('${org.name}', '${org.metadata.dashboardUrl || ''}')">
        <i data-lucide="activity" style="width: 16px; height: 16px;"></i> Ver Panel en Tiempo Real
      </button>
    `;
    coopGrid.appendChild(card);
  });

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Telemetry Fullscreen Viewer
async function openTelemetryPanel(coopName, targetUrl) {
  let url = targetUrl || 'https://demo.thingsboard.io/dashboards';

  if (window.Clerk && window.Clerk.user) {
    const pMeta = window.Clerk.user.privateMetadata || {};
    const pubMeta = window.Clerk.user.publicMetadata || {};
    const customUrl = pMeta.tbDashboardUrl || pubMeta.tbDashboardUrl;
    if (customUrl) url = customUrl;
  }

  telemetryPanel.classList.add('active');
  document.body.classList.add('no-scroll');

  telemetryLoader.style.opacity = '1';
  telemetryLoader.style.pointerEvents = 'all';
  activeCoopTitle.innerText = coopName;

  telemetryIframe.src = 'about:blank';
  setTimeout(() => {
    telemetryIframe.src = url;
  }, 100);
}

function initTelemetryEvents() {
  if (!telemetryIframe || !closeIframeBtn) return;

  telemetryIframe.addEventListener('load', () => {
    telemetryLoader.style.opacity = '0';
    telemetryLoader.style.pointerEvents = 'none';
  });

  closeIframeBtn.addEventListener('click', () => {
    telemetryPanel.classList.remove('active');
    telemetryIframe.src = '';
    document.body.classList.remove('no-scroll');
  });
}

// Interactive Palette & Theme Switcher
function initThemeSwitcher() {
  const widget = document.getElementById('palette-switcher-widget');
  const toggleBtn = document.getElementById('palette-toggle-btn');
  const closeBtn = document.getElementById('palette-close-btn');
  const optButtons = document.querySelectorAll('.palette-opt-btn');

  if (!widget || !toggleBtn) return;

  const THEMES = ['theme-titanio', 'theme-blueprint', 'theme-slate', 'theme-foundry'];
  const savedTheme = localStorage.getItem('electroductos-theme') || 'theme-titanio';

  function applyTheme(themeClass) {
    THEMES.forEach(t => document.body.classList.remove(t));
    document.body.classList.add(themeClass);
    localStorage.setItem('electroductos-theme', themeClass);

    optButtons.forEach(btn => {
      if (btn.getAttribute('data-theme') === themeClass) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Apply initial theme
  applyTheme(savedTheme);

  // Toggle switcher menu
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    widget.classList.toggle('open');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      widget.classList.remove('open');
    });
  }

  // Handle clicking palette options
  optButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-theme');
      if (selected) {
        applyTheme(selected);
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target)) {
      widget.classList.remove('open');
    }
  });
}

