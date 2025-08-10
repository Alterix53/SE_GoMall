import React, { useState, useEffect, useRef } from 'react';
import { createImageProps, preloadImage, handleImageError } from './imageUtils';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  style = {},
  fallbackUrl,
  lazy = true,
  preload = false,
  onLoad,
  onError,
  ...otherProps
}) => {
  const [imageSrc, setImageSrc] = useState(lazy ? null : src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // If not lazy loading, load immediately
    if (!lazy) {
      loadImage(src);
    }
  }, [src, lazy]);

  useEffect(() => {
    if (preload && src) {
      preloadImage(src).catch(() => {
        // Silently handle preload errors
      });
    }
  }, [preload, src]);

  const loadImage = async (imageUrl) => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      await preloadImage(imageUrl);
      setImageSrc(imageUrl);
      setIsLoading(false);
      
      if (onLoad) {
        onLoad();
      }
    } catch (error) {
      console.warn('Failed to load image:', imageUrl, error);
      setHasError(true);
      setIsLoading(false);
      
      if (onError) {
        onError(error);
      }
    }
  };

  const handleIntersection = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && lazy && !imageSrc && !hasError) {
        loadImage(src);
      }
    });
  };

  useEffect(() => {
    if (lazy && !imageSrc && !hasError && imgRef.current) {
      const observer = new IntersectionObserver(handleIntersection, {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1
      });
      
      observer.observe(imgRef.current);
      
      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }
  }, [lazy, imageSrc, hasError, src]);

  const handleImageError = (e) => {
    setHasError(true);
    setIsLoading(false);
    
    // Use fallback
    if (fallbackUrl && e.target.src !== fallbackUrl) {
      e.target.src = fallbackUrl;
    }
    
    if (onError) {
      onError(e);
    }
  };

  const finalSrc = hasError ? fallbackUrl : imageSrc;
  const finalClassName = `${className} ${isLoading ? 'image-loading' : ''} ${hasError ? 'image-error' : ''}`.trim();

  return (
    <img
      ref={imgRef}
      src={finalSrc}
      alt={alt || 'Image'}
      className={finalClassName}
      style={{
        ...style,
        opacity: isLoading ? 0.5 : 1,
        transition: 'opacity 0.3s ease-in-out'
      }}
      onError={handleImageError}
      onLoad={() => {
        setIsLoading(false);
        if (onLoad) onLoad();
      }}
      {...otherProps}
    />
  );
};

export default OptimizedImage;
