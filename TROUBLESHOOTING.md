# Troubleshooting "NetworkError when attempting to fetch resource"

## The Problem

When you open `index.html` directly from your filesystem (by double-clicking), browsers block the fetch request due to **CORS (Cross-Origin Resource Sharing)** security policies. The file:// protocol doesn't allow fetching from external URLs.

## Solution: Run a Local Web Server

You need to serve the files through HTTP instead of opening them directly. Here are several easy ways to do this:

---

## ✅ Option 1: Python Server (Easiest)

### If you have Python installed:

**Windows:**
```bash
# Just double-click server.bat
# OR run in command prompt:
python server.py
```

**Mac/Linux:**
```bash
python3 server.py
# OR
python -m http.server 8000
```

Then open your browser to: **http://localhost:8000**

---

## ✅ Option 2: Node.js Server

### If you have Node.js installed:

```bash
# Install http-server globally (one time)
npm install -g http-server

# Run in the standalone folder
http-server -p 8000
```

Then open: **http://localhost:8000**

---

## ✅ Option 3: PHP Server

### If you have PHP installed:

```bash
php -S localhost:8000
```

Then open: **http://localhost:8000**

---

## ✅ Option 4: VS Code Live Server

### If you use VS Code:

1. Install the "Live Server" extension by Ritwick Dey
2. Right-click `index.html`
3. Select "Open with Live Server"

It will automatically open in your browser!

---

## ✅ Option 5: Browser Extensions

### Chrome/Edge:
1. Install "Web Server for Chrome" extension
2. Choose the standalone folder
3. Start the server
4. Open the provided URL

---

## ✅ Option 6: Online Hosting (No Local Server Needed!)

Upload the files to any web host:

### GitHub Pages (Free):
1. Create a GitHub repository
2. Upload all files from `standalone/` folder
3. Enable GitHub Pages in repository settings
4. Access at: `https://yourusername.github.io/repo-name/`

### Netlify Drop (Free):
1. Go to https://app.netlify.com/drop
2. Drag the `standalone` folder
3. Get instant URL

### Vercel (Free):
1. Go to https://vercel.com/
2. Import your repository or upload files
3. Get instant URL

---

## ✅ Option 7: Use API Mode Instead

If you can't run a local server, switch to API mode with a Google API key:

1. Get a Google API Key (see original setup instructions)
2. Update `config.js`:
   ```javascript
   ACCESS_MODE: 'api',  // Change from 'csv'
   GOOGLE_API_KEY: 'your-api-key-here',
   ```

**Why this works:** API mode uses the Google Sheets API endpoint which has proper CORS headers, so it works even when opened as file://

---

## Quick Test: Is Your Sheet Actually Public?

Open this URL in your browser (replace with your sheet ID):
```
https://docs.google.com/spreadsheets/d/1eIeDFgJ4f9QSBrwdJNGstZcka4La9Ixqxvipvumum40/export?format=csv&gid=0
```

**Expected result:** You should see CSV data download or display

**If you get an error:** Your sheet isn't public. Fix it:
1. Open your Google Sheet
2. Click "Share" (top right)
3. Change to "Anyone with the link"
4. Set role to "Viewer"
5. Click "Done"

---

## Recommended Solutions by Scenario

### For Quick Testing:
→ **Python server** (`python server.py` or double-click `server.bat`)

### For Development:
→ **VS Code Live Server** (auto-reload on changes)

### For Sharing with Others:
→ **GitHub Pages** or **Netlify** (free hosting)

### Can't Install Anything:
→ **Switch to API mode** (requires Google API key but works with file://)

---

## Still Having Issues?

### Check Browser Console:
1. Open the app
2. Press F12 (Developer Tools)
3. Go to "Console" tab
4. Look for error messages
5. Share the error message for more help

### Common Error Messages:

**"CORS policy: No 'Access-Control-Allow-Origin' header"**
→ You need to run a local server (see options above)

**"Failed to fetch"**
→ Check if the Google Sheet URL is accessible (test the CSV export URL)

**"NetworkError when attempting to fetch resource"**
→ CORS issue - run a local server

---

## Python Not Installed?

Download Python from: https://www.python.org/downloads/

**During installation on Windows:**
- ✅ Check "Add Python to PATH"
- ✅ Check "Install pip"

Then you can use the Python server option.

---

## Summary

**The issue:** Browsers block file:// from fetching external URLs

**The fix:** Serve the files through HTTP

**Easiest solution:**
1. Double-click `server.bat` (Windows) or run `python3 server.py` (Mac/Linux)
2. Open http://localhost:8000 in your browser

**Alternative:** Upload to GitHub Pages, Netlify, or any web host

---

Need more help? Check which method works best for your setup and try it!
