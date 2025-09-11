/**
 * Image optimization utilities for ThemeBotPark
 */

/**
 * Generate WebP URLs with fallback support
 * @param {string} imageUrl - Original image URL
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {object} WebP and fallback URLs
 */
// Helper to check if a URL is from Unsplash (including subdomains)
function isUnsplashUrl(urlString) {
  try {
    const { hostname } = new URL(urlString);
    return (
      hostname === "unsplash.com" ||
      hostname.endsWith(".unsplash.com")
    );
  } catch {
    return false;
  }
}

export const getOptimizedImageUrls = (imageUrl, width = 512, height = 512) => {
  // For Unsplash images, add format and optimization parameters
  if (isUnsplashUrl(imageUrl)) {
    const webpUrl = `${imageUrl}&w=${width}&h=${height}&fit=crop&crop=face&fm=webp&q=80`;
    const fallbackUrl = `${imageUrl}&w=${width}&h=${height}&fit=crop&crop=face&fm=jpg&q=85`;
    
    return { webpUrl, fallbackUrl };
  }
  
  // For other URLs, return as-is
  return { webpUrl: imageUrl, fallbackUrl: imageUrl };
};

/**
 * Create a picture element with WebP and fallback sources
 * @param {string} imageUrl - Base image URL
 * @param {string} alt - Alt text
 * @param {string} className - CSS class
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {JSX.Element} Picture element
 */
export const OptimizedImage = ({ 
  imageUrl, 
  alt, 
  className = '', 
  width = 512, 
  height = 512,
  onError = null 
}) => {
  const { webpUrl, fallbackUrl } = getOptimizedImageUrls(imageUrl, width, height);
  
  return (
    <picture>
      <source srcSet={webpUrl} type="image/webp" />
      <img 
        src={fallbackUrl}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="lazy"
        onError={onError}
      />
    </picture>
  );
};

/**
 * Preload critical images for better performance
 * @param {Array} imageUrls - Array of image URLs to preload
 */
export const preloadCriticalImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const { webpUrl, fallbackUrl } = getOptimizedImageUrls(url);
    
    // Preload WebP version
    const webpLink = document.createElement('link');
    webpLink.rel = 'preload';
    webpLink.as = 'image';
    webpLink.href = webpUrl;
    webpLink.type = 'image/webp';
    document.head.appendChild(webpLink);
    
    // Preload fallback version
    const fallbackLink = document.createElement('link');
    fallbackLink.rel = 'preload';
    fallbackLink.as = 'image';
    fallbackLink.href = fallbackUrl;
    fallbackLink.type = 'image/jpeg';
    document.head.appendChild(fallbackLink);
  });
};

export default { getOptimizedImageUrls, OptimizedImage, preloadCriticalImages };
