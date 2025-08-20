import React from "react";
import { NavLink } from "react-router-dom";
import "./SidebarNav.css";

// thanh tab bên trái điều hướng các danh mục cần quản lý
function SidebarNav() {
  return (
    <nav className="admin-sidebar">
      {/* Sidebar Header */}
      <div className="admin-sidebar-header">
        <h1 className="admin-sidebar-title">
          <i className="fas fa-shield-alt"></i>
          Admin Panel
        </h1>
      </div>

      {/* Navigation Menu */}
      <div className="admin-sidebar-nav">
        <ul className="admin-sidebar-list">
          {/* Dashboard */}
          <li className="admin-sidebar-item">
            <NavLink 
              to="/Admin/" 
              end 
              className={({ isActive }) => 
                `admin-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <i className="fas fa-tachometer-alt"></i>
              Dashboard
            </NavLink>
          </li>
          
          {/* Manage Customers Section */}
          <li className="admin-sidebar-item">
            <div className="admin-sidebar-section">
              <div className="admin-sidebar-section-title">
                Manage Customers
              </div>
              <ul className="admin-sidebar-submenu">
                <li className="admin-sidebar-item">
                  <NavLink 
                    to="/Admin/ManageUser" 
                    className={({ isActive }) => 
                      `admin-sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <i className="fas fa-users"></i>
                    View Customers
                  </NavLink>
                </li>
                <li className="admin-sidebar-item">
                  <NavLink 
                    to="/Admin/reportedusers" 
                    className={({ isActive }) => 
                      `admin-sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <i className="fas fa-exclamation-triangle"></i>
                    Reported Users
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/* Manage Sellers Section */}
          <li className="admin-sidebar-item">
            <div className="admin-sidebar-section">
              <div className="admin-sidebar-section-title">
                Manage Sellers
              </div>
              <ul className="admin-sidebar-submenu">
                <li className="admin-sidebar-item">
                  <NavLink 
                    to="/Admin/ManageSeller" 
                    className={({ isActive }) => 
                      `admin-sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <i className="fas fa-store"></i>
                    View Sellers
                  </NavLink>
                </li>
                <li className="admin-sidebar-item">
                  <NavLink 
                    to="/Admin/pendingrequest" 
                    className={({ isActive }) => 
                      `admin-sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <i className="fas fa-clock"></i>
                    Pending Requests
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          {/* Manage Items Section */}
          <li className="admin-sidebar-item">
            <NavLink 
              to="/Admin/Items" 
              className={({ isActive }) => 
                `admin-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <i className="fas fa-box"></i>
              Manage Items
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default SidebarNav; 