// Shared Navigation Component for SE TradeHouse
class Navigation {
  constructor() {
    // Determine base path based on current location
    this.basePath = this.getBasePath();

    this.links = [
      { name: 'Home', path: 'index.html', icon: '🏠' },
      { name: 'Trading', path: '#', icon: '💰', children: [
        { name: 'All Trades', path: 'index.html' },
        { name: 'Trade Opportunities', path: 'trade-opportunities.html' }
      ]},
      { name: 'Maps', path: '#', icon: '🗺️', children: [
        { name: '2D System Map', path: 'maps/system-2d.html' },
        { name: '3D System Map', path: 'maps/system-3d.html' }
      ]},
      { name: 'Calculators', path: '#', icon: '🧮', children: [
        { name: 'Thrust Calculator', path: 'calculators/thrust.html' }
      ]},
      { name: 'Tests', path: '#', icon: '🧪', children: [
        { name: 'Parsing Tests', path: 'test_parsing.html' },
        { name: 'Unit Tests', path: 'tests/index.html' }
      ]}
    ];
  }

  getBasePath() {
    const path = window.location.pathname;

    // Check if we're in a subdirectory
    if (path.includes('/tests/')) {
      return '../';
    } else if (path.includes('/maps/') || path.includes('/calculators/')) {
      return '../';
    }

    // Root directory
    return './';
  }

  render() {
    const currentPath = window.location.pathname;

    const nav = document.createElement('nav');
    nav.className = 'main-nav';
    nav.innerHTML = `
      <div class="nav-container">
        <div class="nav-brand">
          <a href="${this.basePath}index.html">
            <span class="brand-icon">🚀</span>
            <span class="brand-text">SE TradeHouse</span>
          </a>
        </div>
        <ul class="nav-links">
          ${this.links.map(link => this.renderLink(link, currentPath)).join('')}
        </ul>
      </div>
    `;

    return nav;
  }

  renderLink(link, currentPath) {
    const isActive = currentPath.includes(link.path) ||
                     (link.children && link.children.some(child => currentPath.includes(child.path)));

    if (link.children) {
      return `
        <li class="nav-item dropdown ${isActive ? 'active' : ''}">
          <a href="${link.path}" class="nav-link">
            <span class="nav-icon">${link.icon}</span>
            ${link.name}
            <span class="dropdown-arrow">▼</span>
          </a>
          <ul class="dropdown-menu">
            ${link.children.map(child => `
              <li><a href="${this.basePath}${child.path}" class="${currentPath.includes(child.path) ? 'active' : ''}">${child.name}</a></li>
            `).join('')}
          </ul>
        </li>
      `;
    }

    return `
      <li class="nav-item ${isActive ? 'active' : ''}">
        <a href="${this.basePath}${link.path}" class="nav-link">
          <span class="nav-icon">${link.icon}</span>
          ${link.name}
        </a>
      </li>
    `;
  }

  injectIntoPage() {
    const body = document.body;
    const nav = this.render();

    // Insert navigation as first child of body
    if (body.firstChild) {
      body.insertBefore(nav, body.firstChild);
    } else {
      body.appendChild(nav);
    }

    // Add event listeners for dropdowns
    this.attachEventListeners();
  }

  attachEventListeners() {
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');

    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('mouseenter', () => {
        dropdown.classList.add('show');
      });

      dropdown.addEventListener('mouseleave', () => {
        dropdown.classList.remove('show');
      });

      // Toggle on click for mobile
      const link = dropdown.querySelector('.nav-link');
      link.addEventListener('click', (e) => {
        if (window.innerWidth < 768) {
          e.preventDefault();
          dropdown.classList.toggle('show');
        }
      });
    });
  }
}

// Auto-initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const navigation = new Navigation();
  navigation.injectIntoPage();
});
