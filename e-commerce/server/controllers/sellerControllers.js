import Seller from '../models/Seller.js';

// [POST] Đăng ký seller
export const registerSeller = async (req, res) => {
  try {
    const seller = new Seller(req.body);
    await seller.save();
    res.status(201).json({ message: 'Đăng ký thành công, chờ duyệt', seller });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// [GET] Lấy tất cả seller
export const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [PATCH] Duyệt seller
export const approveSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
    if (!seller) return res.status(404).json({ message: 'Seller không tồn tại' });
    res.json({ message: 'Đã duyệt seller', seller });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [PATCH] Từ chối seller
export const rejectSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    if (!seller) return res.status(404).json({ message: 'Seller không tồn tại' });
    res.json({ message: 'Đã từ chối seller', seller });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
