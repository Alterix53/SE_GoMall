import mongoose from "mongoose";
import User from "../server/models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().lean();
        res.json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("Error in getAllUsers:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, password, email, fullName, phoneNumber, address } = req.body;
        const newUser = new User({ username, password, email, fullName, phoneNumber, address });
        await newUser.save();
        res.status(201).json({
            success: true,
            data: newUser,
        });
    } catch (error) {
        console.error("Error in createUser:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).lean();
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error in updateUser:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id).lean();
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteUser:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};