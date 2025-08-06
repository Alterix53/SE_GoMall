import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    fullName: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 100
    },
    phoneNumber: { 
        type: String,
        trim: true
    },
    role: { 
        type: String, 
        default: 'admin',
        enum: ['admin', 'super_admin']
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    lastLogin: { 
        type: Date 
    },
    permissions: [{
        type: String,
        enum: [
            'user_management',
            'seller_management', 
            'product_management',
            'order_management',
            'category_management',
            'system_management',
            'dashboard_view',
            'reports_view'
        ]
    }],
    avatarUrl: { 
        type: String 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

// Pre-save middleware to update updatedAt
adminSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Method to check if admin has specific permission
adminSchema.methods.hasPermission = function(permission) {
    return this.permissions.includes(permission) || this.role === 'super_admin';
};

// Method to get admin info without password
adminSchema.methods.toSafeObject = function() {
    const admin = this.toObject();
    delete admin.password;
    return admin;
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;