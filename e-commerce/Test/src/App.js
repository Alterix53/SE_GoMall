import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import TestHome from './pages/TestHome';
import ComponentTestPage from './pages/ComponentTestPage';
import LayoutTestPage from './pages/LayoutTestPage';
import ResponsiveTestPage from './pages/ResponsiveTestPage';
import AutoTestPage from './pages/AutoTestPage';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="test-header">
          <h1>React Component Test Environment</h1>
          <p>Drag and drop your components here to test UI</p>
        </div>
        
        <nav className="test-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/component-test" className="nav-link">Component Test</Link>
          <Link to="/layout-test" className="nav-link">Layout Test</Link>
          <Link to="/responsive-test" className="nav-link">Responsive Test</Link>
          <Link to="/auto-test" className="nav-link">🔄 Auto Test</Link>
        </nav>

        <div className="test-container">
          <Routes>
            <Route path="/" element={<TestHome />} />
            <Route path="/component-test" element={<ComponentTestPage />} />
            <Route path="/layout-test" element={<LayoutTestPage />} />
            <Route path="/responsive-test" element={<ResponsiveTestPage />} />
            <Route path="/auto-test" element={<AutoTestPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 