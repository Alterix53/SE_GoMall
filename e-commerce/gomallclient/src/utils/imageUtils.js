// Utility functions for image handling with optimized caching and placeholder system

// Cache for loaded images to prevent repeated requests
const imageCache = new Map();
const failedImages = new Set();

// Base URLs
const SERVER_URL = 'http://localhost:8080';
const PLACEHOLDER_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';

/**
 * Get the correct image URL with fallback
 * @param {string} imageUrl - The original image URL
 * @param {string} fallbackUrl - Fallback URL if image is not available
 * @returns {string} The processed image URL
 */
export const getImageUrl = (imageUrl, fallbackUrl = PLACEHOLDER_URL) => {
  if (!imageUrl) return fallbackUrl;
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path starting with /uploads, add server URL
  if (imageUrl.startsWith('/uploads')) {
    return `${SERVER_URL}${imageUrl}`;
  }
  
  // If it's a relative path starting with /images, return as is
  if (imageUrl.startsWith('/images')) {
    return imageUrl;
  }
  
  // Default fallback
  return fallbackUrl;
};

/**
 * Preload image and cache it
 * @param {string} imageUrl - The image URL to preload
 * @returns {Promise} Promise that resolves when image is loaded
 */
export const preloadImage = (imageUrl) => {
  if (!imageUrl || failedImages.has(imageUrl)) {
    return Promise.reject(new Error('Image failed to load previously'));
  }

  if (imageCache.has(imageUrl)) {
    return Promise.resolve(imageCache.get(imageUrl));
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      imageCache.set(imageUrl, img);
      resolve(img);
    };
    
    img.onerror = () => {
      failedImages.add(imageUrl);
      reject(new Error(`Failed to load image: ${imageUrl}`));
    };
    
    img.src = getImageUrl(imageUrl);
  });
};

/**
 * Handle image error with optimized fallback
 * @param {Event} e - The error event
 * @param {string} fallbackUrl - Fallback URL
 * @param {boolean} preventInfiniteLoop - Prevent infinite error loop
 */
export const handleImageError = (e, fallbackUrl = PLACEHOLDER_URL, preventInfiniteLoop = true) => {
  const target = e.target;
  const currentSrc = target.src;
  
  // Prevent infinite loop
  if (preventInfiniteLoop && (currentSrc === fallbackUrl || failedImages.has(currentSrc))) {
    target.src = PLACEHOLDER_URL;
    return;
  }
  
  // Add to failed images set
  failedImages.add(currentSrc);
  
  // Use fallback
  target.src = fallbackUrl;
  
  console.warn(`Image failed to load: ${currentSrc}, using fallback`);
};

/**
 * Create an optimized image element with proper error handling and lazy loading
 * @param {Object} props - Image props
 * @returns {Object} Image element props
 */
export const createImageProps = (props) => {
  const {
    src,
    alt,
    className,
    style,
    fallbackUrl = PLACEHOLDER_URL,
    lazy = true,
    ...otherProps
  } = props;

  const imageUrl = getImageUrl(src, fallbackUrl);
  
  return {
    src: lazy ? PLACEHOLDER_URL : imageUrl,
    'data-src': lazy ? imageUrl : undefined,
    alt: alt || "Product image",
    className: `${className || ''} ${lazy ? 'lazy-image' : ''}`.trim(),
    style,
    onError: (e) => handleImageError(e, fallbackUrl),
    onLoad: lazy ? (e) => {
      // Remove lazy class when loaded
      e.target.classList.remove('lazy-image');
    } : undefined,
    ...otherProps
  };
};

/**
 * Initialize lazy loading for images
 */
export const initLazyLoading = () => {
  const lazyImages = document.querySelectorAll('.lazy-image[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
};

/**
 * Clear image cache
 */
export const clearImageCache = () => {
  imageCache.clear();
  failedImages.clear();
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  return {
    cached: imageCache.size,
    failed: failedImages.size
  };
};

/**
 * Create a placeholder image URL with custom dimensions
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Placeholder text
 * @returns {string} Data URL for placeholder
 */
export const createPlaceholderUrl = (width = 200, height = 200, text = 'Image') => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#999" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
