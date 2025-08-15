# 🚀 MoMo Payment Gateway - GoMall E-commerce

## 📋 Tổng Quan

Hệ thống MoMo Payment Gateway được tích hợp vào GoMall để xử lý thanh toán qua ví điện tử MoMo. Đây là một **mock API** hoàn chỉnh, giả lập đầy đủ quy trình thanh toán như MoMo thật.

## ✨ Tính Năng Chính

### 🔐 Xác Thực & Bảo Mật
- JWT Authentication cho tất cả API endpoints
- Signature verification cho callback từ MoMo
- Role-based access control
- Secure payment data handling

### 💳 Quy Trình Thanh Toán
- **Tạo giao dịch**: Khởi tạo payment session
- **QR Code**: Hiển thị mã QR để quét (placeholder)
- **Real-time status**: Polling trạng thái giao dịch
- **Callback handling**: Xử lý response từ MoMo
- **IPN (Instant Payment Notification)**: Webhook endpoint

### 📊 Quản Lý Giao Dịch
- Lịch sử giao dịch của user
- Chi tiết giao dịch
- Hủy giao dịch
- Trạng thái giao dịch real-time

### 🧪 Testing & Development
- Simulate MoMo responses
- Mock payment scenarios
- Testing endpoints
- Health check

## 🏗️ Kiến Trúc Hệ Thống

### Backend (Node.js + Express)
```
server/
├── models/
│   └── MomoPayment.js          # MoMo Payment Model
├── services/
│   └── momoPaymentService.js   # Business Logic
├── controllers/
│   └── momoPaymentController.js # API Controllers
├── routes/
│   └── momoPaymentRoutes.js    # API Routes
└── Server.js                    # Main server (updated)
```

### Frontend (React.js)
```
gomallclient/src/
├── utils/
│   └── momoPaymentAPI.js       # API Service
├── Component/
│   ├── MomoPayment/            # Payment UI
│   ├── PaymentResult/          # Result Pages
│   └── PaymentHistory/         # Transaction History
```

## 🚀 Cài Đặt & Chạy

### 1. Backend Setup
```bash
cd e-commerce/server
npm install
npm start
```

### 2. Frontend Setup
```bash
cd e-commerce/gomallclient
npm install
npm start
```

### 3. Database
```bash
# MongoDB sẽ tự động tạo collection 'momo_payments'
# Không cần migration scripts
```

## 📡 API Endpoints

### Public Endpoints (Không cần auth)
```
POST /api/momo/callback    # MoMo callback
POST /api/momo/ipn        # Instant Payment Notification
GET  /api/momo/health     # Health check
```

### Protected Endpoints (Cần JWT auth)
```
POST   /api/momo/create           # Tạo giao dịch mới
GET    /api/momo/status/:id      # Kiểm tra trạng thái
GET    /api/momo/user            # Lịch sử giao dịch user
DELETE /api/momo/cancel/:id      # Hủy giao dịch
GET    /api/momo/:id             # Chi tiết giao dịch
```

### Testing Endpoints
```
POST /api/momo/simulate          # Simulate MoMo response
```

## 💰 Quy Trình Thanh Toán

### 1. Tạo Giao Dịch
```javascript
// Frontend
const response = await momoPaymentAPI.createPayment(
    orderID,    // ID đơn hàng
    amount,     // Số tiền
    orderInfo   // Mô tả đơn hàng
);

// Response
{
    success: true,
    data: {
        paymentUrl: "https://test-payment.momo.vn/...",
        requestId: "MOMO_1234567890_abc123",
        orderId: "order_id",
        amount: 100000,
        orderInfo: "Thanh toan don hang..."
    }
}
```

### 2. Hiển Thị QR Code
- Component `MomoPayment` hiển thị QR placeholder
- Countdown timer 5 phút
- Real-time status updates

### 3. Xử Lý Callback
```javascript
// MoMo gửi callback đến
POST /api/momo/callback
{
    "partnerCode": "MOMO",
    "orderId": "order_id",
    "requestId": "MOMO_1234567890_abc123",
    "amount": 100000,
    "transId": "MOMO_1234567890",
    "resultCode": 0,  // 0: success, 1000: failed
    "message": "Success"
}
```

### 4. Cập Nhật Trạng Thái
- Backend xử lý callback
- Cập nhật payment status
- Cập nhật order status
- Frontend nhận được update qua polling

## 🧪 Testing

### Simulate Payment Success
```bash
curl -X POST http://localhost:8080/api/momo/simulate \
  -H "Content-Type: application/json" \
  -d '{"requestId": "MOMO_1234567890_abc123", "resultCode": 0}'
```

### Simulate Payment Failed
```bash
curl -X POST http://localhost:8080/api/momo/simulate \
  -H "Content-Type: application/json" \
  -d '{"requestId": "MOMO_1234567890_abc123", "resultCode": 1000}'
```

### Health Check
```bash
curl http://localhost:8080/api/momo/health
```

## 🎨 UI Components

### 1. MomoPayment Component
- QR Code placeholder
- Payment information
- Status indicator
- Countdown timer
- Action buttons

### 2. Payment Result Components
- **PaymentSuccess**: Thanh toán thành công
- **PaymentFailed**: Thanh toán thất bại  
- **PaymentCancelled**: Giao dịch bị hủy

### 3. PaymentHistory Component
- Danh sách giao dịch
- Pagination
- Status badges
- Search & filter

## 🔧 Cấu Hình

### Environment Variables
```env
# Backend (.env)
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=iPXneGmrYHP
MOMO_SECRET_KEY=at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_IPN_URL=http://localhost:8080/api/momo/ipn
MOMO_REDIRECT_URL=http://localhost:3000/payment/result
```

### Frontend Configuration
```javascript
// src/utils/momoPaymentAPI.js
const MOMO_API_BASE = 'http://localhost:8080/api/momo';
```

## 📱 Responsive Design

- **Desktop**: Full layout với sidebar
- **Tablet**: Adaptive layout
- **Mobile**: Mobile-first design
- **Touch-friendly**: Optimized cho mobile

## 🚨 Error Handling

### Common Errors
- **400**: Missing required fields
- **401**: Unauthorized (JWT invalid)
- **404**: Payment not found
- **500**: Internal server error

### Error Messages
- User-friendly error messages
- Vietnamese language support
- Retry mechanisms
- Fallback options

## 🔒 Security Features

- **JWT Authentication**: Secure API access
- **Signature Verification**: Validate MoMo callbacks
- **Input Validation**: Sanitize all inputs
- **Rate Limiting**: Prevent abuse
- **CORS**: Configured for development

## 📊 Monitoring & Logging

### Logs
- Payment creation logs
- Callback processing logs
- Error logs with stack traces
- Performance metrics

### Health Checks
- Service status monitoring
- Database connectivity
- API response times
- Error rates

## 🚀 Deployment

### Production Checklist
- [ ] Remove testing endpoints
- [ ] Update environment variables
- [ ] Configure SSL certificates
- [ ] Set up monitoring
- [ ] Performance testing
- [ ] Security audit

### Docker Support
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Workflow
1. Create feature branch từ `Develop_AddSomeUI1`
2. Implement changes
3. Test thoroughly
4. Create pull request
5. Code review
6. Merge to main branch

### Code Standards
- ESLint configuration
- Prettier formatting
- Consistent naming conventions
- Comprehensive error handling
- Unit tests (recommended)

## 📚 Tài Liệu Tham Khảo

- [MoMo API Documentation](https://developers.momo.vn/)
- [Express.js Documentation](https://expressjs.com/)
- [React.js Documentation](https://reactjs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🆘 Support

### Contact Information
- **Email**: support@gomall.com
- **Phone**: 1900-1234
- **Documentation**: [Internal Wiki]
- **Issues**: [GitHub Issues]

### Common Issues
1. **Payment timeout**: Kiểm tra network và retry
2. **JWT expired**: Re-login để lấy token mới
3. **Database connection**: Kiểm tra MongoDB status
4. **CORS issues**: Verify frontend URL configuration

---

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] Basic MoMo payment flow
- [x] Mock API endpoints
- [x] Frontend components
- [x] Payment result pages

### Phase 2 (Next)
- [ ] Real MoMo integration
- [ ] Advanced security features
- [ ] Analytics dashboard
- [ ] Multi-currency support

### Phase 3 (Future)
- [ ] Other payment methods
- [ ] Subscription payments
- [ ] Refund management
- [ ] Advanced reporting

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainer**: GoMall Development Team
