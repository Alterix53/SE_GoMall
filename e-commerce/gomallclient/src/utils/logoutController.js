
import { adminAPI } from './api/index.js';
/**
 * Logout Controller - Handles logout functionality for both users and admins
 */
class LogoutController {
  /**
   * Perform logout for regular users
   * @param {Function} navigate - React Router navigate function
   * @param {Function} setUser - Function to clear user state
   * @param {Function} setToken - Function to clear token state
   * @returns {Promise<Object>} Result of logout operation
   */
  static async userLogout(navigate, setUser, setToken) {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Call server logout endpoint
        const response = await adminAPI.logout(token, false);
        
        if (!response.success) {
          console.warn('Server logout failed:', response.message);
        }
      }

      // Clear local storage
      this.clearLocalStorage();
      
      // Clear state
      if (setUser) setUser(null);
      if (setToken) setToken(null);
      
      // Navigate to login page
      if (navigate) {
        navigate('/login', { replace: true });
      }

      return { success: true, message: 'Logout successful' };
    } catch (error) {
      console.error('User logout error:', error);
      
      // Even if server call fails, clear local data
      this.clearLocalStorage();
      if (setUser) setUser(null);
      if (setToken) setToken(null);
      
      if (navigate) {
        navigate('/login', { replace: true });
      }

      return { success: false, message: 'Logout completed with warnings' };
    }
  }

  /**
   * Perform logout for admin users
   * @param {Function} navigate - React Router navigate function
   * @param {Function} setUser - Function to clear user state
   * @param {Function} setToken - Function to clear token state
   * @returns {Promise<Object>} Result of logout operation
   */
  static async adminLogout(navigate, setUser, setToken) {
    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      if (adminToken) {
        // Call server logout endpoint for admin
        const response = await adminAPI.logout(adminToken, true);
        
        if (!response.success) {
          console.warn('Admin server logout failed:', response.message);
        }
      }

      // Clear local storage
      this.clearLocalStorage();
      
      // Clear state
      if (setUser) setUser(null);
      if (setToken) setToken(null);
      
      // Navigate to admin login page
      if (navigate) {
        navigate('/admin/login', { replace: true });
      }

      return { success: true, message: 'Admin logout successful' };
    } catch (error) {
      console.error('Admin logout error:', error);
      
      // Even if server call fails, clear local data
      this.clearLocalStorage();
      if (setUser) setUser(null);
      if (setToken) setToken(null);
      
      if (navigate) {
        navigate('/admin/login', { replace: true });
      }

      return { success: false, message: 'Admin logout completed with warnings' };
    }
  }

  /**
   * Clear all authentication-related data from localStorage
   */
  static clearLocalStorage() {
    const keysToRemove = [
      'token',
      'adminToken',
      'user',
      'isLoggedIn',
      'cart',
      'cartItems',
      'userPreferences',
      'lastActivity'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // Also clear sessionStorage if any auth data is stored there
    const sessionKeysToRemove = [
      'tempToken',
      'sessionData'
    ];

    sessionKeysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });
  }

  /**
   * Force logout (emergency logout when token is invalid)
   * @param {Function} navigate - React Router navigate function
   * @param {Function} setUser - Function to clear user state
   * @param {Function} setToken - Function to clear token state
   */
  static forceLogout(navigate, setUser, setToken) {
    console.warn('Force logout initiated - clearing all auth data');
    
    this.clearLocalStorage();
    
    if (setUser) setUser(null);
    if (setToken) setToken(null);
    
    // Determine redirect based on current path
    const currentPath = window.location.pathname;
    const isAdminPath = currentPath.includes('/admin') || currentPath.includes('/Admin');
    
    if (navigate) {
      const redirectPath = isAdminPath ? '/admin/login' : '/login';
      navigate(redirectPath, { replace: true });
    } else {
      // Fallback if navigate is not available
      window.location.href = isAdminPath ? '/admin/login' : '/login';
    }
  }

  /**
   * Check if user should be logged out due to inactivity
   * @param {number} timeoutMinutes - Minutes of inactivity before auto logout
   * @returns {boolean} True if user should be logged out
   */
  static shouldAutoLogout(timeoutMinutes = 30) {
    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) return false;

    const now = Date.now();
    const lastActivityTime = parseInt(lastActivity);
    const timeoutMs = timeoutMinutes * 60 * 1000;

    return (now - lastActivityTime) > timeoutMs;
  }

  /**
   * Update last activity timestamp
   */
  static updateLastActivity() {
    localStorage.setItem('lastActivity', Date.now().toString());
  }

  /**
   * Initialize activity tracking
   */
  static initActivityTracking() {
    // Update activity on user interactions
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const updateActivity = () => {
      this.updateLastActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check for inactivity periodically
    setInterval(() => {
      if (this.shouldAutoLogout()) {
        console.warn('Auto logout due to inactivity');
        this.forceLogout(null, null, null);
      }
    }, 60000); // Check every minute
  }
}

export default LogoutController;