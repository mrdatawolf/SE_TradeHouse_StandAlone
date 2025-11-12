# Quick Deployment Guide

## Easiest Way: Using the Deploy Script

### Windows

1. **Create a new GitHub repository** at https://github.com/new
   - Name it something like `se-tradehouse` or `space-engineers-trades`
   - Make it **Public**
   - Don't initialize with README

2. **Double-click `deploy-to-github.bat`**
   - It will prompt you for your repository URL
   - Example: `https://github.com/yourusername/se-tradehouse.git`
   - It will automatically push everything

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Source: **main** branch, **/ (root)** folder
   - Click **Save**

4. **Done!** Your site will be live in 1-2 minutes at:
   ```
   https://yourusername.github.io/se-tradehouse/
   ```

---

## Manual Deployment

If you prefer to do it manually:

```bash
# Navigate to standalone folder
cd D:\Projects\GitHub\SETradeHouse\standalone

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SE TradeHouse Standalone"

# Add your GitHub repo (replace with your URL)
git remote add origin https://github.com/yourusername/yourrepo.git

# Create main branch and push
git branch -M main
git push -u origin main
```

Then enable GitHub Pages in repository settings.

---

## Alternative: Create New Repo on GitHub First

1. **Create repository on GitHub**
2. **Copy the commands GitHub shows you** (after creating empty repo)
3. Run them in the `standalone` folder

GitHub provides commands like:
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/yourusername/yourrepo.git
git push -u origin main
```

---

## Verification

After deployment, check:

1. **Repository exists** on GitHub with all files
2. **GitHub Pages enabled** in Settings → Pages
3. **Site is live** at your GitHub Pages URL
4. **Data loads** when you visit the site

Test the live URL and verify:
- Page loads without errors
- Trade data appears
- Filters and search work
- Profit calculations display

---

## Updating Your Site

After making changes:

```bash
cd D:\Projects\GitHub\SETradeHouse\standalone

git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically update in 1-2 minutes.

---

## Common Issues

### Authentication Failed
- Use a Personal Access Token instead of password
- Go to GitHub Settings → Developer settings → Personal access tokens
- Generate token with 'repo' scope
- Use token as password when prompted

### Permission Denied
- Make sure you own the repository
- Check you're pushing to the correct URL
- Verify your GitHub username and token/password

### Site Not Updating
- Wait 2-3 minutes after push
- Check the Actions tab on GitHub for build status
- Try hard refresh in browser (Ctrl+F5)

---

## Need Help?

See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) for detailed instructions and troubleshooting.
