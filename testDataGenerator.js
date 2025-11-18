// Test Data Generator for Trade Opportunities
// Creates synthetic buy/sell pairs on each planet for testing calculations

class TestDataGenerator {
  constructor() {
    this.testItem = 'Steel Plate';
    this.testItemType = 'Component';
  }

  // Generate test transactions with buy/sell on each planet
  async generateTestData() {
    // Wait for planet data to load
    if (!window.planetDataLoader || !window.planetDataLoader.isLoaded()) {
      console.error('Planet data not loaded');
      return [];
    }

    const planets = window.planetDataLoader.getPlanets();
    const transactions = [];
    let idCounter = 1;

    // Base prices for testing profit calculations
    const baseBuyPrice = 100; // Buy orders at 100 SC
    const baseSellPrice = 80;  // Sell offers at 80 SC (20 SC profit margin)

    // GUARANTEED PROFIT TRADES - Always at fixed locations
    if (planets.length > 0) {
      // Super cheap seller at 10 SC on first planet
      transactions.push({
        id: idCounter++,
        goodName: this.testItem,
        goodType: this.testItemType,
        transactionType: 'offer',
        price: 10, // VERY CHEAP - 90+ SC profit with most buyers
        quantity: 10000,
        owner: 'Bargain Basement',
        stationType: 'Clearance Station',
        gps: {
          name: `${planets[0].name} Bargain Station`,
          x: planets[0].x + 500,
          y: planets[0].y + 500,
          z: planets[0].z + 500
        },
        profit: 0,
        profitDetails: null
      });
    }

    if (planets.length > 1) {
      // Super high buyer at 1000 SC on second planet
      transactions.push({
        id: idCounter++,
        goodName: this.testItem,
        goodType: this.testItemType,
        transactionType: 'order',
        price: 1000, // VERY HIGH - 900+ SC profit with most sellers
        quantity: 10000,
        owner: 'Elite Buyer',
        stationType: 'Premium Trading Hub',
        gps: {
          name: `${planets[1].name} Elite Station`,
          x: planets[1].x + 500,
          y: planets[1].y + 500,
          z: planets[1].z + 500
        },
        profit: 0,
        profitDetails: null
      });
    }

    planets.forEach((planet, index) => {
      // Create a BUY ORDER on this planet
      transactions.push({
        id: idCounter++,
        goodName: this.testItem,
        goodType: this.testItemType,
        transactionType: 'order', // Buy order
        price: baseBuyPrice + (index * 5), // Vary price slightly: 100, 105, 110, etc.
        quantity: 1000 + (index * 100), // Vary quantity: 1000, 1100, 1200, etc.
        owner: `Test Buyer ${index + 1}`,
        stationType: 'Trading Station',
        gps: {
          name: `${planet.name} Buyer Station`,
          x: planet.x + 1000, // Offset slightly from planet center
          y: planet.y + 1000,
          z: planet.z + 1000
        },
        profit: 0,
        profitDetails: null
      });

      // Create a SELL OFFER on this planet
      transactions.push({
        id: idCounter++,
        goodName: this.testItem,
        goodType: this.testItemType,
        transactionType: 'offer', // Sell offer
        price: baseSellPrice - (index * 2), // Vary price slightly: 80, 78, 76, etc. (better deals on later planets)
        quantity: 800 + (index * 50), // Vary quantity: 800, 850, 900, etc.
        owner: `Test Seller ${index + 1}`,
        stationType: 'Mining Outpost',
        gps: {
          name: `${planet.name} Seller Station`,
          x: planet.x - 1000, // Offset on opposite side
          y: planet.y - 1000,
          z: planet.z - 1000
        },
        profit: 0,
        profitDetails: null
      });
    });

    // Add some cross-planet profitable trades
    // Create a high-paying buyer on planet 1
    if (planets.length > 0) {
      transactions.push({
        id: idCounter++,
        goodName: this.testItem,
        goodType: this.testItemType,
        transactionType: 'order',
        price: 150, // High price - profitable with any seller
        quantity: 5000,
        owner: 'Premium Buyer',
        stationType: 'Luxury Station',
        gps: {
          name: `${planets[0].name} Premium Station`,
          x: planets[0].x + 5000,
          y: planets[0].y + 5000,
          z: planets[0].z + 5000
        },
        profit: 0,
        profitDetails: null
      });
    }

    // Create a cheap seller on the last planet
    if (planets.length > 1) {
      const lastPlanet = planets[planets.length - 1];
      transactions.push({
        id: idCounter++,
        goodName: this.testItem,
        goodType: this.testItemType,
        transactionType: 'offer',
        price: 50, // Very cheap - profitable with any buyer
        quantity: 3000,
        owner: 'Discount Seller',
        stationType: 'Clearance Depot',
        gps: {
          name: `${lastPlanet.name} Discount Station`,
          x: lastPlanet.x - 5000,
          y: lastPlanet.y - 5000,
          z: lastPlanet.z - 5000
        },
        profit: 0,
        profitDetails: null
      });
    }

    // Add variety - different items on some planets
    if (planets.length > 2) {
      transactions.push({
        id: idCounter++,
        goodName: 'Iron Ore',
        goodType: 'Ore',
        transactionType: 'order',
        price: 200,
        quantity: 10000,
        owner: 'Ore Buyer',
        stationType: 'Refinery',
        gps: {
          name: `${planets[2].name} Refinery`,
          x: planets[2].x,
          y: planets[2].y + 2000,
          z: planets[2].z
        },
        profit: 0,
        profitDetails: null
      });

      transactions.push({
        id: idCounter++,
        goodName: 'Iron Ore',
        goodType: 'Ore',
        transactionType: 'offer',
        price: 150,
        quantity: 8000,
        owner: 'Ore Seller',
        stationType: 'Mining Station',
        gps: {
          name: `${planets[2].name} Mine`,
          x: planets[2].x,
          y: planets[2].y - 2000,
          z: planets[2].z
        },
        profit: 0,
        profitDetails: null
      });
    }

    console.log(`Generated ${transactions.length} test transactions across ${planets.length} planets`);
    return transactions;
  }

  // Generate info about the test data for display
  getTestDataInfo() {
    if (!window.planetDataLoader || !window.planetDataLoader.isLoaded()) {
      return 'Planet data not loaded';
    }

    const planets = window.planetDataLoader.getPlanets();
    return `
Test Data Generated:
- ${planets.length} planets loaded
- 2 transactions per planet (1 buy order, 1 sell offer)
- All for "${this.testItem}" (${this.testItemType})

GUARANTEED PROFIT TRADES (always present):
✓ "Bargain Basement" @ ${planets[0]?.name || 'Planet 1'} - SELLS at 10 SC
✓ "Elite Buyer" @ ${planets[1]?.name || 'Planet 2'} - BUYS at 1000 SC
  → PROFIT: 990 SC per unit (buy from Bargain, sell to Elite)

Regular Test Trades:
- Buy orders: 100-${100 + (planets.length - 1) * 5} SC (varying prices)
- Sell offers: 80-${80 - (planets.length - 1) * 2} SC (varying prices)
- Profit margin: 20+ SC per unit on most pairs
- Additional premium buyer (150 SC) and discount seller (50 SC)
- 2 Iron Ore transactions for variety

Expected Results:
✓ Planet filter: Only shows transactions within 100km of selected planet
✓ Buy-focused mode: Shows buy orders with all matching sell offers
✓ Sell-focused mode: Shows sell offers with all matching buy orders
✓ Distance calculations: Updates based on user GPS if set
✓ BEST PROFIT: Elite Buyer (1000) - Bargain Basement (10) = 990 SC profit
    `.trim();
  }
}

// Global instance
window.testDataGenerator = new TestDataGenerator();
