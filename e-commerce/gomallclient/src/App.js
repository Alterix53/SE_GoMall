import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './Component/Navbar/Navbar';         // Sửa từ ../Component/Navbar/Navbar
import Footer from './Component/Footer/Footer';        // Sửa từ ../Component/Footer/Footer
import Home from './Home';
import FlashSale from './Flash_sale';
import TopProduct from './TopProduct';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flash-sale" element={<FlashSale />} />
          <Route path="/top-products" element={<TopProduct />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;