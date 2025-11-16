// Mock test data for SE TradeHouse tests
const MOCK_DATA = {
  // Sample transactions with various types to test filtering and sorting
  transactions: [
    // Ingots - with profit opportunity
    {
      id: '1',
      goodName: 'Uranium',
      goodType: 'Ingot',
      quantity: 1000,
      price: 350,
      transactionType: 'offer', // selling
      owner: 'PlayerOne',
      stationType: 'Trading Post',
      gps: { x: 1000, y: 2000, z: 3000, name: 'Player One Station' },
      gpsString: 'GPS:Player One Station:1000:2000:3000:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },
    {
      id: '2',
      goodName: 'Uranium',
      goodType: 'Ingot',
      quantity: 500,
      price: 500,
      transactionType: 'order', // buying
      owner: 'PlayerTwo',
      stationType: 'Station',
      gps: { x: 5000, y: 6000, z: 7000, name: 'Player Two Base' },
      gpsString: 'GPS:Player Two Base:5000:6000:7000:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },
    {
      id: '3',
      goodName: 'Steel',
      goodType: 'Ingot',
      quantity: 5000,
      price: 25,
      transactionType: 'offer',
      owner: 'Station1',
      stationType: 'Trading Post',
      gps: { x: -1000, y: 0, z: 1000, name: 'Trade Hub Alpha' },
      gpsString: 'GPS:Trade Hub Alpha:-1000:0:1000:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },
    {
      id: '4',
      goodName: 'Steel',
      goodType: 'Ingot',
      quantity: 3000,
      price: 30,
      transactionType: 'order',
      owner: 'Station2',
      stationType: 'Station',
      gps: { x: 2000, y: 3000, z: 4000, name: 'Mining Colony' },
      gpsString: 'GPS:Mining Colony:2000:3000:4000:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },

    // Ores
    {
      id: '5',
      goodName: 'Iron',
      goodType: 'Ore',
      quantity: 10000,
      price: 5,
      transactionType: 'offer',
      owner: 'MiningCorp',
      stationType: 'Mining Station',
      gps: { x: 100, y: 200, z: 300, name: 'Mining Outpost' },
      gpsString: 'GPS:Mining Outpost:100:200:300:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },
    {
      id: '6',
      goodName: 'Gold',
      goodType: 'Ore',
      quantity: 2000,
      price: 50,
      transactionType: 'order',
      owner: 'TechCorp',
      stationType: 'Research Station',
      gps: { x: 8000, y: 9000, z: 10000, name: 'Research Lab' },
      gpsString: 'GPS:Research Lab:8000:9000:10000:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },

    // Components
    {
      id: '7',
      goodName: 'SteelPlate',
      goodType: 'Component',
      quantity: 2000,
      price: 15,
      transactionType: 'offer',
      owner: 'Builder1',
      stationType: 'Station',
      gps: { x: 3000, y: 4000, z: 5000, name: 'Builder Base' },
      gpsString: 'GPS:Builder Base:3000:4000:5000:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },
    {
      id: '8',
      goodName: 'SteelPlate',
      goodType: 'Component',
      quantity: 1000,
      price: 20,
      transactionType: 'order',
      owner: 'Shipyard',
      stationType: 'Shipyard',
      gps: { x: 6000, y: 7000, z: 8000, name: 'Orbital Shipyard' },
      gpsString: 'GPS:Orbital Shipyard:6000:7000:8000:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },

    // Tools
    {
      id: '9',
      goodName: 'Welder',
      goodType: 'Tool',
      quantity: 50,
      price: 100,
      transactionType: 'offer',
      owner: 'ToolShop',
      stationType: 'Trading Post',
      gps: { x: 1500, y: 2500, z: 3500, name: 'Tool Trader' },
      gpsString: 'GPS:Tool Trader:1500:2500:3500:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },
    {
      id: '10',
      goodName: 'AngleGrinder',
      goodType: 'Tool',
      quantity: 30,
      price: 150,
      transactionType: 'order',
      owner: 'Mechanic',
      stationType: 'Station',
      gps: { x: 4000, y: 5000, z: 6000, name: 'Repair Station' },
      gpsString: 'GPS:Repair Station:4000:5000:6000:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },

    // Ammo
    {
      id: '11',
      goodName: 'NATO_5p56x45mmNATOMagazine',
      goodType: 'Ammo',
      quantity: 500,
      price: 10,
      transactionType: 'offer',
      owner: 'ArmsMerchant',
      stationType: 'Trading Post',
      gps: { x: 2500, y: 3500, z: 4500, name: 'Arms Dealer' },
      gpsString: 'GPS:Arms Dealer:2500:3500:4500:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },
    {
      id: '12',
      goodName: 'NATO_25x184mm',
      goodType: 'Ammo',
      quantity: 200,
      price: 75,
      transactionType: 'order',
      owner: 'Military',
      stationType: 'Military Base',
      gps: { x: 7000, y: 8000, z: 9000, name: 'Military Outpost' },
      gpsString: 'GPS:Military Outpost:7000:8000:9000:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },

    // Bottles
    {
      id: '13',
      goodName: 'OxygenBottle',
      goodType: 'Bottle',
      quantity: 100,
      price: 20,
      transactionType: 'offer',
      owner: 'GasStation',
      stationType: 'Trading Post',
      gps: { x: 3500, y: 4500, z: 5500, name: 'Gas Refill' },
      gpsString: 'GPS:Gas Refill:3500:4500:5500:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },
    {
      id: '14',
      goodName: 'HydrogenBottle',
      goodType: 'Bottle',
      quantity: 150,
      price: 25,
      transactionType: 'order',
      owner: 'Explorer',
      stationType: 'Station',
      gps: { x: 9000, y: 10000, z: 11000, name: 'Explorer Base' },
      gpsString: 'GPS:Explorer Base:9000:10000:11000:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },

    // Consumables
    {
      id: '15',
      goodName: 'InsectMeatRaw',
      goodType: 'Consumable',
      quantity: 500,
      price: 5,
      transactionType: 'offer',
      owner: 'FoodSupplier',
      stationType: 'Trading Post',
      gps: { x: 4500, y: 5500, z: 6500, name: 'Food Market' },
      gpsString: 'GPS:Food Market:4500:5500:6500:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    },
    {
      id: '16',
      goodName: 'InsectMeatRaw',
      goodType: 'Consumable',
      quantity: 300,
      price: 8,
      transactionType: 'order',
      owner: 'Restaurant',
      stationType: 'Station',
      gps: { x: 5500, y: 6500, z: 7500, name: 'Space Diner' },
      gpsString: 'GPS:Space Diner:5500:6500:7500:',
      lastUpdate: '2025-01-15',
      profit: 0,
      profitDetails: null
    }
  ],

  // CSV data for testing parseTransactions
  csvData: [
    ['Item', 'Type', 'Quantity', 'Price', 'Order or Offer', 'Owner', 'Station Type', 'GPS', 'Unique ID', 'Last Update'],
    ['MyObjectBuilder_Ingot/Uranium', 'Ingot', '1000', '350', 'Offer', 'PlayerOne', 'Trading Post', 'GPS:Player One Station:1000:2000:3000:', '1', '2025-01-15'],
    ['MyObjectBuilder_Ingot/Uranium', 'Ingot', '500', '500', 'Order', 'PlayerTwo', 'Station', 'GPS:Player Two Base:5000:6000:7000:', '2', '2025-01-15'],
    ['MyObjectBuilder_Component/SteelPlate', 'Component', '2000', '15', 'Offer', 'Builder1', 'Station', 'GPS:Builder Base:3000:4000:5000:', '7', '2025-01-15'],
    ['MyObjectBuilder_ConsumableItem/InsectMeatRaw', 'Consumable', '500', '5', 'Offer', 'FoodSupplier', 'Trading Post', 'GPS:Food Market:4500:5500:6500:', '15', '2025-01-15']
  ]
};
