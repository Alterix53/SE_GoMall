function Header_Unlogged() {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top px-4">
            <div className="container-fluid">
                {/* Bên trái */}
                <div className="d-flex align-items-center">
                    <a class="navbar-brand fw-bold me-2" href="#">
                    {/* them src anh vao */}
                    <img src="#" alt="Logo" width="30" height="24" class="d-inline-block align-text-top"/>
                        GoMall
                    </a>
                    <span className="text-muted d-none d-sm-inline">Enhance your shopping experience</span>
                </div>
                {/*phần search */}
                <nav class="navbar bg-body-tertiary">
                    <div class="container-fluid">
                        <form class="d-flex" role="search">
                        <input class="form-control me-3"  type="search" placeholder="Search" aria-label="Search"/>
                        <button class="btn btn-outline-secondary" type="submit">Search</button>
                        </form>
                    </div>
                </nav>
                {/* Nút toggle cho mobile */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarRightContent" aria-controls="navbarRightContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Bên phải */}
                <div className="collapse navbar-collapse justify-content-end pe-4" id="navbarRightContent">
                    <ul className="navbar-nav mb-2 mb-lg-0 align-items-lg-center">
                        <li className="nav-item">
                            <a className="nav-link" href="#">Login</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Sign Up</a>
                        </li>
                        <li className="nav-item dropdown">
                            <button class="btn btn-white dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                More
                            </button>
                            <ul class="dropdown-menu dropdown-menu-dark">
                                <li><a class="dropdown-item" href="#">About Us</a></li>
                                <li><a class="dropdown-item" href="#">FAQ</a></li>
                                <li><hr class="dropdown-divider" /></li>
                                <li><a class="dropdown-item" href="#">Seller Sign Up</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header_Unlogged;
