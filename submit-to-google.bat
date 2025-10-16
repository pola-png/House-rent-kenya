@echo off
echo Submitting sitemap to Google...
curl -X GET "https://www.google.com/ping?sitemap=https://houserentkenya.co.ke/sitemap.xml"
echo.
echo Sitemap submitted to Google Search Console
pause