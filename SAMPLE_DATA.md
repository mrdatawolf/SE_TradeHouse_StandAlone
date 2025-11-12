# Sample Google Sheets Data

Use this as a template for setting up your Google Sheets. Create a new Google Sheet with two tabs: **TradeZones** and **Transactions**.

## Tab 1: TradeZones

Copy this data into your first sheet tab (rename it to "TradeZones"):

```
id	grid_name	owner	x	y	z
1	Central Trading Hub	PlayerOne	15000	2000	30000
2	Mining Outpost Alpha	NPCTrader	-5000	1000	12000
3	Orbital Station Beta	PlayerTwo	25000	-3000	45000
4	Deep Space Market	CorporationX	-15000	500	-20000
5	Asteroid Base Gamma	PlayerThree	8000	4000	18000
```

## Tab 2: Transactions

Copy this data into your second sheet tab (rename it to "Transactions"):

```
id	trade_zone_id	transaction_type	good_type	good_name	price	quantity
1	1	buy	Ore	Iron	120	5000
2	1	buy	Ore	Silicon	180	3000
3	1	sell	Ingot	Steel	250	1000
4	1	sell	Component	Steel Plate	300	500
5	2	sell	Ore	Iron	80	8000
6	2	sell	Ore	Silicon	150	4000
7	2	buy	Ingot	Steel	280	800
8	2	buy	Component	Steel Plate	350	400
9	3	buy	Ore	Platinum	500	2000
10	3	buy	Ore	Gold	450	2500
11	3	sell	Ingot	Platinum	650	1500
12	3	sell	Component	Computer	800	300
13	4	sell	Ore	Platinum	420	3000
14	4	sell	Ore	Gold	380	3500
15	4	buy	Component	Computer	900	250
16	4	buy	Component	Motor	600	400
17	5	buy	Ore	Ice	50	10000
18	5	sell	Bottle	Hydrogen	100	5000
19	5	sell	Bottle	Oxygen	110	4500
20	1	buy	Component	Motor	550	600
21	2	sell	Component	Motor	520	700
22	3	buy	Ore	Silver	200	3000
23	4	sell	Ore	Silver	170	4000
24	5	buy	Component	Steel Plate	320	800
25	1	sell	Ore	Uranium	350	1000
26	3	buy	Ore	Uranium	400	900
```

## Quick Copy-Paste Instructions

1. **Create a new Google Sheet** at [sheets.google.com](https://sheets.google.com)

2. **First Tab (TradeZones):**
   - Rename the first sheet tab to "TradeZones"
   - Click on cell A1
   - Paste the TradeZones data above (including headers)
   - The data should automatically separate into columns

3. **Second Tab (Transactions):**
   - Click the "+" button to add a new sheet tab
   - Rename it to "Transactions"
   - Click on cell A1
   - Paste the Transactions data above (including headers)
   - The data should automatically separate into columns

4. **Make the sheet public:**
   - Click "Share" button (top right)
   - Click "Change to anyone with the link"
   - Set to "Viewer"
   - Copy the link

5. **Extract your Sheet ID:**
   - From the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
   - Copy the `YOUR_SHEET_ID` part

6. **Set up Google API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable "Google Sheets API"
   - Go to "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

7. **Update config.js:**
   ```javascript
   GOOGLE_SHEET_ID: 'YOUR_SHEET_ID_HERE',
   GOOGLE_API_KEY: 'YOUR_API_KEY_HERE',
   ```

## Understanding the Sample Data

This sample data demonstrates the profit calculation:

### Profitable Trade Examples:

1. **Iron Ore Trade:**
   - Mining Outpost Alpha SELLS Iron at 80 per unit (8000 available)
   - Central Trading Hub BUYS Iron at 120 per unit (5000 needed)
   - **Profit: 40 per unit × 5000 = 200,000 credits**

2. **Steel Ingot Trade:**
   - Central Trading Hub SELLS Steel at 250 per unit (1000 available)
   - Mining Outpost Alpha BUYS Steel at 280 per unit (800 needed)
   - **Profit: 30 per unit × 800 = 24,000 credits**

3. **Motor Component Trade:**
   - Mining Outpost Alpha SELLS Motor at 520 per unit (700 available)
   - Central Trading Hub BUYS Motor at 550 per unit (600 needed)
   - **Profit: 30 per unit × 600 = 18,000 credits**

4. **Platinum Ore Trade:**
   - Deep Space Market SELLS Platinum at 420 per unit (3000 available)
   - Orbital Station Beta BUYS Platinum at 500 per unit (2000 needed)
   - **Profit: 80 per unit × 2000 = 160,000 credits**

The app will automatically calculate these and show them sorted by profitability!

## Adding Real Game Data

To replace this sample data with real Space Engineers server data:

1. **Manual Method:**
   - Visit trading stations in-game
   - Note down the orders and offers
   - Update the Google Sheet manually

2. **Automated Method (Requires Scripting):**
   - If your server has an API endpoint (like the original Laravel system)
   - Write a Python/Node.js script to fetch data
   - Use Google Sheets API to update the sheet automatically

3. **Game Server Export:**
   - If you have access to server files
   - Export economy data to CSV
   - Import CSV into Google Sheets

## Data Tips

- **Keep IDs Unique:** Each trade zone and transaction should have a unique ID
- **Consistent Naming:** Use consistent item names (e.g., always "Iron" not sometimes "iron")
- **GPS Coordinates:** Use actual in-game coordinates for distance calculations
- **Transaction Types:** Only use "buy" or "sell" (lowercase)
- **Good Types:** Stick to: Ore, Ingot, Component, Tool, Ammo, Bottle (capitalize first letter)
- **Numbers:** Don't use commas in numbers (use 5000 not 5,000)
