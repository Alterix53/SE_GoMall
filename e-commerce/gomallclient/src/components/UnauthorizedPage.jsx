import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Component/Navbar/Navbar';
import Footer from '../Component/Footer/Footer';

const UnauthorizedPage = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card">
              <div className="card-body">
                <h1 className="text-danger mb-4">403</h1>
                <h2 className="mb-3">Error 403: forbidden</h2>
                <p className="text-muted mb-4">
                  You have no access on this page.
                  Contact website's administrators if this is an issue.
                </p>
                <div className="d-grid gap-2 d-md-block">
                  <Link to="/" className="btn btn-primary me-md-2">
                    Về trang chủ
                  </Link>
                  <Link to="/login" className="btn btn-outline-secondary">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UnauthorizedPage; 