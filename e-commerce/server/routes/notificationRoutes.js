const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Tất cả routes đều yêu cầu authentication
router.use(auth);

// GET /api/notifications - Lấy danh sách thông báo của user
router.get('/', notificationController.getUserNotifications);

// GET /api/notifications/unread-count - Lấy số thông báo chưa đọc
router.get('/unread-count', notificationController.getUnreadCount);

// PUT /api/notifications/:id/read - Đánh dấu một thông báo đã đọc
router.put('/:id/read', notificationController.markNotificationAsRead);

// PUT /api/notifications/read-all - Đánh dấu tất cả thông báo đã đọc
router.put('/read-all', notificationController.markAllNotificationsAsRead);

// DELETE /api/notifications/:id - Xóa một thông báo
router.delete('/:id', notificationController.deleteNotification);

// DELETE /api/notifications/read - Xóa tất cả thông báo đã đọc
router.delete('/read', notificationController.deleteReadNotifications);

// POST /api/notifications - Tạo thông báo mới (cho admin/system)
router.post('/', notificationController.createNotification);

// POST /api/notifications/broadcast - Tạo thông báo cho nhiều user
router.post('/broadcast', notificationController.createBroadcastNotification);

module.exports = router;
