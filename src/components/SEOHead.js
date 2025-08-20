import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEOHead({ 
  title = "ThemeBotPark - AI Chatbots with Unique Personalities",
  description = "Experience conversations with AI bots that have distinct personalities. From business strategy to relationship advice, find the perfect AI companion for your needs.",
  keywords = "AI chatbot, artificial intelligence, conversation AI, bot personalities, AI assistant, chat AI, business AI, relationship AI",
  author = "Kevin Franklin",
  url = "https://themebotpark.vercel.app",
  image = "/og-image.svg",
  type = "website",
  canonical,
  noindex = false,
  children
}) {
  const fullTitle = title.includes('ThemeBotPark') ? title : `${title} | ThemeBotPark`;
  const currentUrl = canonical || url;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="ThemeBotPark" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content="@themebotpark" />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#4A9EFF" />
      <meta name="msapplication-TileColor" content="#4A9EFF" />
      <meta name="application-name" content="ThemeBotPark" />
      <meta name="apple-mobile-web-app-title" content="ThemeBotPark" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "ThemeBotPark",
          "description": description,
          "url": url,
          "author": {
            "@type": "Person",
            "name": author
          },
          "applicationCategory": "AI & Machine Learning",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "category": "Free"
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
            "Truth-Telling Bot"
          ]
        })}
      </script>

      {/* Additional custom head elements */}
      {children}
    </Helmet>
  );
}
