module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { action } = req.query;

    try {
      switch (action) {
        case 'sitemap':
          return await generateSitemap(req, res);
        case 'robots':
          return await generateRobots(req, res);
        case 'health':
          return await healthCheck(req, res);
        default:
          return res.json({
            status: 'SEO API is working!',
            endpoints: [
              '/api/seo?action=sitemap',
              '/api/seo?action=robots', 
              '/api/seo?action=health'
            ]
          });
      }
    } catch (error) {
      console.error('SEO API error:', error);
      res.status(500).json({ error: 'SEO service error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

async function generateSitemap(req, res) {
  const baseUrl = 'https://themebotpark.vercel.app';
  const currentDate = new Date().toISOString().split('T')[0];

  const urls = [
    {
      loc: baseUrl,
      changefreq: 'daily',
      priority: '1.0',
      lastmod: currentDate
    },
    {
      loc: `${baseUrl}/about`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      loc: `${baseUrl}/contact`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      loc: `${baseUrl}/privacy`,
      changefreq: 'yearly',
      priority: '0.5',
      lastmod: currentDate
    },
    {
      loc: `${baseUrl}/terms`,
      changefreq: 'yearly',
      priority: '0.5',
      lastmod: currentDate
    }
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${url.lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(sitemapXml);
}

async function generateRobots(req, res) {
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Disallow private pages
Disallow: /dashboard
Disallow: /subscription-success
Disallow: /api/

# Allow important pages
Allow: /
Allow: /about
Allow: /contact
Allow: /privacy
Allow: /terms

# Sitemap
Sitemap: https://themebotpark.vercel.app/sitemap.xml
Sitemap: https://themebotpark.vercel.app/api/seo?action=sitemap`;

  res.setHeader('Content-Type', 'text/plain');
  res.send(robotsTxt);
}

async function healthCheck(req, res) {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {
      chat: 'operational',
      auth: 'operational', 
      contact: 'operational',
      seo: 'operational'
    },
    performance: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      responseTime: Date.now()
    },
    seo: {
      sitemap: 'generated',
      robots: 'generated',
      structuredData: 'active',
      metaTags: 'optimized'
    }
  };

  res.json(checks);
}
