// import logo from './logo.svg';
import './App.css';
// import Header from './Component/Header/Header_Logged';
import HeaderNav from './Component/Header/HeaderNav';
import Footer from './Component/Footer';
import CategoryList from './Component/Category/CategoryList';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarNav from './Component/Admin/SidebarNav';
import Breadcrumbs from './Component/Admin/Breadcrumbs';
import DashboardPage from './Component/Admin/pages/DashboardPage';
import ManageUserPage from './Component/Admin/pages/ManageUserPage';
import ManageSellerPage from './Component/Admin/pages/ManageSellerPage';
import ItemsPage from './Component/Admin/pages/ItemsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Component/Login/login';
import SignUpPage from './Component/Signup/signup'; 
import SellerDashboard from './Component/Sellerdashboard/Sellerdashboard';
import Footer from './Component/Footer/Footer';

function AdminLayout() {
  return (
    <div className="d-flex">
      <SidebarNav />
      <div className="flex-grow-1 p-3">
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="ManageUser" element={<ManageUserPage />} />
          <Route path="ManageSeller" element={<ManageSellerPage />} />
          <Route path="Items" element={<ItemsPage />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <HeaderNav />
      <Routes>
        <Route path="/Admin/*" element={<AdminLayout />} />
        {/* Các route khác giữ nguyên layout cũ */}
        <Route path="/*" element={<CategoryList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/seller" element={<SellerDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
