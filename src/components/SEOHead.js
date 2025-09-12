import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEOHead({ 
  title = "ThemeBotPark - AI Chatbots with Unique Personalities",
  description = "Experience conversations with AI bots that have distinct personalities. From business strategy to relationship advice, find the perfect AI companion for your needs.",
  keywords = "AI chatbot, artificial intelligence, conversation AI, bot personalities, AI assistant, chat AI, business AI, relationship AI",
  author = "Kevin Franklin",
  url = "https://themebotpark.vercel.app",
  image = "https://themebotpark.vercel.app/og-image.svg",
  type = "website",
  canonical,
  noindex = false,
  jsonLd,
  children
}) {
  const fullTitle = title.includes('ThemeBotPark') ? title : `${title} | ThemeBotPark`;
  const currentUrl = canonical || url;

  // Enhanced structured data
  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ThemeBotPark",
    "description": description,
    "url": url,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "category": "SaaS"
    },
    "author": {
      "@type": "Person", 
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "ThemeBotPark",
      "url": url
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "AI Chat Conversations",
      "Multiple Bot Personalities", 
      "Business Strategy Bot",
      "Relationship Advice Bot",
      "Technical Support Bot",
      "Direct Feedback Bot",
      "Conflict Mediation Bot",
      "Creative Inspiration Bot",
      "Wellness Coaching Bot"
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large"} />
      <link rel="canonical" href={currentUrl} />

      {/* Performance & Mobile Optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="ThemeBotPark" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ThemeBotPark" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@themebotpark" />
      <meta name="twitter:site" content="@themebotpark" />

      {/* Theme & Branding */}
      <meta name="theme-color" content="#4A9EFF" />
      <meta name="msapplication-TileColor" content="#4A9EFF" />
      <meta name="application-name" content="ThemeBotPark" />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://api.openai.com" />
      <link rel="dns-prefetch" href="https://vercel.com" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>

      {/* Additional custom head elements */}
      {children}
    </Helmet>
  );
}
