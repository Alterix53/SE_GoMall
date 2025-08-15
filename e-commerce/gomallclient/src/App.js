import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Components (User)
import Cart from './Component/Cart/Cart';
import Checkout from './Component/Checkout/Checkout';
import CategoryList from './Component/Category/CategoryList';
import SearchResult from './SearchResult';                 // Minh
import SearchBar from './Component/SearchBar/SearchBar';   // Minh (nếu dùng ở nơi khác)
import ProductCard from './Component/ProductCard/ProductCard'; // Minh (nếu dùng ở nơi khác)
import Footer from './Component/Footer/Footer';
import UserSettings from './Component/UserPage/UserSetting';
import ViewItemDetail from './Component/viewItemDetail';

// ✅ Product detail: default export là ProductDetailPage
import ProductDetailPage from './Component/ProductDetail/ProductDetail';

// Pages
import Home from './Home';
import FlashSale from './Flash_sale';
import TopProduct from './TopProduct';
import TodaySuggestions from './TodaySuggestions';

// Admin
import SidebarNav from './Component/Admin/SidebarNav';
import Breadcrumbs from './Component/Admin/Breadcrumbs';
import DashboardPage from './Component/Admin/pages/DashboardPage';
import ManageUserPage from './Component/Admin/pages/ManageUserPage';
import ManageSellerPage from './Component/Admin/pages/ManageSellerPage';
import ItemsPage from './Component/Admin/pages/ItemsPage';

// Auth
import LoginPage from './Component/Login/login';
import SignUpPage from './Component/Signup/signup';
import SellerDashboard from './Component/Sellerdashboard/Sellerdashboard';

// User
import UserPage from './Component/UserPage/UserPage';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './components/UnauthorizedPage';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Seller pages
import Statistics from './Component/Sellerdashboard/Statistics';
import ShippingStatus from './Component/Sellerdashboard/ShippingStatus';
import OrderDetail from './Component/Sellerdashboard/OrderDetail';
import RegisterSeller from './Component/RegisterSeller/RegisterSeller';
import Navbar from './Component/Navbar/Navbar';
import Suggestions from './Component/Suggestions/Suggestions';

// ✅ API service để gọi sản phẩm theo id
import ApiService from './utils/api';

// Adapter gọi API sản phẩm theo id (tuỳ ApiService của bạn)
async function fetchProductById(id) {
  const res = await ApiService.get(`/products/${id}`);
  // Nếu ApiService dùng axios, dữ liệu nằm trong res.data
  return res?.data ?? res;
}

// ------------- Layouts -------------
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const hideLayout = ['/login', '/signup', '/signin'].includes(location.pathname);
  return (
    <>
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};

function AdminLayout() {
  return (
    <div className="d-flex">
      <Navbar />
      <SidebarNav />
      <div className="flex-grow-1 p-3">
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="ManageUser" element={<ManageUserPage />} />
          <Route path="ManageUser/User" element={<ManageUserPage />} />
          <Route path="ManageSeller" element={<ManageSellerPage />} />
          <Route path="Items" element={<ItemsPage />} />
        </Routes>
      </div>
    </div>
  );
}

// ------------- App -------------
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <LayoutWrapper>
            <div className="App">
              <Routes>
                {/* Admin routes */}
                <Route
                  path="/Admin/*"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                />

                {/* Auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signin" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* User routes */}
                <Route path="/user" element={<UserPage />} />
                <Route path="/user/settings" element={<UserSettings />} />
                <Route path="/search" element={<SearchResult />} />

                {/* ✅ Product detail route (truyền fetchProductById) */}
                <Route
                  path="/product/:id"
                  element={<ProductDetailPage fetchProductById={fetchProductById} />}
                />

                <Route path="/cart" element={<Cart />} />
<<<<<<< HEAD

                {/* Seller routes */}
                <Route
                  path="/seller"
                  element={
                    <ProtectedRoute requiredRole="seller">
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/statistics"
                  element={
                    <ProtectedRoute requiredRole="seller">
                      <Statistics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/orders"
                  element={
                    <ProtectedRoute requiredRole="seller">
                      <ShippingStatus />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/orders/:id"
                  element={
                    <ProtectedRoute requiredRole="seller">
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Main routes */}
=======
                <Route path="/checkout" element={<Checkout />} />
                {/* SELLER ROUTES - có thể có layout riêng */}
                <Route path="/seller" element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/seller/statistics" element={
                  <ProtectedRoute requiredRole="seller">
                    <Statistics />
                  </ProtectedRoute>
                } />
                <Route path="/seller/orders" element={
                  <ProtectedRoute requiredRole="seller">
                    <ShippingStatus />
                  </ProtectedRoute>
                } />
                <Route path="/seller/orders/:id" element={
                  <ProtectedRoute requiredRole="seller">
                    <OrderDetail />
                  </ProtectedRoute>
                } />
                
                {/* Main routes - sử dụng Navbar và Footer */}
>>>>>>> 93964b0642fa00cbdfe90d723ad9d0e3f0c834de
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/flash-sale" element={<FlashSale />} />
                <Route path="/top-products" element={<TopProduct />} />
                <Route path="/today-suggestions" element={<TodaySuggestions />} />
                <Route path="/suggestions" element={<Suggestions />} />
                <Route path="/register-seller" element={<RegisterSeller />} />

                {/* Category */}
                <Route path="/category/*" element={<CategoryList />} />

                {/* Fallback */}
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
