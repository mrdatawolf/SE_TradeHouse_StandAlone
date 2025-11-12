# Setup Instructions for Your Live Sheet

Your Google Sheet is already configured! Follow these quick steps to get the app running.

## Step 1: Get a Google API Key (3 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Click **"Enable APIs and Services"**
4. Search for **"Google Sheets API"** and enable it
5. Go to **"Credentials"** in the left sidebar
6. Click **"Create Credentials"** → **"API Key"**
7. Copy your new API key

## Step 2: Configure the App (30 seconds)

1. Open `config.js` in a text editor
2. Find this line:
   ```javascript
   GOOGLE_API_KEY: 'YOUR_API_KEY_HERE',
   ```
3. Replace `YOUR_API_KEY_HERE` with your actual API key
4. Save the file

**Note:** The Sheet ID is already configured in config.js: `1eIeDFgJ4f9QSBrwdJNGstZcka4La9Ixqxvipvumum40`

## Step 3: Make Sure Your Sheet is Public (30 seconds)

1. Open your Google Sheet
2. Click the **"Share"** button (top right)
3. Click **"Change to anyone with the link"**
4. Set permission to **"Viewer"**
5. Click **"Done"**

## Step 4: Run the App!

1. Double-click `index.html` to open it in your browser
2. The app will load your trade data automatically!

---

## Your Sheet Structure

Your sheet has these columns:
- **Item** - The item name (e.g., "Iron Ore", "Steel Plate")
- **Type** - The good type (Ore, Ingot, Component, Tool, Ammo, Bottle)
- **Quantity** - How many available
- **Price** - Price per unit
- **Order or Offer** - "Order" for buy orders, "Offer" for sell offers
- **Owner** - Who owns the trading station
- **Station Type** - Type of station (Player, NPC, etc.)
- **GPS** - GPS coordinates (Space Engineers format)
- **Unique ID** - Unique identifier for the transaction
- **Last Update** - When this was last updated

The app will automatically:
- Parse all your data
- Calculate profit opportunities between stations
- Show you where to buy low and sell high
- Calculate distances between stations
- Filter and sort everything

---

## Troubleshooting

### "Failed to fetch data from Google Sheets"

**Possible causes:**
1. API key is not configured
2. Sheet is not public
3. API key doesn't have Sheets API enabled

**Fix:**
- Double-check your API key in config.js
- Make sure the sheet is set to "Anyone with the link can view"
- Verify Google Sheets API is enabled in Cloud Console

### "No transactions found"

**Possible causes:**
1. Sheet name in config.js doesn't match your actual sheet tab name
2. No data in the sheet

**Fix:**
- Open your Google Sheet
- Check the tab name at the bottom (default is "Sheet1")
- Update `SHEET_NAME` in config.js if needed:
  ```javascript
  SHEET_NAME: 'YourActualTabName',
  ```

### GPS Not Showing Correctly

**The app supports multiple GPS formats:**
- Space Engineers format: `GPS:Station Name:12345:67890:10111:`
- Simple format: `12345, 67890, 10111`
- Spaced format: `12345 67890 10111`

If your GPS format is different, the coordinates might not parse. The app will still work, but distance calculations may be 0.

### Column Names Don't Match

The app is flexible and tries to find columns by multiple names:
- "Item" column
- "Type" column
- "Quantity", "Qty"
- "Order or Offer", "Order/Offer", "Transaction Type"
- "Owner"
- "GPS", "Coordinates", "Location"

If your column names are different, you may need to rename them to match.

---

## What the App Does

### Profit Calculations

For each transaction, the app:
1. **For Buy Orders (Orders):** Finds the cheapest matching sell offer elsewhere
2. **For Sell Offers (Offers):** Finds the highest matching buy order elsewhere
3. Calculates: `(sellPrice - buyPrice) × availableQuantity`
4. Shows you exactly where to buy and where to sell
5. Calculates the distance you need to travel

### Features Available

- **Store View**: See all transactions grouped by owner/station
- **Item View**: See all transactions grouped by item
- **Search**: Search for items, owners, or station names
- **Filters**:
  - Filter by good type (Ore, Ingot, Component, etc.)
  - Show only orders, only offers, or only profitable trades
- **Sorting**:
  - By profit (highest first) - **Default**
  - By price (low to high or high to low)
  - By quantity
  - By item name
  - By store name
- **Statistics Dashboard**: Shows total stores, transactions, items, and best profit

### Understanding the Profit Display

When you see a profitable transaction, it shows:
- **Profit**: Total profit possible
- **Buy from**: Where to buy (cheapest source) and the price
- **Sell to**: Where to sell (highest buyer) and the price
- **Profit/unit**: How much you make per item
- **Max quantity**: How many you can trade (limited by availability)
- **Distance**: How far you need to travel

---

## Tips for Best Results

1. **Keep Your Sheet Updated**: The app reads data on load/refresh - update your sheet regularly
2. **Use Consistent Names**: Make sure item names match exactly across all entries
3. **Include GPS Coordinates**: This enables distance calculations
4. **Filter by "Profitable Only"**: Quick way to see money-making opportunities
5. **Sort by Profit**: See the best deals first
6. **Use Search**: Quickly find specific items you're interested in

---

## Next Steps

Once the app is working:
1. Bookmark `index.html` for quick access
2. Set up a script to automatically update your Google Sheet (optional)
3. Share the app with your server community
4. Keep your sheet updated with current trade data

Enjoy tracking your Space Engineers trades!
