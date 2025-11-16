# SE TradeHouse - Standalone Edition

**Live Demo:** https://mrdatawolf.github.io/SE_TradeHouse_StandAlone/

A complete standalone web application for Space Engineers - trade data analysis, system maps, and ship calculators. No backend required - pure JavaScript with Google Sheets integration.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![No API Key Required](https://img.shields.io/badge/API%20Key-Not%20Required-brightgreen)

---

## 🚀 Features

### 💰 Trade Data & Profit Calculator
- Automatically finds profit opportunities between trading stations
- Full Space Engineers item parsing (`MyObjectBuilder_` format)
- Advanced filtering (Ore, Ingot, Component, Tool, Ammo, Bottle, Consumable)
- Show only buy orders, sell offers, or profitable trades
- Search by item name, owner, or station
- Sort by profit, price, quantity, or name
- Store View and Item View modes
- Real-time statistics dashboard

### 🗺️ System Maps
- **2D Map**: Interactive CSS-based solar system with animated orbits
- **3D Map**: Full Three.js 3D visualization with orbit controls
- Click planets for detailed information
- Accurate GPS coordinate positioning
- Star glow effects and realistic rendering

### 🧮 Thrust Calculator
- Calculate thruster requirements for any ship
- Supports all thruster types: Ion, Atmospheric, Hydrogen, Plasma
- Small and Large grid support
- Planet gravity and atmosphere effects
- Additional thruster configuration
- Power reactor calculations (Small, Large, Naquadah)
- Time-to-speed calculations

### 🧪 Test Suites
- **Parsing Tests**: Verify MyObjectBuilder format parsing
- **Unit Tests**: 60+ tests with beautiful GUI test runner
- All filtering, sorting, and profit calculation tests

---

## 🎯 Quick Start

### For Users (Just Visit the Site)

Simply visit: **[Your GitHub Pages URL]**

That's it! No installation, no setup. The app automatically loads current trade data.

### For Developers (Running Locally)

1. **Clone this repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

2. **Start a local server:**
   ```bash
   # Python
   python server.py
   # Or double-click server.bat on Windows
   ```

3. **Open browser to:**
   ```
   http://localhost:8000
   ```

---

## 📊 Data Source

Trade data is pulled from a public Google Sheet in real-time:
- **Sheet ID:** `1eIeDFgJ4f9QSBrwdJNGstZcka4La9Ixqxvipvumum40`
- **Format:** CSV export (no API key needed)
- **Updates:** Automatic on each page load/refresh

### Data Structure

The Google Sheet contains:
- **Item** - Item name/type
- **Type** - Good category (Ore, Ingot, Component, etc.)
- **Quantity** - Amount available
- **Price** - Price per unit
- **Order or Offer** - "Order" for buy orders, "Offer" for sell offers
- **Owner** - Trading station owner
- **Station Type** - Type of station
- **GPS** - Space Engineers GPS coordinates
- **Unique ID** - Transaction identifier
- **Last Update** - Timestamp

---

## 🛠️ Technology Stack

- **Frontend:** Vanilla JavaScript (ES6+)
- **Styling:** Custom CSS with CSS Variables
- **Data Source:** Google Sheets (CSV export)
- **Hosting:** GitHub Pages
- **No Dependencies:** Zero external libraries or frameworks

---

## 🎮 How It Works

### Profit Calculation

For each transaction, the app:

1. **For Buy Orders:**
   - Finds all matching sell offers
   - Identifies the cheapest one
   - Calculates: `(buyPrice - sellPrice) × quantity`

2. **For Sell Offers:**
   - Finds all matching buy orders
   - Identifies the highest one
   - Calculates: `(buyPrice - sellPrice) × quantity`

3. **Distance:**
   - Uses GPS coordinates to calculate 3D distance
   - Shows travel distance between stations

### Example

**Scenario:**
- Station A: Order to buy Steel Plate @ 300 credits (qty: 500)
- Station B: Offer to sell Steel Plate @ 250 credits (qty: 1000)

**Result:**
- **Profit:** 25,000 credits (50 per unit × 500 units)
- **Action:** Buy from Station B, sell to Station A
- **Distance:** 15,234 meters

---

## 📝 Configuration

### config.js

```javascript
const CONFIG = {
  // Google Sheet ID (from the URL)
  GOOGLE_SHEET_ID: '1eIeDFgJ4f9QSBrwdJNGstZcka4La9Ixqxvipvumum40',

  // Sheet GID (0 = first tab)
  SHEET_GID: '0',

  // Access mode: 'csv' (no API key) or 'api' (requires key)
  ACCESS_MODE: 'csv',

  // Good types for filtering
  GOOD_TYPES: ['Ore', 'Ingot', 'Component', 'Tool', 'Ammo', 'Bottle'],

  // UI Settings
  UI: {
    DEFAULT_SORT: 'profit',
    DEFAULT_FILTER: 'all',
    MIN_PROFIT_DISPLAY: 0,
    REFRESH_INTERVAL: 300000 // 5 minutes
  }
};
```

### Using Your Own Google Sheet

1. Create a Google Sheet with the required columns (see Data Structure above)
2. Make it public: Share → "Anyone with the link can view"
3. Get the Sheet ID from the URL
4. Update `GOOGLE_SHEET_ID` in config.js
5. Update `SHEET_GID` if using a different tab (0 = first tab)

---

## 🚀 Deployment

### GitHub Pages (Recommended)

See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) for detailed instructions.

**Quick version:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Then enable GitHub Pages in repository settings.

### Other Hosting Options

- **Netlify:** Drag the folder to netlify.com/drop
- **Vercel:** Import repository on vercel.com
- **Cloudflare Pages:** Deploy via GitHub integration
- **Any Static Host:** Upload all files to any web server

---

## 📖 Documentation

- **[GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)** - Deploy to GitHub Pages
- **[NO_API_KEY_SETUP.md](NO_API_KEY_SETUP.md)** - How CSV mode works
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** - Detailed setup guide

---

## 🤝 Contributing

Want to improve the app? Contributions welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🎮 For Space Engineers Players

This tool is designed for Space Engineers multiplayer servers with an in-game economy. It helps players:

- Find the best trade routes
- Maximize profits
- Track market prices
- Discover arbitrage opportunities
- Navigate the in-game economy efficiently

### Usage Tips

1. **Filter by "Profitable Only"** to see immediate money-making opportunities
2. **Sort by "Best Profit"** to prioritize high-value trades
3. **Check distance** before committing to a trade route
4. **Use search** to track specific items you need
5. **Bookmark the page** for quick access during gameplay

---

## 🙏 Credits

Based on the original SE TradeHouse Laravel application, simplified for standalone deployment.

Built with ❤️ for the Space Engineers community.

---

## 📞 Support

Having issues? Check the troubleshooting guide or open an issue on GitHub.

**Happy Trading!** 🚀
