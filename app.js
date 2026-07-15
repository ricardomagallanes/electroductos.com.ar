// Products Data Store
const products = [
  {
    id: 'comp-a',
    name: 'Componente Eléctrico A',
    category: 'componentes',
    description: 'Interruptor termomagnético de alta fiabilidad, diseñado para proteger sistemas industriales de sobrecargas y cortocircuitos.',
    icon: 'cpu',
    specs: ['Capacidad: 63A', 'Voltaje: 400V', 'Norma: IEC 60947-2']
  },
  {
    id: 'comp-b',
    name: 'Componente Eléctrico B',
    category: 'componentes',
    description: 'Contactor magnético trifásico con bobina de bajo consumo energético, ideal para el arranque y control de motores de alta potencia.',
    icon: 'zap-off',
    specs: ['Potencia: 30kW', 'Contactos: 3 NA + 1 NC', 'Bobina: 220V CA']
  },
  {
    id: 'comp-c',
    name: 'Componente Eléctrico C',
    category: 'componentes',
    description: 'Relé térmico de sobrecarga con sensibilidad de fase y compensación de temperatura, garantizando una protección integral del motor.',
    icon: 'activity',
    specs: ['Rango: 12-18A', 'Clase de disparo: 10', 'Reset manual/auto']
  },
  {
    id: 'pilar-a',
    name: 'Pilar Tipo A',
    category: 'pilares',
    description: 'Gabinete premoldeado monofásico para acometida aérea. Fabricado con materiales altamente resistentes a la intemperie y rayos UV.',
    icon: 'columns',
    specs: ['Uso: Monofásico', 'Material: Resina sintética', 'Norma: AEA 95150']
  },
  {
    id: 'pilar-b',
    name: 'Pilar Tipo B',
    category: 'pilares',
    description: 'Gabinete reforzado trifásico para acometida subterránea. Incluye compartimentos separados para medidor y llaves de protección.',
    icon: 'server',
    specs: ['Uso: Trifásico', 'Material: Policarbonato', 'Grado IP: IP65']
  },
  {
    id: 'pilar-c',
    name: 'Pilar Tipo C',
    category: 'pilares',
    description: 'Pilar premoldeado doble para acometida dual (residencial/comercial) con base autoportante reforzada de alta durabilidad.',
    icon: 'layout-grid',
    specs: ['Uso: Doble Monofásico', 'Altura: 180cm', 'Resistencia al fuego: V0']
  },
  {
    id: 'sub-a',
    name: 'Subestación Tipo A',
    category: 'subestaciones',
    description: 'Subestación transformadora aérea de distribución (SET), optimizada para entornos urbanos y rurales de mediana densidad de carga.',
    icon: 'box',
    specs: ['Potencia: Hasta 315 kVA', 'Tensión: 13.2 / 0.4 kV', 'Tipo: Aérea']
  },
  {
    id: 'sub-b',
    name: 'Subestación Tipo B',
    category: 'subestaciones',
    description: 'Subestación transformadora a nivel en cabina prefabricada de hormigón. Cuenta con celdas blindadas con aislamiento en gas SF6.',
    icon: 'package',
    specs: ['Potencia: Hasta 1000 kVA', 'Seguridad: Arco interno', 'Uso: Industrial']
  },
  {
    id: 'sub-c',
    name: 'Subestación Tipo C',
    category: 'subestaciones',
    description: 'Subestación subterránea compacta para redes de distribución subterránea en centros de alta densidad comercial y habitacional.',
    icon: 'database',
    specs: ['Tensión: 33 / 13.2 kV', 'Aislamiento: SF6 / Aire', 'Ventilación: Forzada inteligente']
  }
];

// URLs for Telemetry dashboards
const telemetryUrls = {
  'coop-a': 'https://mp.usriot.com/draw/s.html?s=snk6xse5t8&a=aHR0cHM6Ly9hcGkubXAudXNyaW90LmNvbS91c3JDbG91ZA==&l=en',
  'coop-b': 'coop_dashboard.html?coop=B',
  'coop-c': 'coop_dashboard.html?coop=C'
};

// DOM Elements
const grid = document.getElementById('products-display-grid');
const tabs = document.querySelectorAll('.tab-btn');
const navItems = document.querySelectorAll('.nav-item');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
const siteHeader = document.getElementById('site-header');

const telemetrySection = document.getElementById('telemedicion');
const catalogSection = document.getElementById('catalogo');
const heroSection = document.getElementById('inicio');

const coopCards = document.querySelectorAll('.coop-card');
const telemetryPanel = document.getElementById('telemetry-panel');
const telemetryIframe = document.getElementById('telemetry-iframe');
const telemetryLoader = document.getElementById('telemetry-loader');
const activeCoopTitle = document.getElementById('active-coop-title');
const closeIframeBtn = document.getElementById('close-iframe-btn');

// Initialize Website
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  initNavigation();
  initMobileMenu();
  initTelemetryEvents();
  
  // Header scroll class toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });
  
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// Render products dynamically based on category filter
function renderProducts(category) {
  grid.innerHTML = '';
  
  // Filter products by category
  const filtered = category === 'all' 
    ? products 
    : products.filter(p => p.category === category);
    
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i data-lucide="info" style="width: 48px; height: 48px; margin-bottom: 16px;"></i>
        <p>No hay productos disponibles en esta categoría.</p>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }
  
  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    
    // Create bullet point specs list
    const specsHtml = product.specs.map(spec => `<li>• ${spec}</li>`).join('');
    
    card.innerHTML = `
      <div class="product-image-container">
        <span class="product-badge">${product.category.toUpperCase()}</span>
        <div class="product-icon-wrap">
          <i data-lucide="${product.icon}"></i>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <ul style="list-style: none; padding: 0; margin-bottom: 20px; font-size: 0.85rem; color: var(--text-muted);">
          ${specsHtml}
        </ul>
        <div class="product-footer">
          <span class="product-price">Garantía Oficial</span>
          <button class="product-btn" onclick="alert('Consulta enviada por ${product.name}. Un asesor técnico lo contactará a la brevedad.')">
            Consultar <i data-lucide="mail" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  
  // Re-run icon replacement
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Navigation & Routing Logic
function initNavigation() {
  // Tabs filtering
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.getAttribute('data-category');
      
      // Update active tab button
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update nav links active state
      navItems.forEach(n => {
        n.classList.remove('active');
        if (n.getAttribute('data-target') === cat) {
          n.classList.add('active');
        }
      });
      
      // Show/Hide relevant sections
      handleCategoryNavigation(cat);
    });
  });
  
  // Header navigation links
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetCat = item.getAttribute('data-target');
      
      // Update header active styling
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      
      // Update category selector tabs active styling
      tabs.forEach(t => {
        if (t.getAttribute('data-category') === targetCat) {
          t.classList.add('active');
        } else {
          t.classList.remove('active');
        }
      });
      
      handleCategoryNavigation(targetCat);
      
      // Close mobile menu if open
      navLinks.classList.remove('mobile-active');
      mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });

  // Global function for footer links
  window.filterCategory = (cat) => {
    // Simulate tab click
    const matchingTab = Array.from(tabs).find(t => t.getAttribute('data-category') === cat);
    if (matchingTab) {
      matchingTab.click();
    }
  };
}

// Handle transition visibility between catalog & telemetry
function handleCategoryNavigation(category) {
  if (category === 'telemedicion') {
    catalogSection.style.display = 'none';
    heroSection.style.display = 'none';
    telemetrySection.classList.add('active');
    
    // Smooth scroll to telemetry
    telemetrySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    catalogSection.style.display = 'block';
    heroSection.style.display = 'flex';
    telemetrySection.classList.remove('active');
    
    renderProducts(category);
    
    // Smooth scroll to catalog
    catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Mobile responsive menu toggle
function initMobileMenu() {
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

// Telemetry Iframe Flow Events
function initTelemetryEvents() {
  coopCards.forEach(card => {
    card.addEventListener('click', () => {
      const coopId = card.getAttribute('data-coop-id');
      const coopName = card.querySelector('.coop-name').innerText;
      const url = telemetryUrls[coopId];
      
      // Show loader and update title
      telemetryLoader.style.opacity = '1';
      telemetryLoader.style.pointerEvents = 'all';
      activeCoopTitle.innerText = `Panel de Control - ${coopName}`;
      
      // Update iframe source
      telemetryIframe.src = url;
      
      // Open panel
      telemetryPanel.classList.add('active');
      
      // Smooth scroll to panel
      setTimeout(() => {
        telemetryPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    });
  });
  
  // Hide loader once iframe is fully loaded
  telemetryIframe.addEventListener('load', () => {
    telemetryLoader.style.opacity = '0';
    telemetryLoader.style.pointerEvents = 'none';
  });
  
  // Close Iframe Viewer
  closeIframeBtn.addEventListener('click', () => {
    telemetryPanel.classList.remove('active');
    telemetryIframe.src = '';
  });
}
