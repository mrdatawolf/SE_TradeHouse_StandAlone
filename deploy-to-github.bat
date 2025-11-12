@echo off
echo ================================================================
echo   SE TradeHouse - GitHub Deployment Helper
echo ================================================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add all files
echo Adding all files to git...
git add .
echo.

REM Check if there are changes to commit
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo Enter commit message:
    set /p commit_message="Commit message: "

    echo.
    echo Committing changes...
    git commit -m "%commit_message%"
    echo.
) else (
    echo No changes to commit.
    echo.
)

REM Check if remote exists
git remote -v | findstr origin >nul
if %errorlevel% neq 0 (
    echo No remote repository configured.
    echo.
    echo Please enter your GitHub repository URL:
    echo Example: https://github.com/username/repo-name.git
    set /p repo_url="Repository URL: "

    echo.
    echo Adding remote origin...
    git remote add origin %repo_url%
    echo.
)

REM Check if main branch exists
git show-ref --verify --quiet refs/heads/main
if %errorlevel% neq 0 (
    echo Creating main branch...
    git branch -M main
    echo.
)

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main
echo.

if %errorlevel% equ 0 (
    echo ================================================================
    echo   SUCCESS! Code pushed to GitHub
    echo ================================================================
    echo.
    echo Next steps:
    echo 1. Go to your GitHub repository
    echo 2. Click Settings ^> Pages
    echo 3. Under Source, select branch: main, folder: / (root^)
    echo 4. Click Save
    echo 5. Wait 1-2 minutes for deployment
    echo.
    echo Your site will be available at:
    echo https://YOUR_USERNAME.github.io/YOUR_REPO/
    echo.
) else (
    echo ================================================================
    echo   ERROR during push
    echo ================================================================
    echo.
    echo Common issues:
    echo - Check your GitHub credentials
    echo - Verify repository URL is correct
    echo - Make sure you have push permissions
    echo.
)

pause
