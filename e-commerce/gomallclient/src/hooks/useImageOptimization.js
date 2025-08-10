import { useEffect } from 'react';
import { initLazyLoading, getCacheStats, clearImageCache } from '../utils/imageUtils';

/**
 * Hook để quản lý việc tối ưu hóa hình ảnh
 */
export const useImageOptimization = () => {
  useEffect(() => {
    // Khởi tạo lazy loading khi component mount
    initLazyLoading();

    // Cleanup khi component unmount
    return () => {
      // Có thể thêm cleanup logic ở đây nếu cần
    };
  }, []);

  // Trả về các utility functions
  return {
    getCacheStats,
    clearImageCache,
    initLazyLoading
  };
};

/**
 * Hook để preload hình ảnh
 * @param {string[]} imageUrls - Danh sách URL hình ảnh cần preload
 */
export const useImagePreload = (imageUrls = []) => {
  useEffect(() => {
    if (imageUrls.length === 0) return;

    // Preload tất cả hình ảnh
    const preloadPromises = imageUrls.map(url => {
      if (url) {
        return import('../utils/imageUtils').then(({ preloadImage }) => 
          preloadImage(url).catch(() => {
            // Silently handle preload errors
          })
        );
      }
      return Promise.resolve();
    });

    // Không cần await vì chúng ta chỉ muốn bắt đầu preload
    Promise.all(preloadPromises);

    return () => {
      // Cleanup nếu cần
    };
  }, [imageUrls]);
};
