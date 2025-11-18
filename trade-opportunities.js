// Trade Opportunities View
// Groups buy/sell orders to show trading opportunities

class TradeOpportunities {
  constructor() {
    this.app = null; // Reference to SETradeHouse instance
    this.mode = 'buy-focus'; // 'buy-focus' or 'sell-focus'
    this.testMode = false;
    this.filters = {
      search: '',
      goodType: 'all',
      nearPlanet: 'all',
      minProfit: 0
    };
    this.opportunities = [];

    this.init();
  }

  async init() {
    // Load planet data first
    if (window.planetDataLoader) {
      await window.planetDataLoader.loadPlanetData();
      this.populatePlanetFilter();
    }

    this.bindEvents();

    // Wait for main app to load data
    this.waitForAppData();
  }

  waitForAppData() {
    // Check if SETradeHouse instance exists and has data
    const checkInterval = setInterval(() => {
      if (window.seTradeHouseApp && window.seTradeHouseApp.transactions.length > 0) {
        clearInterval(checkInterval);
        this.app = window.seTradeHouseApp;
        this.processOpportunities();
      }
    }, 100);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!this.app) {
        console.error('Failed to load trade data');
      }
    }, 10000);
  }

  populatePlanetFilter() {
    const planetFilter = document.getElementById('planet-filter');
    if (!planetFilter) return;

    if (window.planetDataLoader && window.planetDataLoader.isLoaded()) {
      const planets = window.planetDataLoader.getPlanets();
      planets.forEach(planet => {
        const option = document.createElement('option');
        option.value = planet.name.toLowerCase();
        option.textContent = `${planet.name} (100km)`;
        planetFilter.appendChild(option);
      });
    }
  }

  bindEvents() {
    // Test mode toggle
    const testModeToggle = document.getElementById('test-mode-toggle');
    if (testModeToggle) {
      testModeToggle.addEventListener('change', async (e) => {
        this.testMode = e.target.checked;
        const testModeInfo = document.getElementById('test-mode-info');
        const testInfoDetails = document.getElementById('test-info-details');

        if (this.testMode) {
          // Generate test data
          if (window.testDataGenerator) {
            const testData = await window.testDataGenerator.generateTestData();

            // Override app transactions with test data
            if (this.app) {
              this.app.transactions = testData;
            }

            // Show test info
            if (testModeInfo) testModeInfo.classList.remove('hidden');
            if (testInfoDetails && window.testDataGenerator) {
              testInfoDetails.textContent = window.testDataGenerator.getTestDataInfo();
            }
          }
        } else {
          // Reload real data
          if (this.app) {
            await this.app.loadData();
          }

          // Hide test info
          if (testModeInfo) testModeInfo.classList.add('hidden');
        }

        this.processOpportunities();
      });
    }

    // Mode toggle buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.mode = e.currentTarget.dataset.mode;
        this.processOpportunities();
      });
    });

    // Search filter
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value.toLowerCase();
        this.processOpportunities();
      });
    }

    // Good type filter
    const goodTypeFilter = document.getElementById('good-type-filter');
    if (goodTypeFilter) {
      goodTypeFilter.addEventListener('change', (e) => {
        this.filters.goodType = e.target.value;
        this.processOpportunities();
      });
    }

    // Planet filter
    const planetFilter = document.getElementById('planet-filter');
    if (planetFilter) {
      planetFilter.addEventListener('change', (e) => {
        this.filters.nearPlanet = e.target.value;
        this.processOpportunities();
      });
    }

    // Min profit filter
    const minProfitInput = document.getElementById('min-profit');
    if (minProfitInput) {
      minProfitInput.addEventListener('input', (e) => {
        this.filters.minProfit = parseFloat(e.target.value) || 0;
        this.processOpportunities();
      });
    }

    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        if (this.app) {
          this.app.loadData();
          setTimeout(() => this.processOpportunities(), 1000);
        }
      });
    }
  }

  processOpportunities() {
    if (!this.app || !this.app.transactions || this.app.transactions.length === 0) {
      return;
    }

    // Group transactions by item
    const itemGroups = {};

    this.app.transactions.forEach(transaction => {
      const itemName = transaction.goodName;
      if (!itemGroups[itemName]) {
        itemGroups[itemName] = {
          name: itemName,
          type: transaction.goodType,
          buyOrders: [],
          sellOffers: []
        };
      }

      if (transaction.transactionType === 'order') {
        itemGroups[itemName].buyOrders.push(transaction);
      } else {
        itemGroups[itemName].sellOffers.push(transaction);
      }
    });

    // Build opportunities based on mode
    this.opportunities = [];

    Object.values(itemGroups).forEach(group => {
      if (this.mode === 'buy-focus') {
        // Buy-Focused: Show items to BUY (sell offers) and where you can SELL them (buy orders)
        // For each sell offer, show all buy orders that would purchase it
        if (group.sellOffers.length > 0 && group.buyOrders.length > 0) {
          // Find cheapest sell offer (best price to buy at)
          const primarySell = group.sellOffers.reduce((cheapest, current) =>
            current.price < cheapest.price ? current : cheapest
          );

          this.opportunities.push({
            itemName: group.name,
            itemType: group.type,
            primary: primarySell,
            primaryType: 'sell',
            matches: group.buyOrders
          });
        }
      } else {
        // Sell-Focused: Just list all sell offers sorted by best price
        if (group.sellOffers.length > 0) {
          // Sort sell offers by price (cheapest first)
          const sortedSellOffers = group.sellOffers.sort((a, b) => a.price - b.price);

          this.opportunities.push({
            itemName: group.name,
            itemType: group.type,
            primary: sortedSellOffers[0], // Best sell offer
            primaryType: 'sell',
            matches: sortedSellOffers.slice(1) // Rest of sell offers
          });
        }
      }
    });

    this.applyFilters();
    this.render();
  }

  applyFilters() {
    let filtered = [...this.opportunities];

    // Apply search filter
    if (this.filters.search) {
      filtered = filtered.filter(opp =>
        opp.itemName.toLowerCase().includes(this.filters.search)
      );
    }

    // Apply good type filter
    if (this.filters.goodType !== 'all') {
      filtered = filtered.filter(opp => opp.itemType === this.filters.goodType);
    }

    // Apply planet proximity filter
    if (this.filters.nearPlanet !== 'all' && window.planetDataLoader && window.planetDataLoader.isLoaded()) {
      const planet = window.planetDataLoader.getPlanet(this.filters.nearPlanet);
      if (planet) {
        const maxDistance = 100000; // 100km
        filtered = filtered.filter(opp => {
          const primaryDistance = this.calculateDistance(planet, opp.primary.gps);
          return primaryDistance <= maxDistance;
        });
      }
    }

    // Apply min profit filter
    if (this.filters.minProfit > 0) {
      filtered = filtered.forEach(opp => {
        opp.matches = opp.matches.filter(match => {
          const profit = this.calculateProfit(opp.primary, match);
          return profit >= this.filters.minProfit;
        });
      });
      filtered = filtered.filter(opp => opp.matches.length > 0);
    }

    this.opportunities = filtered;
  }

  calculateProfit(primary, match) {
    if (this.mode === 'buy-focus') {
      // Buy-Focused: Buying at primary.price (sell offer), selling at match.price (buy order)
      return match.price - primary.price;
    } else {
      // Sell-Focused: No profit calculation needed, just showing sell offers
      return 0;
    }
  }

  calculateDistance(gps1, gps2) {
    const dx = gps2.x - gps1.x;
    const dy = gps2.y - gps1.y;
    const dz = gps2.z - gps1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  formatDistance(meters) {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  }

  render() {
    const container = document.getElementById('opportunities-container');
    const noResults = document.getElementById('no-results');

    if (!container) return;

    if (this.opportunities.length === 0) {
      container.innerHTML = '';
      noResults.classList.remove('hidden');
      this.updateStats(0, 0, 0);
      return;
    }

    noResults.classList.add('hidden');

    let html = '';
    let totalOpportunities = 0;
    let bestProfit = 0;

    this.opportunities.forEach(opp => {
      totalOpportunities += opp.matches.length;

      const modeClass = this.mode === 'buy-focus' ? 'buy-focus' : 'sell-focus';
      const primaryBadge = this.mode === 'buy-focus' ?
        '<span class="trade-type-badge sell">Best Deal to Buy</span>' :
        '<span class="trade-type-badge sell">Best Sell Offer</span>';

      html += `
        <div class="opportunity-card">
          <div class="primary-trade ${modeClass}">
            <div>
              <div class="trade-item-name">${this.escapeHtml(opp.itemName)}</div>
              <div style="margin-top: 5px;">${primaryBadge}</div>
            </div>
            <div class="primary-info">
              <div class="info-group">
                <div class="info-label">Store</div>
                <div class="info-value">${this.escapeHtml(opp.primary.owner)}</div>
              </div>
              <div class="info-group">
                <div class="info-label">Price</div>
                <div class="info-value">${this.formatNumber(opp.primary.price)} SC</div>
              </div>
              <div class="info-group">
                <div class="info-label">Quantity</div>
                <div class="info-value">${this.formatNumber(opp.primary.quantity)}</div>
              </div>
              <div class="info-group">
                <div class="info-label">Location</div>
                <div class="info-value">${this.escapeHtml(opp.primary.gps.name)}</div>
              </div>
            </div>
          </div>

          ${this.mode === 'buy-focus' ? `
          <div class="opportunities-header">
            <div>Store / Owner</div>
            <div>Buy Price</div>
            <div>Quantity</div>
            <div>Profit/Unit</div>
            <div>Total Profit</div>
            <div>Location</div>
          </div>

          <div class="opportunities-list">
            ${opp.matches.map(match => this.renderOpportunityRow(opp.primary, match)).join('')}
          </div>
          ` : `
          <div class="opportunities-header sell-header">
            <div>Store / Owner</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Location</div>
          </div>

          <div class="opportunities-list">
            ${opp.matches.map(match => this.renderSellOfferRow(match, opp.primary)).join('')}
          </div>
          `}
        </div>
      `;

      // Calculate best profit
      opp.matches.forEach(match => {
        const profit = this.calculateProfit(opp.primary, match);
        if (profit > bestProfit) bestProfit = profit;
      });
    });

    container.innerHTML = html;
    this.updateStats(totalOpportunities, this.opportunities.length, bestProfit);

    // Show main content
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('loading').classList.add('hidden');
  }

  renderOpportunityRow(primary, match) {
    const profitPerUnit = this.calculateProfit(primary, match);
    const totalProfit = profitPerUnit * Math.min(primary.quantity, match.quantity);
    const profitClass = profitPerUnit > 0 ? 'positive' : 'negative';
    const rowClass = profitPerUnit > 0 ? 'profitable' : '';

    let distanceHtml = '';
    if (window.gpsManager && window.gpsManager.hasGPS()) {
      const userGPS = window.gpsManager.getGPS();
      const distance = this.calculateDistance(userGPS, match.gps);
      distanceHtml = this.formatDistance(distance);
    } else {
      const distance = this.calculateDistance(primary.gps, match.gps);
      distanceHtml = this.formatDistance(distance);
    }

    return `
      <div class="opportunity-row ${rowClass}">
        <div class="row-store">${this.escapeHtml(match.owner)}</div>
        <div class="row-price">${this.formatNumber(match.price)} SC</div>
        <div class="row-quantity">${this.formatNumber(match.quantity)}</div>
        <div class="row-profit ${profitClass}">${profitPerUnit >= 0 ? '+' : ''}${this.formatNumber(profitPerUnit)} SC</div>
        <div class="row-profit ${profitClass}">${totalProfit >= 0 ? '+' : ''}${this.formatNumber(totalProfit)} SC</div>
        <div class="row-distance">${this.escapeHtml(match.gps.name)} (${distanceHtml})</div>
      </div>
    `;
  }

  renderSellOfferRow(sellOffer, primaryOffer) {
    let distanceHtml = '';
    if (window.gpsManager && window.gpsManager.hasGPS()) {
      const userGPS = window.gpsManager.getGPS();
      const distance = this.calculateDistance(userGPS, sellOffer.gps);
      distanceHtml = this.formatDistance(distance);
    } else {
      const distance = this.calculateDistance(primaryOffer.gps, sellOffer.gps);
      distanceHtml = this.formatDistance(distance);
    }

    return `
      <div class="opportunity-row sell-offer-row">
        <div class="row-store">${this.escapeHtml(sellOffer.owner)}</div>
        <div class="row-price">${this.formatNumber(sellOffer.price)} SC</div>
        <div class="row-quantity">${this.formatNumber(sellOffer.quantity)}</div>
        <div class="row-distance">${this.escapeHtml(sellOffer.gps.name)} (${distanceHtml})</div>
      </div>
    `;
  }

  updateStats(opportunities, uniqueItems, bestProfit) {
    const statOpportunities = document.getElementById('stat-opportunities');
    const statItems = document.getElementById('stat-items');
    const statBestProfit = document.getElementById('stat-best-profit');

    if (statOpportunities) statOpportunities.textContent = opportunities;
    if (statItems) statItems.textContent = uniqueItems;
    if (statBestProfit) statBestProfit.textContent = this.formatNumber(bestProfit);
  }

  formatNumber(num) {
    return new Intl.NumberFormat().format(Math.round(num));
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.tradeOpportunities = new TradeOpportunities();
});
