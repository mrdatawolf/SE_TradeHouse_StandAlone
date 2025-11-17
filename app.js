// SE TradeHouse Standalone - Main Application
// Updated to work with single-sheet format

class SETradeHouse {
  constructor() {
    this.transactions = [];
    this.filteredData = [];
    this.currentView = 'stores';
    this.filters = {
      search: '',
      goodType: 'all',
      transactionType: 'all',
      sortBy: 'profit',
      nearPlanet: 'all'
    };

    this.init();
  }

  // Initialize the application
  async init() {
    // Load planet data first
    if (window.planetDataLoader) {
      await window.planetDataLoader.loadPlanetData();
      this.populatePlanetFilter();
    }

    this.bindEvents();
    this.loadData();
  }

  // Populate planet filter dropdown
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

  // Bind UI event listeners
  bindEvents() {
    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.loadData();
      });
    }

    // GPS update listener - re-render to show distances
    window.addEventListener('gpsUpdated', () => {
      if (this.transactions.length > 0) {
        this.render();
      }
    });

    window.addEventListener('gpsCleared', () => {
      if (this.transactions.length > 0) {
        this.render();
      }
    });

    // Retry button
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.loadData();
      });
    }

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value.toLowerCase();
        this.applyFiltersAndRender();
      });
    }

    // Good type filter
    const goodTypeFilter = document.getElementById('good-type-filter');
    if (goodTypeFilter) {
      goodTypeFilter.addEventListener('change', (e) => {
        this.filters.goodType = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    // Transaction filter
    const transactionFilter = document.getElementById('transaction-filter');
    if (transactionFilter) {
      transactionFilter.addEventListener('change', (e) => {
        this.filters.transactionType = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    // Planet proximity filter
    const planetFilter = document.getElementById('planet-filter');
    if (planetFilter) {
      planetFilter.addEventListener('change', (e) => {
        this.filters.nearPlanet = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.filters.sortBy = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    // Show stats toggle
    const showStatsToggle = document.getElementById('show-stats-toggle');
    if (showStatsToggle) {
      showStatsToggle.addEventListener('change', (e) => {
        const statsPanel = document.getElementById('stats-panel');
        if (statsPanel) {
          statsPanel.style.display = e.target.checked ? 'grid' : 'none';
        }
      });
    }

    // Tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
      tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const view = e.target.dataset.view;
          this.switchView(view);
        });
      });
    }
  }

  // Load data from Google Sheets
  async loadData() {
    this.showLoading();
    this.hideError();

    try {
      // Fetch data from sheet (CSV or API mode)
      const data = await this.fetchSheetData();

      // Parse the data
      this.transactions = this.parseTransactions(data);

      // Calculate profits
      this.calculateProfits();

      // Update UI
      this.updateLastUpdate();
      this.applyFiltersAndRender();
      this.showMainContent();

    } catch (error) {
      console.error('Error loading data:', error);
      this.showError(error.message);
    }
  }

  // Fetch data from sheet (supports both CSV and API modes)
  async fetchSheetData() {
    if (CONFIG.ACCESS_MODE === 'csv') {
      return await this.fetchSheetAsCSV();
    } else {
      return await this.fetchSheetViaAPI();
    }
  }

  // Fetch sheet as CSV (no API key needed, sheet must be public)
  async fetchSheetAsCSV() {
    const url = `https://docs.google.com/spreadsheets/d/${CONFIG.GOOGLE_SHEET_ID}/export?format=csv&gid=${CONFIG.SHEET_GID}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Sheets. Make sure your sheet is set to "Anyone with the link can view".');
    }

    const csvText = await response.text();
    return this.parseCSV(csvText);
  }

  // Fetch sheet via Google Sheets API (requires API key)
  async fetchSheetViaAPI() {
    // Validate API key
    if (!CONFIG.GOOGLE_API_KEY || CONFIG.GOOGLE_API_KEY === 'YOUR_API_KEY_HERE') {
      throw new Error('API mode requires a Google API Key. Either add your API key or switch to CSV mode in config.js');
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.GOOGLE_SHEET_ID}/values/${CONFIG.SHEET_NAME}?key=${CONFIG.GOOGLE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch data from Google Sheets API');
    }

    const data = await response.json();
    return data.values || [];
  }

  // Parse CSV text into array of arrays
  parseCSV(csvText) {
    const lines = csvText.split('\n');
    const result = [];

    for (let line of lines) {
      if (!line.trim()) continue;

      // Simple CSV parser (handles quoted fields with commas)
      const row = [];
      let currentField = '';
      let insideQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
          if (insideQuotes && nextChar === '"') {
            // Escaped quote
            currentField += '"';
            i++; // Skip next quote
          } else {
            // Toggle quote state
            insideQuotes = !insideQuotes;
          }
        } else if (char === ',' && !insideQuotes) {
          // End of field
          row.push(currentField.trim());
          currentField = '';
        } else {
          currentField += char;
        }
      }

      // Add last field
      row.push(currentField.trim());
      result.push(row);
    }

    return result;
  }

  // Parse transactions from sheet data
  // Columns: Item, Type, Quantity, Price, Order or Offer, Owner, Station Type, GPS, Unique ID, Last Update
  parseTransactions(data) {
    if (data.length < 2) return [];

    const headers = data[0].map(h => h.trim().toLowerCase());
    const transactions = [];

    // Find column indices
    const colIndices = {
      item: this.findColumnIndex(headers, ['item']),
      type: this.findColumnIndex(headers, ['type']),
      quantity: this.findColumnIndex(headers, ['quantity', 'qty']),
      price: this.findColumnIndex(headers, ['price']),
      orderOrOffer: this.findColumnIndex(headers, ['order or offer', 'order/offer', 'transaction type']),
      owner: this.findColumnIndex(headers, ['owner']),
      stationType: this.findColumnIndex(headers, ['station type', 'type']),
      gps: this.findColumnIndex(headers, ['gps', 'coordinates', 'location']),
      uniqueId: this.findColumnIndex(headers, ['unique id', 'id', 'uniqueid']),
      lastUpdate: this.findColumnIndex(headers, ['last update', 'updated', 'timestamp'])
    };

    // Parse each row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];

      // Skip empty rows
      if (!row || row.length === 0 || !row[colIndices.item]) {
        continue;
      }

      const orderOrOfferValue = (row[colIndices.orderOrOffer] || '').toLowerCase().trim();
      const transactionType = this.normalizeTransactionType(orderOrOfferValue);

      const gpsString = row[colIndices.gps] || '';
      const coords = this.parseGPS(gpsString);

      // Parse item name and type (supports both formats)
      const itemData = this.parseItemNameAndType(
        row[colIndices.item] || 'Unknown',
        row[colIndices.type] || ''
      );

      const transaction = {
        id: row[colIndices.uniqueId] || `${i}`,
        goodName: itemData.name,
        goodType: itemData.type,
        quantity: parseInt(row[colIndices.quantity]) || 0,
        price: parseFloat(row[colIndices.price]) || 0,
        transactionType: transactionType,
        owner: row[colIndices.owner] || 'Unknown',
        stationType: row[colIndices.stationType] || '',
        gps: coords,
        gpsString: gpsString,
        lastUpdate: row[colIndices.lastUpdate] || '',
        profit: 0,
        profitDetails: null
      };

      transactions.push(transaction);
    }

    return transactions;
  }

  // Parse item name and type from Space Engineers format or plain format
  // Handles: "MyObjectBuilder_Ingot/Uranium" -> {name: "Uranium", type: "Ingot"}
  // Also handles: plain name with separate type column
  parseItemNameAndType(itemValue, typeValue) {
    // Check if item is in Space Engineers format (MyObjectBuilder_Type/ItemName)
    if (itemValue.includes('MyObjectBuilder_')) {
      const correctedItem = this.correctSeNameIssues(itemValue);
      const parts = correctedItem.split('/');

      if (parts.length >= 2) {
        const seType = parts[0]; // e.g., "MyObjectBuilder_Ingot"
        const itemName = parts[1]; // e.g., "Uranium"
        const goodType = this.seNameToGoodType(seType, itemName);

        return {
          name: itemName,
          type: goodType
        };
      }
    }

    // Fallback to plain format
    return {
      name: itemValue,
      type: typeValue || 'Unknown'
    };
  }

  // Convert Space Engineers type prefix to good type
  seNameToGoodType(seType, itemName) {
    // Special tool items that have PhysicalGunObject prefix but are tools
    // Note: Check both with and without "Item" suffix due to SE API inconsistencies
    const specialTools = [
      'WelderItem', 'Welder2Item', 'Welder3Item', 'Welder4Item',
      'Welder', 'Welder2', 'Welder3', 'Welder4',
      'AngleGrinderItem', 'AngleGrinder2Item', 'AngleGrinder3Item', 'AngleGrinder4Item',
      'AngleGrinder', 'AngleGrinder2', 'AngleGrinder3', 'AngleGrinder4',
      'HandDrillItem', 'HandDrill2Item', 'HandDrill3Item', 'HandDrill4Item',
      'HandDrill', 'HandDrill2', 'HandDrill3', 'HandDrill4',
      'AutomaticRifleItem', 'RapidFireAutomaticRifleItem', 'PreciseAutomaticRifleItem', 'UltimateAutomaticRifleItem',
      'AutomaticRifle', 'RapidFireAutomaticRifle', 'PreciseAutomaticRifle', 'UltimateAutomaticRifle'
    ];

    switch (seType) {
      case 'MyObjectBuilder_Ingot':
        return 'Ingot';
      case 'MyObjectBuilder_Ore':
        return 'Ore';
      case 'MyObjectBuilder_Component':
        return 'Component';
      case 'MyObjectBuilder_ConsumableItem':
        return 'Consumable';
      case 'MyObjectBuilder_AmmoMagazine':
      case 'MyObjectBuilder_PhysicalGunObject':
        // Check if it's a special tool item
        return specialTools.includes(itemName) ? 'Tool' : 'Ammo';
      case 'MyObjectBuilder_GasContainerObject':
      case 'MyObjectBuilder_OxygenContainerObject':
        return 'Bottle';
      default:
        return 'Tool';
    }
  }

  // Correct known Space Engineers API naming inconsistencies
  correctSeNameIssues(seName) {
    const corrections = {
      'MyObjectBuilder_PhysicalGunObject/AutomaticRifleItem': 'MyObjectBuilder_PhysicalGunObject/AutomaticRifle',
      'MyObjectBuilder_AmmoMagazine/NATO_25x184mmMagazine': 'MyObjectBuilder_AmmoMagazine/NATO_25x184mm',
      'MyObjectBuilder_AmmoMagazine/Missile200mmMagazine': 'MyObjectBuilder_AmmoMagazine/Missile200mm'
    };

    return corrections[seName] || seName;
  }

  // Find column index by trying multiple possible names
  findColumnIndex(headers, possibleNames) {
    for (const name of possibleNames) {
      const index = headers.indexOf(name);
      if (index !== -1) return index;
    }
    return -1;
  }

  // Normalize transaction type to 'order' or 'offer'
  normalizeTransactionType(value) {
    const normalized = value.toLowerCase().trim();
    if (normalized.includes('order') || normalized.includes('buy')) {
      return 'order';
    } else if (normalized.includes('offer') || normalized.includes('sell')) {
      return 'offer';
    }
    return normalized;
  }

  // Parse GPS coordinates from various formats
  parseGPS(gpsString) {
    if (!gpsString) return { x: 0, y: 0, z: 0, name: '' };

    // Try SE GPS format: GPS:Name:X:Y:Z:
    const seFormat = /GPS:([^:]*):([^:]+):([^:]+):([^:]+):/i;
    const seMatch = gpsString.match(seFormat);
    if (seMatch) {
      return {
        name: seMatch[1].trim(),
        x: parseFloat(seMatch[2]) || 0,
        y: parseFloat(seMatch[3]) || 0,
        z: parseFloat(seMatch[4]) || 0
      };
    }

    // Try simple format: X,Y,Z or X Y Z
    const simpleFormat = /(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/;
    const simpleMatch = gpsString.match(simpleFormat);
    if (simpleMatch) {
      return {
        name: '',
        x: parseFloat(simpleMatch[1]) || 0,
        y: parseFloat(simpleMatch[2]) || 0,
        z: parseFloat(simpleMatch[3]) || 0
      };
    }

    // Could not parse
    return { x: 0, y: 0, z: 0, name: '' };
  }

  // Calculate profit opportunities for all transactions
  calculateProfits() {
    this.transactions.forEach(transaction => {
      if (transaction.transactionType === 'order') {
        // For orders (buy), find cheapest offer (sell)
        transaction.profitDetails = this.findBestOffer(transaction);
      } else if (transaction.transactionType === 'offer') {
        // For offers (sell), find highest order (buy)
        transaction.profitDetails = this.findBestOrder(transaction);
      }

      if (transaction.profitDetails) {
        transaction.profit = transaction.profitDetails.totalProfit;
      }
    });
  }

  // Find best offer (sell) for an order (buy)
  findBestOffer(order) {
    const offers = this.transactions.filter(t =>
      t.transactionType === 'offer' &&
      t.goodName === order.goodName &&
      t.owner !== order.owner
    );

    if (offers.length === 0) return null;

    // Find cheapest offer
    const cheapestOffer = offers.reduce((min, offer) =>
      offer.price < min.price ? offer : min
    );

    const profitPerUnit = order.price - cheapestOffer.price;
    if (profitPerUnit <= 0) return null;

    const availableQuantity = Math.min(order.quantity, cheapestOffer.quantity);
    const totalProfit = profitPerUnit * availableQuantity;
    const distance = this.calculateDistance(order.gps, cheapestOffer.gps);

    return {
      type: 'buy_and_sell',
      profitPerUnit,
      totalProfit,
      availableQuantity,
      fromStore: this.getStoreName(cheapestOffer),
      toStore: this.getStoreName(order),
      buyPrice: cheapestOffer.price,
      sellPrice: order.price,
      distance
    };
  }

  // Find best order (buy) for an offer (sell)
  findBestOrder(offer) {
    const orders = this.transactions.filter(t =>
      t.transactionType === 'order' &&
      t.goodName === offer.goodName &&
      t.owner !== offer.owner
    );

    if (orders.length === 0) return null;

    // Find highest order
    const highestOrder = orders.reduce((max, order) =>
      order.price > max.price ? order : max
    );

    const profitPerUnit = highestOrder.price - offer.price;
    if (profitPerUnit <= 0) return null;

    const availableQuantity = Math.min(offer.quantity, highestOrder.quantity);
    const totalProfit = profitPerUnit * availableQuantity;
    const distance = this.calculateDistance(offer.gps, highestOrder.gps);

    return {
      type: 'buy_and_sell',
      profitPerUnit,
      totalProfit,
      availableQuantity,
      fromStore: this.getStoreName(offer),
      toStore: this.getStoreName(highestOrder),
      buyPrice: offer.price,
      sellPrice: highestOrder.price,
      distance
    };
  }

  // Get store name from transaction
  getStoreName(transaction) {
    if (transaction.gps.name) {
      return transaction.gps.name;
    }
    return transaction.owner || 'Unknown';
  }

  // Calculate 3D distance between two GPS coordinates
  calculateDistance(gps1, gps2) {
    if (!gps1 || !gps2) return 0;

    const dx = gps2.x - gps1.x;
    const dy = gps2.y - gps1.y;
    const dz = gps2.z - gps1.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // Apply filters and sort, then render
  applyFiltersAndRender() {
    let filtered = [...this.transactions];

    // Apply search filter
    if (this.filters.search) {
      filtered = filtered.filter(t =>
        t.goodName.toLowerCase().includes(this.filters.search) ||
        t.owner.toLowerCase().includes(this.filters.search) ||
        t.gps.name.toLowerCase().includes(this.filters.search)
      );
    }

    // Apply good type filter
    if (this.filters.goodType !== 'all') {
      filtered = filtered.filter(t => t.goodType === this.filters.goodType);
    }

    // Apply transaction type filter
    if (this.filters.transactionType === 'buy') {
      filtered = filtered.filter(t => t.transactionType === 'order');
    } else if (this.filters.transactionType === 'sell') {
      filtered = filtered.filter(t => t.transactionType === 'offer');
    } else if (this.filters.transactionType === 'profitable') {
      filtered = filtered.filter(t => t.profit > 0);
    }

    // Apply planet proximity filter (within 100km)
    if (this.filters.nearPlanet !== 'all' && window.planetDataLoader && window.planetDataLoader.isLoaded()) {
      const planet = window.planetDataLoader.getPlanet(this.filters.nearPlanet);
      if (planet) {
        const maxDistance = 100000; // 100km in meters
        filtered = filtered.filter(t => {
          const distance = this.calculateDistance(planet, t.gps);
          return distance <= maxDistance;
        });
      }
    }

    // Apply sorting
    filtered = this.sortTransactions(filtered);

    this.filteredData = filtered;
    this.updateStatistics();
    this.render();
  }

  // Sort transactions based on selected criteria
  sortTransactions(transactions) {
    const sorted = [...transactions];

    switch (this.filters.sortBy) {
      case 'profit':
        sorted.sort((a, b) => b.profit - a.profit);
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'quantity':
        sorted.sort((a, b) => b.quantity - a.quantity);
        break;
      case 'item':
        sorted.sort((a, b) => a.goodName.localeCompare(b.goodName));
        break;
      case 'store':
        sorted.sort((a, b) => this.getStoreName(a).localeCompare(this.getStoreName(b)));
        break;
    }

    return sorted;
  }

  // Update statistics panel
  updateStatistics() {
    const statStores = document.getElementById('stat-stores');
    const statTransactions = document.getElementById('stat-transactions');
    const statItems = document.getElementById('stat-items');
    const statBestProfit = document.getElementById('stat-best-profit');

    // If elements don't exist (e.g., in test environment), skip updating stats
    if (!statStores || !statTransactions || !statItems || !statBestProfit) {
      return;
    }

    const uniqueStores = new Set(this.filteredData.map(t => t.owner)).size;
    const uniqueItems = new Set(this.filteredData.map(t => t.goodName)).size;
    const bestProfit = Math.max(...this.filteredData.map(t => t.profit), 0);

    statStores.textContent = uniqueStores;
    statTransactions.textContent = this.filteredData.length;
    statItems.textContent = uniqueItems;
    statBestProfit.textContent = this.formatNumber(bestProfit);
  }

  // Render the current view
  render() {
    const noResults = document.getElementById('no-results');
    const storesContainer = document.getElementById('stores-container');
    const itemsContainer = document.getElementById('items-container');

    // If elements don't exist (e.g., in test environment), skip rendering
    if (!noResults || !storesContainer || !itemsContainer) {
      return;
    }

    if (this.filteredData.length === 0) {
      noResults.classList.remove('hidden');
      storesContainer.innerHTML = '';
      itemsContainer.innerHTML = '';
      return;
    }

    noResults.classList.add('hidden');

    if (this.currentView === 'stores') {
      this.renderStoreView();
    } else {
      this.renderItemView();
    }
  }

  // Render store-based view
  renderStoreView() {
    const container = document.getElementById('stores-container');
    if (!container) return;
    const storeGroups = this.groupByStore(this.filteredData);

    let html = '';

    Object.keys(storeGroups).forEach(owner => {
      const transactions = storeGroups[owner];
      const firstTx = transactions[0];

      html += `
        <div class="store-card">
          <div class="store-header">
            <h2>${this.escapeHtml(owner)}</h2>
            <div class="store-meta">
              ${firstTx.stationType ? `<span class="station-type">${this.escapeHtml(firstTx.stationType)}</span>` : ''}
              ${firstTx.gps.name ? `<span class="gps-name">${this.escapeHtml(firstTx.gps.name)}</span>` : ''}
              <span class="coords">GPS: ${this.formatNumber(firstTx.gps.x)}, ${this.formatNumber(firstTx.gps.y)}, ${this.formatNumber(firstTx.gps.z)}</span>
            </div>
          </div>
          <div class="transactions-list">
            ${transactions.map(t => this.renderTransaction(t)).join('')}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // Render item-based view
  renderItemView() {
    const container = document.getElementById('items-container');
    if (!container) return;
    const itemGroups = this.groupByItem(this.filteredData);

    let html = '';

    Object.keys(itemGroups).forEach(itemName => {
      const transactions = itemGroups[itemName];
      const goodType = transactions[0].goodType;

      html += `
        <div class="item-card">
          <div class="item-header">
            <h2>${this.escapeHtml(itemName)}</h2>
            <span class="good-type-badge ${goodType.toLowerCase()}">${goodType}</span>
          </div>
          <div class="transactions-list">
            ${transactions.map(t => this.renderTransaction(t)).join('')}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // Render individual transaction
  renderTransaction(transaction) {
    const typeClass = transaction.transactionType;
    const typeLabel = transaction.transactionType === 'order' ? 'BUY ORDER' : 'SELL OFFER';
    const profitClass = transaction.profit > 0 ? 'profitable' : '';

    let profitHtml = '';
    if (transaction.profitDetails) {
      const details = transaction.profitDetails;
      profitHtml = `
        <div class="profit-info">
          <div class="profit-amount ${profitClass}">
            Profit: ${this.formatNumber(details.totalProfit)} credits
          </div>
          <div class="profit-details">
            <div><strong>Buy from:</strong> ${this.escapeHtml(details.fromStore)} @ ${this.formatNumber(details.buyPrice)}</div>
            <div><strong>Sell to:</strong> ${this.escapeHtml(details.toStore)} @ ${this.formatNumber(details.sellPrice)}</div>
            <div><strong>Profit/unit:</strong> ${this.formatNumber(details.profitPerUnit)}</div>
            <div><strong>Max quantity:</strong> ${this.formatNumber(details.availableQuantity)}</div>
            <div><strong>Distance:</strong> ${this.formatNumber(details.distance)} m</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="transaction-card ${typeClass} ${profitClass}">
        <div class="transaction-header">
          <span class="transaction-type ${typeClass}">${typeLabel}</span>
          <span class="good-name">${this.escapeHtml(transaction.goodName)}</span>
          <span class="good-type-badge ${transaction.goodType.toLowerCase()}">${transaction.goodType}</span>
        </div>
        <div class="transaction-body">
          <div class="transaction-info">
            <div class="info-row">
              <span class="label">Price:</span>
              <span class="value">${this.formatNumber(transaction.price)} cr</span>
            </div>
            <div class="info-row">
              <span class="label">Quantity:</span>
              <span class="value">${this.formatNumber(transaction.quantity)}</span>
            </div>
            <div class="info-row">
              <span class="label">Owner:</span>
              <span class="value">${this.escapeHtml(transaction.owner)}</span>
            </div>
            ${transaction.gpsString ? `
            <div class="info-row gps-row">
              <span class="label">GPS:</span>
              <span class="value gps-value" title="${this.escapeHtml(transaction.gpsString)}">${this.escapeHtml(transaction.gpsString.substring(0, 50))}${transaction.gpsString.length > 50 ? '...' : ''}</span>
            </div>
            ` : ''}
            ${this.getUserDistanceHtml(transaction)}
          </div>
          ${profitHtml}
        </div>
      </div>
    `;
  }

  // Get distance from user to transaction location
  getUserDistanceHtml(transaction) {
    if (!window.gpsManager || !window.gpsManager.hasGPS()) {
      return '';
    }

    const userGPS = window.gpsManager.getGPS();
    const distance = this.calculateDistance(userGPS, transaction.gps);

    if (distance === 0) return '';

    return `
      <div class="info-row user-distance-row">
        <span class="label">Distance from you:</span>
        <span class="value user-distance">${window.gpsManager.formatDistance(distance)}</span>
      </div>
    `;
  }

  // Group transactions by store (owner)
  groupByStore(transactions) {
    return transactions.reduce((groups, transaction) => {
      const owner = transaction.owner;
      if (!groups[owner]) {
        groups[owner] = [];
      }
      groups[owner].push(transaction);
      return groups;
    }, {});
  }

  // Group transactions by item
  groupByItem(transactions) {
    return transactions.reduce((groups, transaction) => {
      const itemName = transaction.goodName;
      if (!groups[itemName]) {
        groups[itemName] = [];
      }
      groups[itemName].push(transaction);
      return groups;
    }, {});
  }

  // Switch between views
  switchView(view) {
    this.currentView = view;

    // Update tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
      tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
      });
    }

    // Update view containers
    const storeView = document.getElementById('store-view');
    const itemView = document.getElementById('item-view');
    if (storeView) storeView.classList.toggle('active', view === 'stores');
    if (itemView) itemView.classList.toggle('active', view === 'items');

    this.render();
  }

  // Update last update timestamp
  updateLastUpdate() {
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      lastUpdate.textContent = `Last updated: ${timeString}`;
    }
  }

  // UI State Management
  showLoading() {
    const loading = document.getElementById('loading');
    const mainContent = document.getElementById('main-content');
    if (loading) loading.classList.remove('hidden');
    if (mainContent) mainContent.classList.add('hidden');
  }

  showMainContent() {
    const loading = document.getElementById('loading');
    const mainContent = document.getElementById('main-content');
    if (loading) loading.classList.add('hidden');
    if (mainContent) mainContent.classList.remove('hidden');
  }

  hideError() {
    const error = document.getElementById('error');
    if (error) error.classList.add('hidden');
  }

  showError(message) {
    const loading = document.getElementById('loading');
    const mainContent = document.getElementById('main-content');
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');

    if (loading) loading.classList.add('hidden');
    if (mainContent) mainContent.classList.add('hidden');
    if (error) error.classList.remove('hidden');
    if (errorMessage) errorMessage.textContent = message;
  }

  // Utility Functions
  formatNumber(num) {
    return new Intl.NumberFormat().format(Math.round(num));
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.tradeHouse = new SETradeHouse();
});
