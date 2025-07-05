import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
<<<<<<< HEAD
// import Header from './Component/Header/Header_Logged';
import HeaderNav from './Component/Header/HeaderNav';
import Footer from './Component/Footer';
import CategoryList from './Component/Category/CategoryList';
=======
import Navbar from './Component/Navbar/Navbar';         // Sửa từ ../Component/Navbar/Navbar
import Footer from './Component/Footer/Footer';        // Sửa từ ../Component/Footer/Footer
import Home from './Home';
import FlashSale from './Flash_sale';
import TopProduct from './TopProduct';
>>>>>>> Homepage_topP

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
<<<<<<< HEAD
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
=======
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flash-sale" element={<FlashSale />} />
          <Route path="/top-products" element={<TopProduct />} />
        </Routes>
        <Footer />
      </div>
>>>>>>> Homepage_topP
    </Router>
  );
}

export default App;