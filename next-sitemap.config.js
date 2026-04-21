/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://houserentkenya.co.ke',
  generateRobotsTxt: false, // We have custom robots.txt
  generateIndexSitemap: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/admin/*', '/api/*', '/signup/*', '/login', '/reset-password', '/forgot-password'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
  },
};
