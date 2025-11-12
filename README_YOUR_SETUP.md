# Your SE TradeHouse Standalone App - Ready to Use!

## What I've Built For You

I've created a simplified, standalone JavaScript version of your SE TradeHouse system that works directly with your existing Google Sheet!

**Your Google Sheet:** https://docs.google.com/spreadsheets/d/1eIeDFgJ4f9QSBrwdJNGstZcka4La9Ixqxvipvumum40/edit

---

## What's Already Configured

✅ **Sheet ID is set** - Your Google Sheet is already linked in `config.js`

✅ **Data structure mapped** - The app understands your column structure:
- Item, Type, Quantity, Price, Order or Offer, Owner, Station Type, GPS, Unique ID, Last Update

✅ **GPS parsing** - Handles Space Engineers GPS format: `GPS:Name:X:Y:Z:`

✅ **Profit calculator** - Same logic as your Laravel system:
- Finds cheapest offers for buy orders
- Finds highest orders for sell offers
- Calculates distances between stations
- Shows profit per unit and total profit

---

## What You Need to Do (5 minutes)

### Only One Thing: Get a Google API Key

1. Go to https://console.cloud.google.com/
2. Create/select a project
3. Enable "Google Sheets API"
4. Create credentials → API Key
5. Copy the API key

### Then Update config.js

Open `config.js` and replace:
```javascript
GOOGLE_API_KEY: 'YOUR_API_KEY_HERE',
```

With your actual API key:
```javascript
GOOGLE_API_KEY: 'AIzaSy...your-key-here',
```

### That's It!

Open `index.html` in your browser and it will load your trade data!

---

## Features You Get

### 📊 Automatic Profit Calculations
- For each order/offer, finds the best matching trade elsewhere
- Shows exactly where to buy and where to sell
- Calculates total profit and profit per unit
- Shows distance you need to travel

### 🔍 Powerful Filtering & Search
- **Filter by good type:** Ore, Ingot, Component, Tool, Ammo, Bottle
- **Filter by transaction type:** Orders, Offers, or Profitable trades only
- **Search:** Find items, stores, or owners instantly
- **Sort by:** Profit, Price, Quantity, Item name, Store name

### 📈 Two View Modes
1. **Store View** - See all transactions grouped by owner/station
2. **Item View** - See all transactions grouped by item

### 📊 Statistics Dashboard
- Total stores
- Active transactions
- Unique items
- Best profit opportunity

### 🎨 Beautiful, Modern UI
- Responsive design (works on mobile)
- Color-coded buy orders (green) and sell offers (blue)
- Profitable trades highlighted
- Smooth animations
- Clean, professional look

---

## How It Works

### Data Flow
1. **You update** your Google Sheet with trade data
2. **The app fetches** data via Google Sheets API
3. **JavaScript calculates** all profit opportunities
4. **UI displays** everything beautifully filtered and sorted

### Profit Calculation Example

If your sheet has:
- **Order from PlayerA:** Buying Steel Plate @ 300 credits (quantity: 500)
- **Offer from PlayerB:** Selling Steel Plate @ 250 credits (quantity: 1000)

The app shows:
- **Profit:** 25,000 credits (50 per unit × 500 units)
- **Buy from:** PlayerB @ 250
- **Sell to:** PlayerA @ 300
- **Distance:** Calculated from GPS coordinates

---

## Understanding Your Data

### Transaction Types
- **Order** = Buy Order (someone wants to buy)
- **Offer** = Sell Offer (someone wants to sell)

### Good Types Supported
- **Ore** - Raw materials
- **Ingot** - Refined materials
- **Component** - Crafted parts
- **Tool** - Hand tools
- **Ammo** - Ammunition
- **Bottle** - Gas bottles

### GPS Format
Your sheet uses Space Engineers GPS format:
```
GPS:Station Name:12345:67890:10111:
```

The app automatically parses this to:
- Extract station name
- Extract X, Y, Z coordinates
- Calculate distances between stations

---

## Files in This Folder

### Core Files (Required)
- **index.html** - The main page (open this in your browser)
- **app.js** - All the application logic
- **styles.css** - Beautiful styling
- **config.js** - Your configuration (Sheet ID and API key)

### Documentation Files
- **SETUP_INSTRUCTIONS.md** - Detailed setup guide
- **README.md** - General project info
- **SAMPLE_DATA.md** - Sample data examples
- **QUICKSTART.md** - Quick start guide
- **README_YOUR_SETUP.md** - This file

### Template Files
- **config.example.js** - Template config (safe to share/commit)
- **.gitignore** - Protects your API key from git

---

## Tips for Best Use

### Keep Data Current
- The app loads data when you open it or click "Refresh Data"
- Update your Google Sheet regularly with fresh trade data
- Click refresh in the app after updating the sheet

### Use Filters Effectively
- Set "Show: Profitable Only" to see money-making opportunities
- Filter by item type to focus on what you're trading
- Sort by "Best Profit" to see top deals first

### Search Power
- Search for item names: "Steel Plate"
- Search for owners: "PlayerName"
- Search for station names from GPS

### Share with Community
- The app is just HTML/CSS/JS files
- Share the whole folder with your server community
- Everyone can use it if the Google Sheet is public

---

## Troubleshooting

### App says "Please configure your Google API Key"
→ You need to add your API key to `config.js`

### "Failed to fetch data from Google Sheets"
→ Check that:
- API key is correct
- Google Sheets API is enabled
- Your sheet is set to "Anyone with the link can view"

### No data showing
→ Check that your sheet tab is named "Sheet1" (or update `SHEET_NAME` in config.js)

### GPS not parsing
→ Make sure GPS follows Space Engineers format: `GPS:Name:X:Y:Z:`

### Profit calculations seem wrong
→ Verify:
- Item names match exactly across entries
- Prices are numbers (not text)
- Quantities are numbers

---

## What's Simplified (vs Laravel Version)

This standalone version focuses on the core feature - showing trade data and calculating profits. It drops:

- ❌ Multiple worlds (single world only)
- ❌ Multiple servers
- ❌ Historical trends/charts
- ❌ User authentication
- ❌ Complex backend infrastructure
- ❌ Database management
- ❌ 3D maps
- ❌ News system

**But you get:**
- ✅ Zero maintenance (no server needed)
- ✅ Easy deployment (just files)
- ✅ Fast and lightweight
- ✅ Works anywhere (just open HTML)
- ✅ Easy to update (edit Google Sheet)

---

## Future Enhancements (If You Want)

You could add:
- Multiple world support (add a "World" column to your sheet)
- Historical trend charts (store data over time)
- Export to CSV
- Dark mode toggle
- Mobile app wrapper
- Auto-refresh timer
- Trade route planner

---

## Questions?

Check the documentation files:
- **SETUP_INSTRUCTIONS.md** for detailed setup
- **README.md** for general info
- **SAMPLE_DATA.md** for data format examples

---

Enjoy your simplified SE TradeHouse! 🚀
