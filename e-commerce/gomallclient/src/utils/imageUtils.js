// Utility functions for image handling

/**
 * Get the correct image URL with fallback
 * @param {string} imageUrl - The original image URL
 * @param {string} fallbackUrl - Fallback URL if image is not available
 * @returns {string} The processed image URL
 */
export const getImageUrl = (imageUrl, fallbackUrl = "/images/default-product.jpg") => {
  if (!imageUrl) return fallbackUrl;
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path starting with /uploads, add server URL
  if (imageUrl.startsWith('/uploads')) {
    return `http://localhost:8080${imageUrl}`;
  }
  
  // If it's a relative path starting with /images, return as is
  if (imageUrl.startsWith('/images')) {
    return imageUrl;
  }
  
  // Default fallback
  return fallbackUrl;
};

/**
 * Handle image error with fallback
 * @param {Event} e - The error event
 * @param {string} fallbackUrl - Fallback URL
 */
export const handleImageError = (e, fallbackUrl = "/images/default-product.jpg") => {
  console.error("Image load error, falling back to default:", e.target.src);
  // Prevent infinite loop by checking if we're already using fallback
  if (e.target.src !== fallbackUrl) {
    e.target.src = fallbackUrl;
  }
};

/**
 * Create an image element with proper error handling
 * @param {Object} props - Image props
 * @returns {Object} Image element props
 */
export const createImageProps = (props) => {
  const {
    src,
    alt,
    className,
    style,
    fallbackUrl = "/images/default-product.jpg",
    ...otherProps
  } = props;

  return {
    src: getImageUrl(src, fallbackUrl),
    alt: alt || "Product image",
    className,
    style,
    onError: (e) => handleImageError(e, fallbackUrl),
    ...otherProps
  };
};
