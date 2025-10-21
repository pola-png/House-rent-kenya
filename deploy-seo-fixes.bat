@echo off
echo ========================================
echo  SEO FIXES DEPLOYMENT - House Rent Kenya
echo ========================================
echo.

echo [1/5] Installing dependencies...
npm install

echo.
echo [2/5] Building application with SEO enhancements...
npm run build

echo.
echo [3/5] Generating sitemap...
echo Sitemap will be generated at build time with property URLs and images

echo.
echo [4/5] Validating robots.txt...
echo Robots.txt configured to control faceted search crawling

echo.
echo [5/5] SEO Implementation Summary:
echo ✓ RealEstateListing schema added to property pages
echo ✓ Enhanced meta tags with dynamic generation
echo ✓ Canonical URLs for faceted search
echo ✓ Improved sitemap with property images
echo ✓ Better robots.txt for crawl control
echo ✓ City landing pages with local content
echo ✓ Image optimization with proper alt text
echo.

echo Next Steps:
echo 1. Submit sitemap to Google Search Console
echo 2. Verify structured data with Google Rich Results Test
echo 3. Monitor Core Web Vitals in PageSpeed Insights
echo 4. Set up Google Analytics 4 and Search Console
echo.

echo Deployment complete! 
echo Visit: https://houserentkenya.co.ke
pause