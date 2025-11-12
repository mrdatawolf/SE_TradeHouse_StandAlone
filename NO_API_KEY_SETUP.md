# ✅ No API Key Needed!

## You're Ready to Go!

Since your Google Sheet is public, the app is configured to use **CSV mode** which requires **NO API KEY**. Everything is already set up!

---

## Just Open and Use

1. **Make sure your sheet is public:**
   - Open your Google Sheet
   - Click "Share" (top right)
   - Set to "Anyone with the link can view"

2. **Open the app:**
   - Double-click `index.html`
   - The app will load your data automatically!

**That's it!** No API key, no configuration needed.

---

## How It Works

### CSV Mode (Current Setup)
- **What it does:** Fetches your sheet as CSV data
- **Pros:**
  - ✅ No API key needed
  - ✅ No Google Cloud setup
  - ✅ Works instantly
  - ✅ No rate limits
- **Cons:**
  - ⚠️ Sheet must be public
  - ⚠️ Only reads the first tab (or specified GID)

### Already Configured For You

In `config.js`:
```javascript
GOOGLE_SHEET_ID: '1eIeDFgJ4f9QSBrwdJNGstZcka4La9Ixqxvipvumum40',
SHEET_GID: '0',  // First tab
ACCESS_MODE: 'csv',  // No API key needed!
```

---

## If You Have Multiple Tabs

If your data is on a different tab (not the first one):

1. Open your Google Sheet
2. Look at the URL when you're on the tab you want:
   ```
   https://docs.google.com/spreadsheets/d/1eIeDFgJ4f9QSBrwdJNGstZcka4La9Ixqxvipvumum40/edit#gid=123456789
   ```
3. Copy the number after `gid=` (e.g., `123456789`)
4. Update `config.js`:
   ```javascript
   SHEET_GID: '123456789',
   ```

---

## Alternative: API Mode (If You Want)

If you prefer to use the Google Sheets API instead:

### Why Use API Mode?
- Access private sheets (not public)
- Read multiple tabs
- More control over data access

### How to Enable API Mode

1. Get a Google API Key:
   - Go to https://console.cloud.google.com/
   - Enable "Google Sheets API"
   - Create an API Key

2. Update `config.js`:
   ```javascript
   ACCESS_MODE: 'api',  // Change from 'csv' to 'api'
   GOOGLE_API_KEY: 'your-api-key-here',
   SHEET_NAME: 'Sheet1',  // Name of your tab
   ```

**But you don't need this!** CSV mode works great for public sheets.

---

## Troubleshooting

### "Failed to fetch data from Google Sheets"

**Solution:**
1. Make sure your Google Sheet is set to "Anyone with the link can view"
2. Check that `GOOGLE_SHEET_ID` in config.js matches your sheet
3. If using a different tab, make sure `SHEET_GID` is correct

### "No data showing"

**Check:**
1. Your sheet has data with the expected columns:
   - Item, Type, Quantity, Price, Order or Offer, Owner, Station Type, GPS, Unique ID, Last Update
2. The first row has headers
3. Data starts on row 2

### Wrong tab loading

**Fix:**
1. Find the GID of your tab (from the URL when viewing that tab)
2. Update `SHEET_GID` in config.js

---

## Privacy Note

**CSV mode requirements:**
- ✅ Your sheet must be public (anyone with link can view)
- ✅ Data is fetched directly from Google's servers
- ✅ No authentication required
- ⚠️ Anyone with the link can view the data

If you need **private access**, use API mode with an API key instead.

---

## Summary

🎉 **You're all set!** Just open `index.html` and the app will:
- Fetch your public Google Sheet as CSV
- Parse all your trade data
- Calculate profit opportunities
- Display everything beautifully

No API key, no setup, no hassle!

---

## Questions?

- **Sheet not loading?** → Verify it's set to public
- **Wrong data showing?** → Check the `SHEET_GID` matches your tab
- **Need multiple tabs?** → Consider switching to API mode
- **Want it faster?** → CSV mode is already the fastest!

Open `index.html` and enjoy! 🚀
