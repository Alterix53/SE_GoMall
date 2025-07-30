import * as adminController from "../controllers/adminController.js";
import User from "../models/User.js";


export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, data: { user } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

