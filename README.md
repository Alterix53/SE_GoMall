# GoMall – Full Stack E-Commerce Platform

<div align="center">
A modern full-stack e-commerce platform built with the MERN stack, featuring secure authentication, online payments, product management, and a responsive user experience.

</div>

---

## Overview

GoMall is an e-commerce website built with **React**, **Node.js**, **Express**, and **MongoDB**. It provides a complete shopping flow with user authentication, product browsing, cart handling, order management, and payment integration.

---

## Features

### User Features
- User registration and login with JWT authentication
- Secure password hashing
- Browse and search products
- Filter products by category
- Add items to cart
- Checkout flow
- View order history
- Responsive UI for desktop and mobile

### Admin Features
- Admin dashboard
- Product CRUD management
- Order management
- User management
- Inventory tracking

### Payment Integration
- MoMo payment gateway integration
- Secure payment processing
- Payment status tracking

---

## Tech Stack

### Frontend
- React 18
- React Router
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

### Dev Tools
- Git & GitHub
- Postman
- Nodemon

---

## Project Structure

```bash
SE_GoMall/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── package.json
├── package.json
└── README.md
```

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/Alterix53/SE_GoMall.git
cd SE_GoMall
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key
MOMO_PARTNER_CODE=your_partner_code
```

---

## Running the Project

### Start the backend
```bash
cd backend
npm run dev
```

### Start the frontend
```bash
cd frontend
npm start
```

---

## API Endpoints

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
```

### Products
```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders
```http
POST /api/orders
GET  /api/orders/my-orders
```

---

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- Secure payment validation

---

## Future Improvements

- Product reviews and ratings
- Wishlist functionality
- Real-time notifications
- Docker deployment
- CI/CD pipeline
- AI-powered recommendations

---

## Contributing

Contributions are welcome.

1. Fork the project
2. Create your feature branch:
```bash
git checkout -b feature/AmazingFeature
```
3. Commit your changes:
```bash
git commit -m "Add AmazingFeature"
```
4. Push to the branch:
```bash
git push origin feature/AmazingFeature
```
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

**Alterix53**
- Repository: https://github.com/Alterix53/SE_GoMall
