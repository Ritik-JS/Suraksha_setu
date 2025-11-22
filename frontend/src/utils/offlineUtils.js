// Offline/PWA utilities

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

export const checkOnlineStatus = () => {
  return navigator.onLine;
};

export const setupOnlineStatusListeners = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

export const cacheData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error caching data:', error);
    return false;
  }
};

export const getCachedData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
};

export const clearCache = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
};
