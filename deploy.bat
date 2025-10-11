@echo off
echo ========================================
echo   House Rent Kenya - GitHub Deployment
echo ========================================
echo.

REM Check if git is initialized
git status >nul 2>&1
if errorlevel 1 (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add all files
echo Adding all files...
git add .
echo.

REM Show status
echo Current status:
git status
echo.

REM Prompt for commit message
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Fix: All issues resolved - authentication, listings, search, profile upload working

REM Commit changes
echo.
echo Committing changes...
git commit -m "%commit_msg%"
echo.

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo   GitHub Repository Setup Required
    echo ========================================
    echo.
    echo Please follow these steps:
    echo 1. Go to https://github.com/new
    echo 2. Create a new repository named: house-rent-kenya
    echo 3. DO NOT initialize with README
    echo 4. Copy the repository URL
    echo.
    set /p repo_url="Enter your GitHub repository URL: "
    
    echo.
    echo Adding remote origin...
    git remote add origin !repo_url!
    echo.
)

REM Set main branch
echo Setting main branch...
git branch -M main
echo.

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main
echo.

if errorlevel 0 (
    echo ========================================
    echo   SUCCESS! Code deployed to GitHub!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. View your repository on GitHub
    echo 2. Deploy to Vercel: https://vercel.com
    echo 3. Add environment variables in Vercel
    echo.
) else (
    echo ========================================
    echo   Deployment failed!
    echo ========================================
    echo.
    echo Please check:
    echo 1. GitHub repository exists
    echo 2. You have push permissions
    echo 3. Remote URL is correct
    echo.
    echo Run: git remote -v
    echo To see your remote configuration
    echo.
)

pause
