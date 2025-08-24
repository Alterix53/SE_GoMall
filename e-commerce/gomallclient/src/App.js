import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './utils/imageOptimization.css';

import { useImageOptimization } from './hooks/useImageOptimization';

import Cart from './Component/Cart/Cart';
import Checkout from './Component/Checkout/Checkout';
import CategoryList from './Component/Category/CategoryList';
//import Navbar from './Component/Navbar/Navbar'; bị dư rồi
import SearchResult from "./SearchResult";    // Minh
import SearchBar from './Component/SearchBar/SearchBar';    // Minh
import ProductCard from './Component/ProductCard/ProductCard';    // Minh
import Footer from './Component/Footer/Footer';
import UserPage from './Component/UserPage/UserPage';
// view item detail
import ViewItemDetail from './Component/viewItemDetail';
import ProductDetail from './Component/ProductDetail/ProductDetail';

// Import các component chính
import Home from './Home';
import FlashSale from './Flash_sale';
import TopProduct from './TopProduct';
import TodaySuggestions from './TodaySuggestions';

// Import các component Admin
import { 
  AdminLayout,
  DashboardPage,
  ManageUserPage,
  ManageSellerPage,
  ItemsPage,
  PendingRequestPage,
  AdminLogin
} from './Component/Admin';

// Import các component Auth
import LoginPage from './Component/Login/login';
import SignUpPage from './Component/Signup/signup';
import ForgotPassword from './Component/Login/ForgotPassword';
import ResetPassword from './Component/Login/ResetPassword';
import SellerDashboard from './Component/Sellerdashboard/Sellerdashboard';

// 
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedSellerRouteV2 from './components/ProtectedSellerRouteV2';
import UnauthorizedPage from './components/UnauthorizedPage';

// Import AuthContext
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from "./contexts/CartContext";

// seller
import Statistics from './Component/Sellerdashboard/Statistics';
import ShippingStatus from './Component/Sellerdashboard/ShippingStatus';
import OrderDetail from './Component/Sellerdashboard/OrderDetail';
import RegisterSeller from './Component/RegisterSeller/RegisterSeller';
import Header from './Component/Header/Header';
import Suggestions from './Component/Suggestions/Suggestions';

// Import Payment Result components
import PaymentSuccess from './Component/PaymentResult/PaymentSuccess';
import PaymentFailed from './Component/PaymentResult/PaymentFailed';
import PaymentCancelled from './Component/PaymentResult/PaymentCancelled';
import CashPaymentSuccess from './Component/PaymentResult/CashPaymentSuccess';
import TestPaymentPage from './Component/PaymentResult/TestPaymentPage';

// Import Order and Invoice components
import OrderView from './Component/OrderView/OrderView';
import InvoiceDownload from './Component/InvoiceDownload/InvoiceDownload';


const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const isAdminRoute = path.startsWith('/admin');
  const isSellerRoute = path.startsWith('/seller');
  const isAuthRoute = ['/login', '/signin', '/signup', '/admin/login', '/forgot-password', '/reset-password'].includes(path);

  // Visibility rules
  // - Admin & Seller: no Header, no Footer
  // - Auth (login/signin/signup/forgot/reset): no Header, Footer visible
  // - Others: show both
  const showHeader = !isAdminRoute && !isSellerRoute && !isAuthRoute;
  const showFooter = !isAdminRoute && !isSellerRoute; // includes auth pages

  return (
    <>
      {showHeader && <Header />}
      {children}
      {showFooter && <Footer />}
    </>
  );
};

function AdminLayoutWrapper() {
  return (
    <AdminLayout title="Admin Dashboard" breadcrumbs={['Admin']}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="ManageUser" element={<ManageUserPage />} />
        <Route path="ManageSeller" element={<ManageSellerPage />} />
        <Route path="pendingrequest" element={<PendingRequestPage />} />
        <Route path="Items" element={<ItemsPage />} />
      </Routes>
    </AdminLayout>
  );
}

function App() {
  // Khởi tạo tối ưu hóa hình ảnh
  useImageOptimization();

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <LayoutWrapper>
            <div className="App">
              {/* Sử dụng Navbar mới cho các trang chính */}
              <Routes>
                {/* Admin routes - sử dụng layout riêng */}
                <Route path="/Admin/*" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayoutWrapper />
                  </ProtectedRoute>
                } />
                
                {/* Auth routes - không có navbar */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signin" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/admin/login" element={
                  <div className="admin-theme">
                    <AdminLogin />
                  </div>
                } />

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                
                {/* User routes - có navbar và footer */}
                <Route path="/user" element={<UserPage />} />
                <Route path="/user/settings" element={<UserPage />} /> {/* Redirect to /user */}
                <Route path="/search" element={<SearchResult />} /> {/* Route cho tìm kiếm */}  {/* Minh */}
                
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                
                {/* Payment Result Routes */}
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/failed" element={<PaymentFailed />} />
                <Route path="/payment/cancelled" element={<PaymentCancelled />} />
                <Route path="/payment/cash-success" element={<CashPaymentSuccess />} />
                <Route path="/payment/test" element={<TestPaymentPage />} />
                
                {/* Order and Invoice Routes */}
                <Route path="/orders" element={<OrderView />} />
                <Route path="/invoice" element={<InvoiceDownload />} />
                
                {/* SELLER ROUTES - có thể có layout riêng */}
                <Route path="/seller" element={
                  <ProtectedSellerRouteV2>
                    <SellerDashboard />
                  </ProtectedSellerRouteV2>
                } />
                <Route path="/seller-dashboard" element={
                  <ProtectedSellerRouteV2>
                    <SellerDashboard />
                  </ProtectedSellerRouteV2>
                } />
                <Route path="/seller/statistics" element={
                  <ProtectedSellerRouteV2>
                    <Statistics />
                  </ProtectedSellerRouteV2>
                } />
                <Route path="/seller/orders" element={
                  <ProtectedSellerRouteV2>
                    <ShippingStatus />
                  </ProtectedSellerRouteV2>
                } />
                <Route path="/seller/orders/:id" element={
                  <ProtectedSellerRouteV2>
                    <OrderDetail />
                  </ProtectedSellerRouteV2>
                } />
                
                {/* Main routes - sử dụng Navbar và Footer */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/flash-sale" element={<FlashSale />} />
                <Route path="/top-products" element={<TopProduct />} />
                <Route path="/today-suggestions" element={<TodaySuggestions />} />
                <Route path="/suggestions" element={<Suggestions />} />
                <Route path="/register-seller" element={<RegisterSeller />} />
                
                {/* Category routes - sử dụng Navbar và Footer */}
                <Route path="/category" element={<CategoryList />} />
                <Route path="/category/:name" element={<CategoryList />} />
                
                {/* Fallback route */}
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
          </LayoutWrapper>
        </Router>
      </CartProvider>
    </AuthProvider>

  );
}

export default App;
