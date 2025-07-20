import React from "react";
import { NavLink } from "react-router-dom";

function SidebarNav() {
  return (
    <nav className="sidebar-nav" style={{ minWidth: 200, borderRight: '1px solid #eee', height: '100vh', padding: '2rem 1rem' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ marginBottom: '1rem' }}>
          <NavLink to="/Admin/" end style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#007bff' : '#333', textDecoration: 'none' })}>
            Danh mục quản lý
          </NavLink>
        </li>
        
        {/* Manage Customers Section */}
        <li style={{ marginBottom: '1rem' }}>
          <div
            style={{ 
              fontWeight: 'bold',
              color: '#666',
              opacity: 0.6,
              pointerEvents: 'none',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}
          >
            Manage Customers
          </div>
          <ul style={{ listStyle: 'none', paddingLeft: 16, margin: 0 }}>
            <li style={{ marginBottom: 6 }}>
              <NavLink to="/Admin/viewcustomer" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#007bff' : '#333', textDecoration: 'none' })}>
                View Customers
              </NavLink>
            </li>
            <li>
              <NavLink to="/Admin/reportedusers" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#007bff' : '#333', textDecoration: 'none' })}>
                Reported Users
              </NavLink>
            </li>
          </ul>
        </li>

        {/* Manage Sellers Section */}
        <li style={{ marginBottom: '1rem' }}>
          <div
            style={{ 
              fontWeight: 'bold',
              color: '#666',
              opacity: 0.6,
              pointerEvents: 'none',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}
          >
            Manage Sellers
          </div>
          <ul style={{ listStyle: 'none', paddingLeft: 16, margin: 0 }}>
            <li style={{ marginBottom: 6 }}>
              <NavLink to="/Admin/viewseller" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#007bff' : '#333', textDecoration: 'none' })}>
                View Sellers
              </NavLink>
            </li>
            <li>
              <NavLink to="/Admin/pendingrequest" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#007bff' : '#333', textDecoration: 'none' })}>
                Pending Request
              </NavLink>
            </li>
          </ul>
        </li>

        {/* Manage Items Section */}
        <li style={{ marginBottom: '1rem' }}>
          <NavLink to="/Admin/Items" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#007bff' : '#333', textDecoration: 'none' })}>
            Manage Items
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default SidebarNav; 