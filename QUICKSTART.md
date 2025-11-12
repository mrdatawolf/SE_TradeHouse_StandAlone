# Quick Start Guide - SE TradeHouse Standalone

Get up and running in 5 minutes!

## Step 1: Set Up Google Sheet (2 minutes)

1. Go to [sheets.google.com](https://sheets.google.com) and create a new sheet
2. Open `SAMPLE_DATA.md` in this folder
3. Copy the TradeZones table and paste into the first tab
4. Rename the first tab to "TradeZones"
5. Create a second tab, rename it to "Transactions"
6. Copy the Transactions table and paste into the second tab

## Step 2: Get Google API Access (2 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Click "Enable APIs and Services"
4. Search for "Google Sheets API" and enable it
5. Go to "Credentials" in the left menu
6. Click "Create Credentials" → "API Key"
7. Copy your new API key

## Step 3: Make Sheet Public (30 seconds)

1. In your Google Sheet, click the "Share" button (top right)
2. Click "Change to anyone with the link"
3. Set permission to "Viewer"
4. Copy the sheet URL
5. Extract the Sheet ID from the URL:
   - URL: `https://docs.google.com/spreadsheets/d/1ABC123xyz/edit`
   - Sheet ID: `1ABC123xyz` (the part between `/d/` and `/edit`)

## Step 4: Configure the App (30 seconds)

1. Open `config.js` in a text editor
2. Replace `YOUR_SHEET_ID_HERE` with your Sheet ID
3. Replace `YOUR_API_KEY_HERE` with your API Key
4. Save the file

## Step 5: Run the App

1. Double-click `index.html` to open it in your browser
2. The app will load and display your trade data!

## That's It!

You should now see:
- A list of stores with their transactions
- Profit calculations showing opportunities
- Filters to browse by item type
- Search functionality

## What to Do Next

### Test the Features

- **Search:** Try searching for "Iron" or a store name
- **Filter:** Use the dropdowns to filter by item type or transaction type
- **Sort:** Change the sort order to see different views
- **Switch Views:** Try the "Item View" tab to group by items instead of stores
- **Profitable Only:** Set the transaction filter to "Profitable Only" to see money-making opportunities

### Add Your Own Data

- Edit your Google Sheet to add more stores and transactions
- Click the "Refresh Data" button in the app to reload
- The app automatically calculates profits between all stores

### Automate Data Updates

See `README.md` for information on:
- Setting up automatic data imports from your game server
- Using Python scripts to update the sheet
- Scheduling regular updates

## Troubleshooting

### "Please configure your Google Sheet ID and API Key"
- Make sure you edited `config.js` with your actual values
- Check that you saved the file

### "Failed to fetch data from Google Sheets"
- Verify your Sheet ID is correct
- Check that your API key is valid
- Make sure the sheet is set to "Anyone with the link can view"
- Verify the tab names are exactly "TradeZones" and "Transactions" (case-sensitive)

### "No transactions found"
- Check that your sheet has data in both tabs
- Make sure the headers match exactly (id, grid_name, owner, x, y, z, etc.)
- Verify there are no extra spaces in the header names

### Data Looks Wrong
- Open the browser console (F12) to see detailed error messages
- Check that transaction_type is either "buy" or "sell" (lowercase)
- Ensure good_type matches one of: Ore, Ingot, Component, Tool, Ammo, Bottle
- Verify all IDs are unique

### API Key Issues
- If you get API key errors, you might need to restrict the key:
  - In Google Cloud Console, edit your API key
  - Under "API restrictions", select "Restrict key"
  - Choose "Google Sheets API"
- Or set HTTP referrer restrictions if hosting on a web server

## Browser Compatibility

Works in all modern browsers:
- Chrome / Edge (Recommended)
- Firefox
- Safari
- Opera

## Need Help?

- Check the full `README.md` for detailed documentation
- Review `SAMPLE_DATA.md` for data format examples
- Make sure your Google Sheet structure matches the sample

## Next Steps

Once you're comfortable with the sample data:

1. **Clear the sample data** from your Google Sheet
2. **Add your real Space Engineers trade data**
3. **Set up automation** (optional) to keep data current
4. **Share with your server community** so everyone can benefit!

Enjoy tracking your Space Engineers trades!
