// Configuration for SE TradeHouse Standalone
const CONFIG = {
  // Your Google Sheet ID (from the URL)
  // https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
  GOOGLE_SHEET_ID: '1eIeDFgJ4f9QSBrwdJNGstZcka4La9Ixqxvipvumum40',

  // Sheet GID (the number after gid= in your URL, default is 0 for first sheet)
  SHEET_GID: '0',

  // Planets Sheet GID (Sheet 4 - contains planet data: Name, X, Y, Z, Gravity)
  // You can find this by going to Sheet 4 and looking at the URL: gid=XXXXXXX
  PLANETS_SHEET_GID: '3', // Default, may need to be updated

  // Access mode: 'csv' (no API key needed) or 'api' (requires API key below)
  ACCESS_MODE: 'csv',

  // Google API Key (only needed if ACCESS_MODE is 'api')
  // Get from: https://console.cloud.google.com/
  GOOGLE_API_KEY: '',

  // Sheet name (only used if ACCESS_MODE is 'api')
  SHEET_NAME: 'Sheet1',

  // Good types for filtering
  GOOD_TYPES: ['Ore', 'Ingot', 'Component', 'Tool', 'Ammo', 'Bottle', 'Consumable'],

  // Transaction types mapping
  TRANSACTION_TYPES: {
    ORDER: 'order',  // Buy orders
    OFFER: 'offer'   // Sell offers
  },

  // UI Settings
  UI: {
    DEFAULT_SORT: 'profit',
    DEFAULT_FILTER: 'all',
    MIN_PROFIT_DISPLAY: 0,
    REFRESH_INTERVAL: 300000 // 5 minutes in milliseconds
  }
};
