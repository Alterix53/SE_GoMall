import React, { useState, useEffect } from 'react';
import { useProductCache } from '../../hooks/useProductCache';
import './CacheManager.css';

const CacheManager = () => {
  const { clearCache, invalidateCache } = useProductCache();
  const [cacheInfo, setCacheInfo] = useState({
    totalItems: 0,
    totalSize: 0,
    oldestItem: null,
    newestItem: null,
  });

  // Get cache information
  const getCacheInfo = () => {
    try {
      const keys = Object.keys(localStorage);
      const productCacheKeys = keys.filter(key => key.startsWith('product_cache_'));
      
      let totalSize = 0;
      let oldestTimestamp = Date.now();
      let newestTimestamp = 0;
      let oldestKey = '';
      let newestKey = '';

      productCacheKeys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          const size = new Blob([item]).size;
          totalSize += size;

          try {
            const { timestamp } = JSON.parse(item);
            if (timestamp < oldestTimestamp) {
              oldestTimestamp = timestamp;
              oldestKey = key;
            }
            if (timestamp > newestTimestamp) {
              newestTimestamp = timestamp;
              newestKey = key;
            }
          } catch (error) {
            console.error('Error parsing cache item:', error);
          }
        }
      });

      setCacheInfo({
        totalItems: productCacheKeys.length,
        totalSize: totalSize,
        oldestItem: oldestKey ? {
          key: oldestKey,
          timestamp: new Date(oldestTimestamp).toLocaleString(),
        } : null,
        newestItem: newestKey ? {
          key: newestKey,
          timestamp: new Date(newestTimestamp).toLocaleString(),
        } : null,
      });
    } catch (error) {
      console.error('Error getting cache info:', error);
    }
  };

  useEffect(() => {
    getCacheInfo();
  }, []);

  const handleClearAllCache = () => {
    clearCache();
    getCacheInfo();
    alert('Cache đã được xóa!');
  };

  const handleClearExpiredCache = () => {
    try {
      const keys = Object.keys(localStorage);
      const productCacheKeys = keys.filter(key => key.startsWith('product_cache_'));
      let clearedCount = 0;

      productCacheKeys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const { timestamp } = JSON.parse(item);
            const now = Date.now();
            const ttl = 5 * 60 * 1000; // 5 minutes

            if (now - timestamp > ttl) {
              localStorage.removeItem(key);
              clearedCount++;
            }
          } catch (error) {
            console.error('Error checking cache item:', error);
          }
        }
      });

      getCacheInfo();
      alert(`Cleared ${clearedCount} expired cache items!`);
    } catch (error) {
      console.error('Error clearing expired cache:', error);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="cache-manager">
      <div className="cache-header">
        <h3>🔄 Cache Management</h3>
        <p className="cache-description">
          Cache helps speed up data loading and reduce server load
        </p>
      </div>

      <div className="cache-stats">
        <div className="stat-item">
          <span className="stat-label">Total items:</span>
          <span className="stat-value">{cacheInfo.totalItems}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total size:</span>
          <span className="stat-value">{formatBytes(cacheInfo.totalSize)}</span>
        </div>
        {cacheInfo.oldestItem && (
          <div className="stat-item">
            <span className="stat-label">Oldest item:</span>
            <span className="stat-value">{cacheInfo.oldestItem.timestamp}</span>
          </div>
        )}
        {cacheInfo.newestItem && (
          <div className="stat-item">
            <span className="stat-label">Newest item:</span>
            <span className="stat-value">{cacheInfo.newestItem.timestamp}</span>
          </div>
        )}
      </div>

      <div className="cache-actions">
        <button 
          className="btn btn-warning"
          onClick={handleClearExpiredCache}
          disabled={cacheInfo.totalItems === 0}
        >
          🗑️ Clear Expired Cache
        </button>
        <button 
          className="btn btn-danger"
          onClick={handleClearAllCache}
          disabled={cacheInfo.totalItems === 0}
        >
          🗑️ Clear All Cache
        </button>
        <button 
          className="btn btn-info"
          onClick={getCacheInfo}
        >
          🔄 Refresh Information
        </button>
      </div>

      <div className="cache-info">
        <h4>ℹ️ Cache Information:</h4>
        <ul>
          <li>Cache has a time-to-live (TTL) of 5 minutes</li>
          <li>Data is stored in browser's localStorage</li>
          <li>Cache is automatically refreshed when expired</li>
          <li>You can manually clear cache if needed</li>
        </ul>
      </div>
    </div>
  );
};

export default CacheManager; 