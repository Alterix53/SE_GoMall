import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = path.join(process.cwd(), 'uploads');
const productImagesDir = path.join(uploadDir, 'products');
const documentsDir = path.join(uploadDir, 'documents');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(productImagesDir)) {
    fs.mkdirSync(productImagesDir, { recursive: true });
}
if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir, { recursive: true });
}

// Cấu hình storage cho multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, productImagesDir);
    },
    filename: (req, file, cb) => {
        // Tạo tên file unique với timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `product-${uniqueSuffix}${ext}`);
    }
});

// Filter để chỉ cho phép upload ảnh
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép upload file ảnh (jpeg, jpg, png, gif, webp)'), false);
    }
};

// Cấu hình multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
        files: 10 // Tối đa 10 file
    },
    fileFilter: fileFilter
});

// Middleware upload nhiều ảnh
export const uploadProductImages = upload.array('images', 10);

// Middleware upload ảnh đơn
export const uploadSingleImage = upload.single('image');

// Cấu hình storage cho document upload
const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `document-${uniqueSuffix}${ext}`);
    }
});

// Filter cho document upload
const documentFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'application/pdf' || 
                    file.mimetype.startsWith('image/') ||
                    file.mimetype.includes('document');

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép upload file PDF, DOC, DOCX hoặc ảnh'), false);
    }
};

// Cấu hình multer cho document
const documentUpload = multer({
    storage: documentStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Giới hạn 10MB
        files: 1 // Chỉ 1 file
    },
    fileFilter: documentFilter
});

// Middleware upload document
export const uploadDocument = documentUpload.single('document');

// Middleware xử lý lỗi upload
export const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File quá lớn. Kích thước tối đa là 5MB'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Quá nhiều file. Tối đa 10 file'
            });
        }
    }
    
    if (error.message.includes('Chỉ cho phép upload file ảnh')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    next(error);
};

export default upload; 