// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: 'token',
  ADMIN_TOKEN_KEY: 'adminToken',
  USER_KEY: 'user',
  IS_LOGGED_IN_KEY: 'isLoggedIn',
  AUTO_LOGOUT_MINUTES: 30,
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SELLER: 'seller',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH_ON_DELIVERY: 'cash_on_delivery',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  E_WALLET: 'e_wallet',
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
};

// Seller Status
export const SELLER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned',
  SUSPENDED: 'suspended',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  EMAIL_MAX_LENGTH: 100,
  PHONE_MAX_LENGTH: 15,
  NAME_MAX_LENGTH: 100,
  ADDRESS_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/Admin',
  USER_PROFILE: '/user',
  USER_SETTINGS: '/user', // Redirect to /user instead of /user/settings
  CART: '/cart',
  CHECKOUT: '/checkout',
  PRODUCT_DETAIL: '/product',
  SEARCH: '/search',
  CATEGORY: '/category',
};

// Admin Routes
export const ADMIN_ROUTES = {
  DASHBOARD: '/Admin',
  USERS: '/Admin/ManageUser',
  SELLERS: '/Admin/ManageSeller',
  PRODUCTS: '/Admin/Items',
  ORDERS: '/Admin/Orders',
  CATEGORIES: '/Admin/Categories',
  REPORTS: '/Admin/Reports',
  SETTINGS: '/Admin/Settings',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  ADMIN_TOKEN: 'adminToken',
  USER: 'user',
  IS_LOGGED_IN: 'isLoggedIn',
  CART: 'cart',
  CART_ITEMS: 'cartItems',
  USER_PREFERENCES: 'userPreferences',
  LAST_ACTIVITY: 'lastActivity',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Language
export const LANGUAGE = {
  VI: 'vi',
  EN: 'en',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#6366f1',
  SECONDARY: '#64748b',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  LIGHT: '#f8fafc',
  DARK: '#1e293b',
};

// Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
};

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Z-Index Levels
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập.',
  FORBIDDEN: 'Truy cập bị từ chối.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
  TIMEOUT_ERROR: 'Yêu cầu hết thời gian chờ.',
  UNKNOWN_ERROR: 'Đã xảy ra lỗi không xác định.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công.',
  LOGOUT_SUCCESS: 'Đăng xuất thành công.',
  REGISTER_SUCCESS: 'Đăng ký thành công.',
  UPDATE_SUCCESS: 'Cập nhật thành công.',
  DELETE_SUCCESS: 'Xóa thành công.',
  CREATE_SUCCESS: 'Tạo thành công.',
  SAVE_SUCCESS: 'Lưu thành công.',
  UPLOAD_SUCCESS: 'Tải lên thành công.',
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Trường này là bắt buộc.',
  EMAIL: 'Email không hợp lệ.',
  PASSWORD_MIN: `Mật khẩu phải có ít nhất ${VALIDATION.PASSWORD_MIN_LENGTH} ký tự.`,
  PASSWORD_MAX: `Mật khẩu không được quá ${VALIDATION.PASSWORD_MAX_LENGTH} ký tự.`,
  USERNAME_MIN: `Tên đăng nhập phải có ít nhất ${VALIDATION.USERNAME_MIN_LENGTH} ký tự.`,
  USERNAME_MAX: `Tên đăng nhập không được quá ${VALIDATION.USERNAME_MAX_LENGTH} ký tự.`,
  PHONE: 'Số điện thoại không hợp lệ.',
  CONFIRM_PASSWORD: 'Mật khẩu xác nhận không khớp.',
  FILE_SIZE: `Kích thước file không được quá ${FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB.`,
  FILE_TYPE: 'Loại file không được hỗ trợ.',
};
