import React from 'react';
import SidebarNav from '../SidebarNav';
import HeaderNavAdmin from '../HeaderNavAdmin';
import './AdminLayout.css';

const AdminLayout = ({ children, title, breadcrumbs = [] }) => {
  return (
    <div className="admin-layout">
      <SidebarNav />
      <div className="admin-main">
        <HeaderNavAdmin />
        <main className="admin-content">
          <div className="admin-content-header">
            <h1 className="admin-page-title">{title}</h1>
            {breadcrumbs.length > 0 && (
              <nav className="admin-breadcrumbs">
                {breadcrumbs.map((crumb, index) => (
                  <span key={index} className="breadcrumb-item">
                    {index > 0 && <span className="breadcrumb-separator">/</span>}
                    {crumb}
                  </span>
                ))}
              </nav>
            )}
          </div>
          <div className="admin-content-body">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
