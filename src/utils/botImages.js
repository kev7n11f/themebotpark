/**
 * Image configuration for ThemeBotPark bots
 * Update these paths once new images are generated and uploaded
 */

export const botImages = {
  // High-quality placeholder images (to be replaced with custom generated images)
  RainMaker: {
    homepage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512&h=512&fit=crop&crop=face',
    chatHeader: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=face', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    fallback: 'https://res.cloudinary.com/dphrjjzl7/image/upload/v1737447306/rainmaker-header_sqm8lk.jpg'
  },
  
  HeartSync: {
    homepage: 'https://images.unsplash.com/photo-1494790108755-2616c04f3d3a?w=512&h=512&fit=crop&crop=face',
    chatHeader: 'https://images.unsplash.com/photo-1494790108755-2616c04f3d3a?w=800&h=400&fit=crop&crop=face',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c04f3d3a?w=64&h=64&fit=crop&crop=face', 
    fallback: 'https://res.cloudinary.com/dphrjjzl7/image/upload/v1737447306/heartsync-header_h8m8lz.jpg'
  },
  
  FixItFrank: {
    homepage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=512&h=512&fit=crop&crop=face',
    chatHeader: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=400&fit=crop&crop=face',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    fallback: 'https://res.cloudinary.com/dphrjjzl7/image/upload/v1737447306/fixitfrank-header_awutmy.jpg'
  },
  
  TellItLikeItIs: {
    homepage: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=512&h=512&fit=crop&crop=face', 
    chatHeader: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=800&h=400&fit=crop&crop=face',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=64&h=64&fit=crop&crop=face',
    fallback: 'https://res.cloudinary.com/dphrjjzl7/image/upload/v1737447306/tellitlikeitis-header_pbgdpf.jpg'
  },
  
  SafeSpace: {
    homepage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=512&h=512&fit=crop&crop=face',
    chatHeader: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=400&fit=crop&crop=face', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
    fallback: 'https://ui-avatars.com/api/?name=SafeSpace&background=e0f2fe&color=0369a1&size=512'
  },
  
  CreativeCanvas: {
    homepage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f86?w=512&h=512&fit=crop&crop=face',
    chatHeader: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f86?w=800&h=400&fit=crop&crop=face',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f86?w=64&h=64&fit=crop&crop=face', 
    fallback: 'https://ui-avatars.com/api/?name=Creative+Canvas&background=fef3c7&color=d97706&size=512'
  },
  
  WellnessWise: {
    homepage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=512&h=512&fit=crop&crop=face',
    chatHeader: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=400&fit=crop&crop=face',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face',
    fallback: 'https://ui-avatars.com/api/?name=Wellness+Wise&background=dcfce7&color=16a34a&size=512'
  }
};

/**
 * Get bot image with fallback support
 * @param {string} botId - Bot identifier
 * @param {string} type - Image type: 'homepage', 'chatHeader', 'avatar'
 * @returns {string} Image URL
 */
export const getBotImage = (botId, type = 'homepage') => {
  const bot = botImages[botId];
  if (!bot) {
    console.warn(`No image config found for bot: ${botId}`);
    return '/images/default-bot.jpg';
  }
  
  // Return the requested type or fallback
  return bot[type] || bot.fallback || '/images/default-bot.jpg';
};

/**
 * Check if a bot has custom generated images
 * @param {string} botId - Bot identifier  
 * @returns {boolean} True if bot has custom images
 */
export const hasCustomImages = (botId) => {
  const bot = botImages[botId];
  return bot && bot.homepage && !bot.homepage.includes('ui-avatars.com');
};

/**
 * Image preloading function for better performance
 * @param {Array} imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

export default botImages;
