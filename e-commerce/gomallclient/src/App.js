// import logo from './logo.svg';
import './App.css';
import HeaderNav from './Component/Header/HeaderNav';
import Footer from './Component/Footer/Footer';
import CategoryList from './Component/Category/CategoryList';
import Navbar from './Component/Navbar/Navbar';

// Import các component chính
import Home from './Home';
import FlashSale from './Flash_sale';
import TopProduct from './TopProduct';

<<<<<<< HEAD
// Import các component Admin
import SidebarNav from './Component/Admin/SidebarNav';
import Breadcrumbs from './Component/Admin/Breadcrumbs';
import DashboardPage from './Component/Admin/pages/DashboardPage';
import ManageUserPage from './Component/Admin/pages/ManageUserPage';
import ManageSellerPage from './Component/Admin/pages/ManageSellerPage';
import ItemsPage from './Component/Admin/pages/ItemsPage';

// Import các component Auth
import LoginPage from './Component/Login/login';
import SignUpPage from './Component/Signup/signup';
import SellerDashboard from './Component/Sellerdashboard/Sellerdashboard';
import UserPage from './Component/UserPage/UserPage';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './components/UnauthorizedPage';

// Import AuthContext
import { AuthProvider } from './contexts/AuthContext';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function AdminLayout() {
=======

function App() {
>>>>>>> Homepage_topP
  return (
    <div className="d-flex">
      <Navbar />
      <SidebarNav />
      <div className="flex-grow-1 p-3">
        <Breadcrumbs />
        <Routes>
<<<<<<< HEAD
          <Route path="/" element={<DashboardPage />} />
          <Route path="ManageUser" element={<ManageUserPage />} />
          <Route path="ManageUser/User" element={<ManageUserPage />} />
          <Route path="ManageSeller" element={<ManageSellerPage />} />
          <Route path="Items" element={<ItemsPage />} />
=======
          <Route path="/" element={<Home />} />
          <Route path="/flash-sale" element={<FlashSale />} />
          <Route path="/top-products" element={<TopProduct />} />
          
>>>>>>> Homepage_topP
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Sử dụng Navbar mới cho các trang chính */}
          <Routes>
            {/* Admin routes - sử dụng layout riêng */}
            <Route path="/Admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            } />
            
            {/* Auth routes - không có navbar */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* User routes - có navbar và footer */}
            <Route path="/user" element={
              <>
                <Navbar />
                <UserPage />
                <Footer />
              </>
            } />
            
            {/* Seller routes - có thể có layout riêng */}
            <Route path="/seller" element={
              <ProtectedRoute requiredRole="seller">
                <SellerDashboard />
              </ProtectedRoute>
            } />
            
            {/* Main routes - sử dụng Navbar và Footer */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            } />
            <Route path="/flash-sale" element={
              <>
                <Navbar />
                <FlashSale />
                <Footer />
              </>
            } />
            <Route path="/top-products" element={
              <>
                <Navbar />
                <TopProduct />
                <Footer />
              </>
            } />
            
            {/* Category routes - sử dụng Navbar và Footer */}
            <Route path="/category/*" element={
              <>
                <Navbar />
                <CategoryList />
                <Footer />
              </>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
