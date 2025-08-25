# Seller Dashboard - Logic Lấy Product List

## Tổng quan

Trong Seller Dashboard, logic lấy product list được thiết kế để **chỉ hiển thị các sản phẩm thuộc về seller đang đăng nhập**. Đây là một hệ thống phân quyền dựa trên `sellerID` để đảm bảo mỗi seller chỉ có thể xem và quản lý sản phẩm của mình.

## Luồng hoạt động

### 1. Xác thực và Phân quyền

```javascript
// Middleware: requireApprovedSeller
export const requireApprovedSeller = async (req, res, next) => {
    // 1. Kiểm tra user đã đăng nhập
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // 2. Kiểm tra user có role 'seller'
    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
    if (!userRoles.includes('seller')) {
        return res.status(403).json({ success: false, message: 'Seller access required' });
    }

    // 3. Kiểm tra seller account đã được approve và active
    const seller = await Seller.findOne({ userID: req.user._id }).select('status isActive');
    if (!seller || seller.status !== 'approved' || seller.isActive === false) {
        return res.status(403).json({ success: false, message: 'Seller account not approved or inactive' });
    }

    next();
};
```

### 2. API Endpoint

```javascript
// Route: GET /api/products/seller/my-products
router.get('/seller/my-products', requireApprovedSeller, getProductsBySeller);
```

### 3. Controller Logic

```javascript
// Controller: getProductsBySeller
export const getProductsBySeller = ResponseHandler.asyncHandler(async (req, res) => {
    console.log("Request to get products by seller:", req.user._id);
    try {
        // Gọi service với sellerID của user đang đăng nhập
        const products = await productService.getProductsBySeller(req.user._id, req.query);
        ResponseHandler.success(res, products, "Lấy danh sách sản phẩm của người bán thành công");
    } catch (error) {
        console.error("Error getting seller products:", error);
        throw error;
    }
});
```

### 4. Service Logic

```javascript
// Service: getProductsBySeller
async getProductsBySeller(sellerId, query = {}) {
    const { page = 1, limit = 12 } = query;
    
    // Filter chỉ lấy sản phẩm của seller cụ thể
    const filter = { sellerID: sellerId };
    
    // Có thể filter thêm theo trạng thái active
    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === 'true';
    }
    
    // Query database với filter
    const products = await Product.find(filter)
        .populate("categoryID", "categoryName slug")
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .lean();
    
    const total = await Product.countDocuments(filter);
    
    return {
        products: this.addDiscountToProducts(products),
        pagination: {
            current: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total,
            limit: Number(limit),
        },
    };
}
```

## Cấu trúc Database

### Product Model
```javascript
// Mỗi product có field sellerID để xác định chủ sở hữu
{
    _id: ObjectId,
    name: String,
    price: {
        original: Number,
        sale: Number
    },
    sellerID: ObjectId,  // ← Đây là key để filter
    categoryID: ObjectId,
    description: String,
    images: Array,
    inventory: {
        quantity: Number,
        lowStockThreshold: Number
    },
    isActive: Boolean,
    createdAt: Date
}
```

### Seller Model
```javascript
{
    _id: ObjectId,
    userID: ObjectId,  // Reference đến User
    status: String,    // 'pending', 'approved', 'rejected'
    isActive: Boolean,
    // ... other fields
}
```

## Client-side Logic

### Hook: useSellerProducts
```javascript
// Fetch products from server
const fetchProductsFromServer = async () => {
    try {
        console.log('🌐 Fetching products from server...');
        // API call tự động gửi token trong header
        const response = await apiClient.get('/products/seller/my-products');
        
        if (response.success && response.data && response.data.products) {
            const serverProducts = response.data.products.map(product => ({
                id: generateSafeId(product._id),
                name: product.name,
                price: product.price?.original || product.price,
                category: product.categoryID?.categoryName || 'Unknown',
                categoryID: product.categoryID?._id || product.categoryID,
                description: product.description || '',
                image: imageUrl,
                images: images,
                stock: product.inventory?.quantity || product.stock || 0,
                sellerID: product.sellerID,  // ← Được giữ lại từ server
                serverId: product._id,
                status: product.isActive ? 'active' : 'paused',
                isOffline: false,
                createdAt: product.createdAt
            }));
            
            return serverProducts;
        }
        return [];
    } catch (error) {
        console.error('❌ Error fetching products from server:', error);
        setServerError(error.message);
        return [];
    }
};
```

## Bảo mật và Phân quyền

### 1. Authentication
- Sử dụng JWT token để xác thực user
- Token được gửi trong header `Authorization: Bearer <token>`

### 2. Authorization
- Kiểm tra user có role `seller`
- Kiểm tra seller account đã được approve
- Kiểm tra seller account đang active

### 3. Data Isolation
- Mỗi seller chỉ thấy sản phẩm của mình thông qua filter `sellerID`
- Không thể truy cập sản phẩm của seller khác

### 4. CRUD Operations
```javascript
// Tất cả operations đều kiểm tra sellerID
async updateProduct(productId, updateData, sellerId) {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Sản phẩm không tồn tại");
    }
    // Kiểm tra quyền sở hữu
    if (product.sellerID.toString() !== sellerId.toString()) {
        throw new Error("Không có quyền cập nhật sản phẩm này");
    }
    // ... update logic
}
```

## Offline Mode

Hệ thống cũng hỗ trợ offline mode với localStorage:

```javascript
// Load products from localStorage khi offline
const loadProductsFromStorage = () => {
    try {
        const savedProducts = localStorage.getItem(STORAGE_KEY);
        if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
        return initialProducts;
    } catch (error) {
        return initialProducts;
    }
};

// Merge server products với local products
const mergeProducts = (serverProducts, localProducts) => {
    const merged = [...serverProducts];
    const serverIds = new Set(serverProducts.map(p => p.serverId));
    
    // Thêm local products chưa có trên server
    localProducts.forEach(localProduct => {
        if (!localProduct.serverId || !serverIds.has(localProduct.serverId)) {
            merged.push(localProduct);
        }
    });
    
    return merged;
};
```

## Kết luận

Logic lấy product list trong Seller Dashboard được thiết kế với:

1. **Bảo mật cao**: Xác thực và phân quyền chặt chẽ
2. **Data isolation**: Mỗi seller chỉ thấy sản phẩm của mình
3. **Offline support**: Hoạt động được khi không có internet
4. **Pagination**: Hỗ trợ phân trang cho danh sách lớn
5. **Real-time sync**: Đồng bộ dữ liệu giữa client và server

Đây là một pattern phổ biến trong các hệ thống multi-tenant, đảm bảo tính bảo mật và riêng tư dữ liệu cho từng seller.
