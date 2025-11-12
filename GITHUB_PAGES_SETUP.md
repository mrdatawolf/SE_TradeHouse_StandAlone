# GitHub Pages Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Create a New GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `se-tradehouse-standalone` (or whatever you prefer)
3. **Visibility:** Public or Private (both work with GitHub Pages)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click **"Create repository"**

### Step 2: Push Your Code

Open Command Prompt/Terminal in the `standalone` folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SE TradeHouse Standalone"

# Add your GitHub repo as remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Source":
   - **Branch:** Select `main`
   - **Folder:** Select `/ (root)`
5. Click **Save**

### Step 4: Access Your Site

After 1-2 minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

**That's it!** Your trade house app is now online and accessible to anyone.

---

## Alternative: Deploy from Existing SETradeHouse Repo

If you want to deploy from your existing SETradeHouse repository:

### Option A: Use a subdirectory

Your existing repo already has the `standalone/` folder. You can serve it directly:

```bash
# Navigate to your SETradeHouse repo
cd D:\Projects\GitHub\SETradeHouse

# Add and commit the standalone folder if not already done
git add standalone/
git commit -m "Add standalone app"
git push
```

Then in GitHub Settings > Pages:
- **Branch:** main
- **Folder:** `/standalone` (if this option exists)

**URL will be:** `https://YOUR_USERNAME.github.io/SETradeHouse/standalone/`

### Option B: Create a new branch for standalone

```bash
# Create and switch to a new branch
git checkout -b gh-pages

# Remove everything except standalone
git rm -rf $(git ls-files | grep -v "^standalone/")

# Move standalone contents to root
git mv standalone/* .
git mv standalone/.gitignore .

# Commit and push
git commit -m "GitHub Pages - Standalone app"
git push -u origin gh-pages
```

Then in GitHub Settings > Pages:
- **Branch:** gh-pages
- **Folder:** / (root)

**URL will be:** `https://YOUR_USERNAME.github.io/SETradeHouse/`

---

## What Gets Deployed

All these files will be public on GitHub:

```
├── index.html          ✅ Public
├── app.js              ✅ Public
├── styles.css          ✅ Public
├── config.js           ✅ Public (contains your Sheet ID)
├── server.py           ⚠️  Not needed for GitHub Pages (but harmless)
├── server.bat          ⚠️  Not needed for GitHub Pages (but harmless)
└── *.md files          ✅ Public (documentation)
```

**Note:** Your `config.js` contains your Google Sheet ID, but that's okay since:
- Your sheet is already public
- No API keys are exposed (you're using CSV mode)
- Anyone can view the sheet anyway

---

## Custom Domain (Optional)

Want to use your own domain like `trades.yourdomain.com`?

1. **Buy a domain** (if you don't have one)
2. **Add DNS records:**
   ```
   Type: CNAME
   Name: trades (or whatever subdomain)
   Value: YOUR_USERNAME.github.io
   ```
3. **In GitHub Pages settings:**
   - Enter your custom domain: `trades.yourdomain.com`
   - Check "Enforce HTTPS"

---

## Updating Your Site

Whenever you want to update the site:

```bash
# Make your changes to files
# Then:

git add .
git commit -m "Update trade data display"
git push
```

GitHub Pages will automatically rebuild in 1-2 minutes.

---

## Advantages of GitHub Pages

✅ **Free hosting** - No cost, ever
✅ **HTTPS by default** - Secure connection
✅ **Fast CDN** - Served from GitHub's global network
✅ **No CORS issues** - Served over HTTPS
✅ **Version control** - All changes tracked in git
✅ **Easy updates** - Just push to GitHub
✅ **Custom domains** - Use your own domain if you want
✅ **No server maintenance** - GitHub handles everything

---

## Sharing with Your Community

Once deployed, share the URL:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

Everyone can:
- View current trade data
- See profit opportunities
- Filter and search
- No installation needed

Just make sure to keep your Google Sheet updated!

---

## Troubleshooting

### Site not showing up?
- Wait 2-3 minutes after enabling Pages
- Check the Actions tab for build status
- Make sure you selected the correct branch and folder

### 404 Error?
- Verify `index.html` is in the root of your selected folder
- Check that branch name is correct

### Data not loading?
- Open browser console (F12)
- Check for errors
- Verify your Sheet ID in config.js is correct
- Make sure your Google Sheet is public

### Want to keep your main repo separate?
- Create a completely new repository for standalone
- Copy only the standalone folder contents
- Deploy that as a separate project

---

## Next Steps After Deployment

1. **Test the live site** - Visit your GitHub Pages URL
2. **Share with your server community** - Give them the URL
3. **Set up automatic updates** (optional):
   - Create a GitHub Action to update data
   - Or manually update your Google Sheet (app fetches automatically)
4. **Monitor usage** (optional):
   - Add Google Analytics
   - Track how many people use it

---

## Security Note

Since this is a public site with a public Google Sheet:
- ✅ No sensitive data is exposed
- ✅ No authentication needed
- ✅ Anyone can view (which is the goal!)
- ✅ Your Sheet ID being public is fine (sheet is already public)

If you ever need to make this private:
- Switch to API mode
- Add authentication to your site
- Make your Google Sheet private

But for a community trade tool, public is perfect!

---

## Questions?

- **How do I update the data?** → Just update your Google Sheet, the app fetches it automatically
- **How often does it refresh?** → Every time someone loads the page (or clicks refresh)
- **Can I password protect it?** → GitHub Pages Pro has authentication, or use Netlify/Vercel for free auth
- **Will this cost money?** → No, GitHub Pages is free for public repos

Enjoy your online trade house! 🚀
