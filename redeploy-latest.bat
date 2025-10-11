@echo off
echo ========================================
echo   Deploying Latest Updates to GitHub
echo ========================================
echo.

echo Latest Changes:
echo - Fixed property detail page (real data)
echo - Fixed dashboard (user-specific data)
echo - Added image upload to Supabase
echo - Added promotion system with admin approval
echo - Enhanced property actions
echo - All pages now use real Supabase data
echo.

echo Adding all changes...
git add .
echo.

echo Committing...
git commit -m "feat: Real data integration - images, promotions, enhanced actions"
echo.

echo Pushing to GitHub...
git push
echo.

if errorlevel 0 (
    echo ========================================
    echo   SUCCESS! Deployed to GitHub!
    echo ========================================
    echo.
    echo What was deployed:
    echo - Property pages with real data
    echo - Image upload to Supabase Storage
    echo - Promotion system with payment approval
    echo - Enhanced property management actions
    echo - Updated database schema
    echo.
    echo Next: Deploy to production (Vercel)
    echo.
) else (
    echo ========================================
    echo   Deployment failed!
    echo ========================================
    echo.
    echo Try manually:
    echo   git add .
    echo   git commit -m "feat: Real data integration"
    echo   git push
    echo.
)

pause
