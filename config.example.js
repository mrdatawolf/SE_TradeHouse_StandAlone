// Configuration for SE TradeHouse Standalone
const CONFIG = {
  // Your Google Sheet ID (from the URL)
  // https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
  GOOGLE_SHEET_ID: 'YOUR_SHEET_ID_HERE',

  // Sheet GID (the number after gid= in your URL, default is 0 for first sheet)
  SHEET_GID: '0',

  // Access mode: 'csv' (no API key needed) or 'api' (requires API key below)
  // CSV mode: Fast, no auth needed, but sheet must be public
  // API mode: Can access private sheets, requires Google API key
  ACCESS_MODE: 'csv',

  // Google API Key (only needed if ACCESS_MODE is 'api')
  // Get from: https://console.cloud.google.com/
  GOOGLE_API_KEY: '',

  // Sheet name (only used if ACCESS_MODE is 'api')
  SHEET_NAME: 'Sheet1',

  // Good types for filtering
  GOOD_TYPES: ['Ore', 'Ingot', 'Component', 'Tool', 'Ammo', 'Bottle'],

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
