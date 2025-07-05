import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function SidebarNav() {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  return (
    <nav className="sidebar-nav" style={{ minWidth: 200, borderRight: '1px solid #eee', height: '100vh', padding: '2rem 1rem' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ marginBottom: '1rem' }}>
          <NavLink to="/Admin/" end style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#007bff' : '#333', textDecoration: 'none' })}>
            Dashboard
          </NavLink>
        </li>
        <li style={{ marginBottom: '1rem' }}>
          <div
            style={{ cursor: 'pointer', fontWeight: openUserMenu ? 'bold' : 'normal', color: openUserMenu ? '#007bff' : '#333' }}
            onClick={() => setOpenUserMenu((prev) => !prev)}
          >
            Manage Users {openUserMenu ? '▲' : '▼'}
          </div>
          {openUserMenu && (
            <ul style={{ listStyle: 'none', paddingLeft: 16, marginTop: 8 }}>
              <li style={{ marginBottom: 6 }}>
                <NavLink to="/Admin/ManageUser" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#007bff' : '#333', textDecoration: 'none' })}>
                  Xem thành viên
                </NavLink>
              </li>
              <li>
                <NavLink to="/Admin/ManageUser/reported" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#007bff' : '#333', textDecoration: 'none' })}>
                  Thành viên bị báo cáo
                </NavLink>
              </li>
            </ul>
          )}
        </li>
        <li style={{ marginBottom: '1rem' }}>
          <NavLink to="/Admin/ManageSeller" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#007bff' : '#333', textDecoration: 'none' })}>
            Manage Sellers
          </NavLink>
        </li>
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