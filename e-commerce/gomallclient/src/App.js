// import logo from './logo.svg';
import './App.css';
// import Header from './Component/Header/Header_Logged';
import HeaderNav from './Component/Header/Header_nav_unlogin';
import Footer from './Component/Footer';
import CategoryList from './Component/Category/CategoryList';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarNav from './Component/Admin/SidebarNav';
import Breadcrumbs from './Component/Admin/Breadcrumbs';
import DashboardPage from './Component/Admin/pages/DashboardPage';
import ManageUserPage from './Component/Admin/pages/ManageUserPage';
import ManageSellerPage from './Component/Admin/pages/ManageSellerPage';
import ItemsPage from './Component/Admin/pages/ItemsPage';

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
  );
}

function App() {
  return (
    <Router>
      <HeaderNav />
      <Routes>
        <Route path="/Admin/*" element={<AdminLayout />} />
        {/* Các route khác giữ nguyên layout cũ */}
        <Route path="/*" element={<CategoryList />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
