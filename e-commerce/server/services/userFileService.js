import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn đến file users.json
const usersFilePath = path.join(__dirname, '../../data/users.json');

class UserFileService {
    constructor() {
        this.ensureFileExists();
    }

    // Đảm bảo file tồn tại
    ensureFileExists() {
        const dir = path.dirname(usersFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        if (!fs.existsSync(usersFilePath)) {
            fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2));
        }
    }

    // Đọc tất cả users từ file
    readUsers() {
        try {
            const data = fs.readFileSync(usersFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading users file:', error);
            return [];
        }
    }

    // Ghi users vào file
    writeUsers(users) {
        try {
            fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
            return true;
        } catch (error) {
            console.error('Error writing users file:', error);
            return false;
        }
    }

    // Thêm user mới
    addUser(userData) {
        const users = this.readUsers();
        
        // Kiểm tra email và username đã tồn tại chưa
        const existingUser = users.find(user => 
            user.email === userData.email || user.username === userData.username
        );
        
        if (existingUser) {
            throw new Error('Email hoặc username đã tồn tại');
        }

        // Tạo user mới với ID và timestamp
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        users.push(newUser);
        
        if (this.writeUsers(users)) {
            return newUser;
        } else {
            throw new Error('Không thể lưu user vào file');
        }
    }

    // Cập nhật user
    updateUser(userId, updateData) {
        const users = this.readUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
            throw new Error('User không tồn tại');
        }

        // Cập nhật thông tin user
        users[userIndex] = {
            ...users[userIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        if (this.writeUsers(users)) {
            return users[userIndex];
        } else {
            throw new Error('Không thể cập nhật user');
        }
    }

    // Tìm user theo email
    findUserByEmail(email) {
        const users = this.readUsers();
        return users.find(user => user.email === email);
    }

    // Tìm user theo username
    findUserByUsername(username) {
        const users = this.readUsers();
        return users.find(user => user.username === username);
    }

    // Tìm user theo ID
    findUserById(id) {
        const users = this.readUsers();
        return users.find(user => user.id === id);
    }

    // Xóa user
    deleteUser(userId) {
        const users = this.readUsers();
        const filteredUsers = users.filter(user => user.id !== userId);
        
        if (filteredUsers.length === users.length) {
            throw new Error('User không tồn tại');
        }

        if (this.writeUsers(filteredUsers)) {
            return true;
        } else {
            throw new Error('Không thể xóa user');
        }
    }

    // Lấy tất cả users
    getAllUsers() {
        return this.readUsers();
    }

    // Lấy users theo role
    getUsersByRole(role) {
        const users = this.readUsers();
        return users.filter(user => user.role === role);
    }

    // Backup file users.json
    backupUsers() {
        try {
            const backupPath = usersFilePath.replace('.json', `_backup_${Date.now()}.json`);
            const users = this.readUsers();
            fs.writeFileSync(backupPath, JSON.stringify(users, null, 2));
            return backupPath;
        } catch (error) {
            console.error('Error backing up users file:', error);
            return null;
        }
    }
}

export default new UserFileService(); 