class ResponseHandler {
    // Success response
    static success(res, data, message = "Thành công", statusCode = 200) {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    // Error response
    static error(res, message = "Có lỗi xảy ra", statusCode = 500, error = null) {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        return res.status(statusCode).json({
            success: false,
            message,
            error: process.env.NODE_ENV === "development" ? error : {},
        });
    }

    // Not found response
    static notFound(res, message = "Không tìm thấy") {
        return this.error(res, message, 404);
    }

    // Bad request response
    static badRequest(res, message = "Dữ liệu không hợp lệ") {
        return this.error(res, message, 400);
    }

    // Unauthorized response
    static unauthorized(res, message = "Không có quyền truy cập") {
        return this.error(res, message, 401);
    }

    // Forbidden response
    static forbidden(res, message = "Truy cập bị từ chối") {
        return this.error(res, message, 403);
    }

    // Handle async controller errors
    static asyncHandler(fn) {
        return async (req, res, next) => {
            try {
                await fn(req, res, next);
            } catch (error) {
                console.error("Controller error:", error.message);
                this.error(res, "Lỗi server", 500, error.message);
            }
        };
    }
}

export default ResponseHandler; 