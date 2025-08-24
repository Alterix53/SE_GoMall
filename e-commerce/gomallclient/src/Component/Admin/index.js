// Layout Components
export { default as AdminLayout } from './components/AdminLayout';

// UI Components
export { default as AdminCard } from './components/AdminCard';
export { default as AdminDataTable } from './components/AdminDataTable';
export { default as AdminModal } from './components/AdminModal';

// Existing Components (keeping for backward compatibility)
export { default as SidebarNav } from './SidebarNav';
export { default as HeaderNavAdmin } from './HeaderNavAdmin';
export { default as DashboardOverview } from './DashboardOverview';
export { default as SummaryCard } from './SummaryCard';
export { default as StatsChart } from './StatsChart';
export { default as TrendingProductsTable } from './TrendingProductsTable';
export { default as RevenueDistributionTable } from './RevenueDistributionTable';
export { default as ProductDetailModal } from './ProductDetailModal';
export { default as UserDetailModal } from './UserDetailModal';
export { default as SellerDetailModal } from './SellerDetailModal';
export { default as AdminAvatarModal } from './AdminAvatarModal';

export { default as UserSellerListItem } from './UserSellerListItem';
export { default as PendingSellerRequests } from './PendingSellerRequests';
export { default as AdminLogin } from './AdminLogin';

// Page Components
export { default as DashboardPage } from './pages/DashboardPage';
export { default as ItemsPage } from './pages/ItemsPage';
export { default as ManageUserPage } from './pages/ManageUserPage';
export { default as ManageSellerPage } from './pages/ManageSellerPage';
export { default as PendingRequestPage } from './pages/PendingRequestPage';

// Hooks
export { useAdminAuth } from './hooks/useAdminAuth';
export { useAdminData } from './hooks/useAdminData';

// Utils
export * from './utils/adminUtils';

// Styles
import './styles/admin.css';
