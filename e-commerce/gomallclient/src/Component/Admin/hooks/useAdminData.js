import { useState, useEffect, useCallback, useRef } from 'react';

export const useAdminData = (fetchFunction, dependencies = [], options = {}) => {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retryAttempts = 3,
    retryDelay = 1000,
    autoFetch = true,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  
  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);

  const isDataStale = useCallback(() => {
    if (!lastFetched) return true;
    return Date.now() - lastFetched > cacheTime;
  }, [lastFetched, cacheTime]);

  const fetchData = useCallback(async (force = false) => {
    if (!force && !isDataStale() && data) {
      return { success: true, data };
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    retryCountRef.current = 0;

    const attemptFetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchFunction(abortControllerRef.current.signal);
        
        if (result.success) {
          setData(result.data);
          setLastFetched(Date.now());
          retryCountRef.current = 0;
          return { success: true, data: result.data };
        } else {
          throw new Error(result.message || 'Failed to fetch data');
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          return { success: false, error: 'Request cancelled' };
        }

        retryCountRef.current++;
        
        if (retryCountRef.current < retryAttempts) {
          // Retry after delay
          await new Promise(resolve => setTimeout(resolve, retryDelay * retryCountRef.current));
          return attemptFetch();
        } else {
          setError(err.message);
          return { success: false, error: err.message };
        }
      } finally {
        setLoading(false);
      }
    };

    return attemptFetch();
  }, [fetchFunction, isDataStale, data, retryAttempts, retryDelay]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
    setLastFetched(null);
  }, []);

  const updateData = useCallback((updater) => {
    setData(prevData => {
      if (typeof updater === 'function') {
        return updater(prevData);
      }
      return updater;
    });
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  return {
    data,
    loading,
    error,
    lastFetched,
    fetchData,
    refresh,
    clearData,
    updateData,
    isDataStale,
  };
};
