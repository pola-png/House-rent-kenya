@echo off
echo ========================================
echo   Redeploying to GitHub
echo ========================================
echo.

REM Add all changes
echo Adding all changes...
git add .
echo.

REM Show what's being committed
echo Changes to be committed:
git status --short
echo.

REM Commit with message
echo Committing changes...
git commit -m "feat: Add role-based access control and fix authentication"
echo.

REM Push to GitHub
echo Pushing to GitHub...
git push
echo.

if errorlevel 0 (
    echo ========================================
    echo   SUCCESS! Code redeployed to GitHub!
    echo ========================================
    echo.
    echo Latest changes:
    echo - Fixed signup/login authentication
    echo - Added role-based access control
    echo - Users can only access user features
    echo - Agents can access dashboard and post properties
    echo - Created settings page for all users
    echo.
) else (
    echo ========================================
    echo   Push failed!
    echo ========================================
    echo.
    echo Try running manually:
    echo   git add .
    echo   git commit -m "your message"
    echo   git push
    echo.
)

pause
