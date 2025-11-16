// Unit tests for SE TradeHouse
class TestRunner {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  describe(suiteName, testFn) {
    const suite = {
      name: suiteName,
      tests: []
    };

    const it = (testName, fn) => {
      suite.tests.push({ name: testName, fn });
    };

    testFn(it);
    this.tests.push(suite);
  }

  async run() {
    this.results = { passed: 0, failed: 0, total: 0, suites: [] };

    for (const suite of this.tests) {
      const suiteResult = {
        name: suite.name,
        tests: []
      };

      for (const test of suite.tests) {
        this.results.total++;
        try {
          await test.fn();
          this.results.passed++;
          suiteResult.tests.push({
            name: test.name,
            passed: true,
            error: null
          });
        } catch (error) {
          this.results.failed++;
          suiteResult.tests.push({
            name: test.name,
            passed: false,
            error: error.message
          });
        }
      }

      this.results.suites.push(suiteResult);
    }

    return this.results;
  }
}

// Assertion helpers
function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toBeGreaterThan(expected) {
      if (actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toContain(expected) {
      if (!actual.includes(expected)) {
        throw new Error(`Expected array to contain ${JSON.stringify(expected)}`);
      }
    },
    toHaveLength(expected) {
      if (actual.length !== expected) {
        throw new Error(`Expected length ${expected} but got ${actual.length}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected ${actual} to be truthy`);
      }
    }
  };
}

// Initialize test runner
const runner = new TestRunner();

// Test Suite: Item Parsing
runner.describe('Item Parsing', (it) => {
  it('should parse MyObjectBuilder_Ingot/Uranium correctly', () => {
    const app = new SETradeHouse();
    const result = app.parseItemNameAndType('MyObjectBuilder_Ingot/Uranium', '');
    expect(result.name).toBe('Uranium');
    expect(result.type).toBe('Ingot');
  });

  it('should parse MyObjectBuilder_Ore/Iron correctly', () => {
    const app = new SETradeHouse();
    const result = app.parseItemNameAndType('MyObjectBuilder_Ore/Iron', '');
    expect(result.name).toBe('Iron');
    expect(result.type).toBe('Ore');
  });

  it('should parse MyObjectBuilder_Component/SteelPlate correctly', () => {
    const app = new SETradeHouse();
    const result = app.parseItemNameAndType('MyObjectBuilder_Component/SteelPlate', '');
    expect(result.name).toBe('SteelPlate');
    expect(result.type).toBe('Component');
  });

  it('should parse MyObjectBuilder_ConsumableItem correctly', () => {
    const app = new SETradeHouse();
    const result = app.parseItemNameAndType('MyObjectBuilder_ConsumableItem/InsectMeatRaw', '');
    expect(result.name).toBe('InsectMeatRaw');
    expect(result.type).toBe('Consumable');
  });

  it('should identify tools correctly', () => {
    const app = new SETradeHouse();
    const result = app.parseItemNameAndType('MyObjectBuilder_PhysicalGunObject/AutomaticRifleItem', '');
    expect(result.name).toBe('AutomaticRifle');
    expect(result.type).toBe('Tool');
  });

  it('should fallback to plain format', () => {
    const app = new SETradeHouse();
    const result = app.parseItemNameAndType('Steel', 'Ingot');
    expect(result.name).toBe('Steel');
    expect(result.type).toBe('Ingot');
  });
});

// Test Suite: Good Type Filtering
runner.describe('Good Type Filtering', (it) => {
  it('should filter by Ore type', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.goodType = 'Ore';
    app.applyFiltersAndRender();

    const oreItems = app.filteredData.filter(t => t.goodType === 'Ore');
    expect(oreItems.length).toBe(app.filteredData.length);
    expect(app.filteredData.length).toBe(2);
  });

  it('should filter by Ingot type', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.goodType = 'Ingot';
    app.applyFiltersAndRender();

    const ingotItems = app.filteredData.filter(t => t.goodType === 'Ingot');
    expect(ingotItems.length).toBe(app.filteredData.length);
    expect(app.filteredData.length).toBe(4);
  });

  it('should filter by Component type', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.goodType = 'Component';
    app.applyFiltersAndRender();

    expect(app.filteredData.length).toBe(2);
  });

  it('should filter by Tool type', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.goodType = 'Tool';
    app.applyFiltersAndRender();

    expect(app.filteredData.length).toBe(2);
  });

  it('should filter by Ammo type', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.goodType = 'Ammo';
    app.applyFiltersAndRender();

    expect(app.filteredData.length).toBe(2);
  });

  it('should filter by Bottle type', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.goodType = 'Bottle';
    app.applyFiltersAndRender();

    expect(app.filteredData.length).toBe(2);
  });

  it('should filter by Consumable type', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.goodType = 'Consumable';
    app.applyFiltersAndRender();

    expect(app.filteredData.length).toBe(2);
  });

  it('should show all types when filter is "all"', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.goodType = 'all';
    app.applyFiltersAndRender();

    expect(app.filteredData.length).toBe(16);
  });
});

// Test Suite: Transaction Type Filtering
runner.describe('Transaction Type Filtering', (it) => {
  it('should filter buy orders only', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.transactionType = 'buy';
    app.applyFiltersAndRender();

    const buyOrders = app.filteredData.filter(t => t.transactionType === 'order');
    expect(buyOrders.length).toBe(app.filteredData.length);
    expect(app.filteredData.length).toBe(8);
  });

  it('should filter sell offers only', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.transactionType = 'sell';
    app.applyFiltersAndRender();

    const sellOffers = app.filteredData.filter(t => t.transactionType === 'offer');
    expect(sellOffers.length).toBe(app.filteredData.length);
    expect(app.filteredData.length).toBe(8);
  });

  it('should filter profitable transactions only', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.calculateProfits();
    app.filters.transactionType = 'profitable';
    app.applyFiltersAndRender();

    const profitable = app.filteredData.filter(t => t.profit > 0);
    expect(profitable.length).toBe(app.filteredData.length);
  });

  it('should show all transactions when filter is "all"', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.transactionType = 'all';
    app.applyFiltersAndRender();

    expect(app.filteredData.length).toBe(16);
  });
});

// Test Suite: Search Filtering
runner.describe('Search Filtering', (it) => {
  it('should search by item name', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.search = 'uranium';
    app.applyFiltersAndRender();

    expect(app.filteredData.length).toBe(2);
    expect(app.filteredData[0].goodName).toBe('Uranium');
  });

  it('should search by owner name', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.search = 'playerone';
    app.applyFiltersAndRender();

    expect(app.filteredData.length).toBe(1);
    expect(app.filteredData[0].owner).toBe('PlayerOne');
  });

  it('should search by GPS name', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.search = 'trade hub';
    app.applyFiltersAndRender();

    expect(app.filteredData.length).toBe(1);
    expect(app.filteredData[0].gps.name).toBe('Trade Hub Alpha');
  });

  it('should return all when search is empty', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.search = '';
    app.applyFiltersAndRender();

    expect(app.filteredData.length).toBe(16);
  });
});

// Test Suite: Sorting
runner.describe('Sorting', (it) => {
  it('should sort by profit (descending)', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.calculateProfits();
    app.filters.sortBy = 'profit';
    app.applyFiltersAndRender();

    // Check that profits are in descending order
    for (let i = 1; i < app.filteredData.length; i++) {
      expect(app.filteredData[i-1].profit >= app.filteredData[i].profit).toBeTruthy();
    }
  });

  it('should sort by price ascending', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.sortBy = 'price-asc';
    app.applyFiltersAndRender();

    for (let i = 1; i < app.filteredData.length; i++) {
      expect(app.filteredData[i-1].price <= app.filteredData[i].price).toBeTruthy();
    }
  });

  it('should sort by price descending', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.sortBy = 'price-desc';
    app.applyFiltersAndRender();

    for (let i = 1; i < app.filteredData.length; i++) {
      expect(app.filteredData[i-1].price >= app.filteredData[i].price).toBeTruthy();
    }
  });

  it('should sort by quantity (descending)', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.sortBy = 'quantity';
    app.applyFiltersAndRender();

    for (let i = 1; i < app.filteredData.length; i++) {
      expect(app.filteredData[i-1].quantity >= app.filteredData[i].quantity).toBeTruthy();
    }
  });

  it('should sort by item name alphabetically', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.sortBy = 'item';
    app.applyFiltersAndRender();

    for (let i = 1; i < app.filteredData.length; i++) {
      expect(app.filteredData[i-1].goodName.localeCompare(app.filteredData[i].goodName) <= 0).toBeTruthy();
    }
  });

  it('should sort by store name alphabetically', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.filters.sortBy = 'store';
    app.applyFiltersAndRender();

    for (let i = 1; i < app.filteredData.length; i++) {
      const store1 = app.getStoreName(app.filteredData[i-1]);
      const store2 = app.getStoreName(app.filteredData[i]);
      expect(store1.localeCompare(store2) <= 0).toBeTruthy();
    }
  });
});

// Test Suite: Profit Calculation
runner.describe('Profit Calculation', (it) => {
  it('should calculate profit for matching buy/sell pairs', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.calculateProfits();

    // Find Uranium offer (id: 1) - selling at 350
    const uraniumOffer = app.transactions.find(t => t.id === '1');
    expect(uraniumOffer).toBeTruthy();

    // Should find profit opportunity with Uranium order (id: 2) - buying at 500
    expect(uraniumOffer.profit).toBeGreaterThan(0);
    expect(uraniumOffer.profitDetails).toBeTruthy();
    expect(uraniumOffer.profitDetails.profitPerUnit).toBe(150); // 500 - 350
  });

  it('should calculate profit for Steel transactions', () => {
    const app = new SETradeHouse();
    app.transactions = JSON.parse(JSON.stringify(MOCK_DATA.transactions));
    app.calculateProfits();

    // Steel offer at 25, order at 30
    const steelOffer = app.transactions.find(t => t.id === '3');
    expect(steelOffer.profit).toBeGreaterThan(0);
    expect(steelOffer.profitDetails.profitPerUnit).toBe(5); // 30 - 25
  });

  it('should not calculate profit for same owner', () => {
    const app = new SETradeHouse();
    // Add two transactions from same owner
    app.transactions = [
      {
        id: '100',
        goodName: 'TestItem',
        goodType: 'Ingot',
        quantity: 100,
        price: 10,
        transactionType: 'offer',
        owner: 'SameOwner',
        gps: { x: 0, y: 0, z: 0, name: 'Base1' },
        profit: 0,
        profitDetails: null
      },
      {
        id: '101',
        goodName: 'TestItem',
        goodType: 'Ingot',
        quantity: 100,
        price: 20,
        transactionType: 'order',
        owner: 'SameOwner',
        gps: { x: 100, y: 100, z: 100, name: 'Base2' },
        profit: 0,
        profitDetails: null
      }
    ];
    app.calculateProfits();

    expect(app.transactions[0].profit).toBe(0);
    expect(app.transactions[0].profitDetails).toBe(null);
  });

  it('should calculate distance between GPS coordinates', () => {
    const app = new SETradeHouse();
    const gps1 = { x: 0, y: 0, z: 0, name: 'Start' };
    const gps2 = { x: 3, y: 4, z: 0, name: 'End' };

    const distance = app.calculateDistance(gps1, gps2);
    expect(distance).toBe(5); // 3-4-5 triangle
  });
});

// Test Suite: CSV Parsing
runner.describe('CSV Parsing', (it) => {
  it('should parse CSV with MyObjectBuilder format', () => {
    const app = new SETradeHouse();
    const data = MOCK_DATA.csvData;
    const transactions = app.parseTransactions(data);

    expect(transactions.length).toBe(4);
    expect(transactions[0].goodName).toBe('Uranium');
    expect(transactions[0].goodType).toBe('Ingot');
  });

  it('should parse GPS coordinates from CSV', () => {
    const app = new SETradeHouse();
    const data = MOCK_DATA.csvData;
    const transactions = app.parseTransactions(data);

    expect(transactions[0].gps.name).toBe('Player One Station');
    expect(transactions[0].gps.x).toBe(1000);
    expect(transactions[0].gps.y).toBe(2000);
    expect(transactions[0].gps.z).toBe(3000);
  });

  it('should parse transaction types correctly', () => {
    const app = new SETradeHouse();
    const data = MOCK_DATA.csvData;
    const transactions = app.parseTransactions(data);

    expect(transactions[0].transactionType).toBe('offer');
    expect(transactions[1].transactionType).toBe('order');
  });
});
