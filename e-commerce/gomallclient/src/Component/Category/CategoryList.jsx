import React, { useState } from 'react';
import CategoryItem from './CategoryItem';
import ProductCard from '../ProductCard/ProductCard';
import './CategoryList.css';

// Danh sách danh mục đơn giản cho GoMall
const categories = [
  { icon: '👔', name: 'Thời Trang Nam', color: '#2196F3' },
  { icon: '📱', name: 'Điện Thoại', color: '#2196F3' },
  { icon: '💻', name: 'Laptop', color: '#2196F3' },
  { icon: '👗', name: 'Thời Trang Nữ', color: '#2196F3' },
  { icon: '🏠', name: 'Nhà Cửa', color: '#2196F3' },
  { icon: '⚽', name: 'Thể Thao', color: '#2196F3' },
  { icon: '📚', name: 'Sách', color: '#2196F3' },
  { icon: '🚗', name: 'Xe Cộ', color: '#2196F3' },
  { icon: '👜', name: 'Túi Xách', color: '#2196F3' },
  { icon: '💊', name: 'Thuốc', color: '#2196F3' },
];

// Sample products for each category
const categoryProducts = {
  'Thời Trang Nam': [
    { _id: '1', name: 'Áo sơ mi nam', price: 250000, image: 'https://via.placeholder.com/200x200?text=Ao+So+Mi+Nam', rating: 4.5 },
    { _id: '2', name: 'Quần jean nam', price: 350000, image: 'https://via.placeholder.com/200x200?text=Quan+Jean+Nam', rating: 4.2 },
    { _id: '3', name: 'Áo khoác nam', price: 450000, image: 'https://via.placeholder.com/200x200?text=Ao+Khoac+Nam', rating: 4.7 },
    { _id: '4', name: 'Giày nam', price: 550000, image: 'https://via.placeholder.com/200x200?text=Giay+Nam', rating: 4.3 },
    { _id: '5', name: 'Túi xách nam', price: 800000, image: 'https://via.placeholder.com/200x200?text=Tu+Xach+Nam', rating: 4.4 },
    { _id: '6', name: 'Đồng hồ nam', price: 1200000, image: 'https://via.placeholder.com/200x200?text=Dong+Ho+Nam', rating: 4.6 },
    { _id: '7', name: 'Thắt lưng nam', price: 200000, image: 'https://via.placeholder.com/200x200?text=That+Lung+Nam', rating: 4.1 },
    { _id: '8', name: 'Ví nam', price: 300000, image: 'https://via.placeholder.com/200x200?text=Vi+Nam', rating: 4.3 },
  ],
  'Điện Thoại': [
    { _id: '9', name: 'iPhone 15', price: 25000000, image: 'https://via.placeholder.com/200x200?text=iPhone+15', rating: 4.8 },
    { _id: '10', name: 'Samsung Galaxy', price: 18000000, image: 'https://via.placeholder.com/200x200?text=Samsung+Galaxy', rating: 4.6 },
    { _id: '11', name: 'Xiaomi Redmi', price: 8000000, image: 'https://via.placeholder.com/200x200?text=Xiaomi+Redmi', rating: 4.4 },
    { _id: '12', name: 'OPPO Reno', price: 12000000, image: 'https://via.placeholder.com/200x200?text=OPPO+Reno', rating: 4.5 },
    { _id: '13', name: 'Vivo V25', price: 10000000, image: 'https://via.placeholder.com/200x200?text=Vivo+V25', rating: 4.3 },
    { _id: '14', name: 'Realme GT', price: 9000000, image: 'https://via.placeholder.com/200x200?text=Realme+GT', rating: 4.4 },
    { _id: '15', name: 'OnePlus 11', price: 15000000, image: 'https://via.placeholder.com/200x200?text=OnePlus+11', rating: 4.7 },
    { _id: '16', name: 'Google Pixel', price: 20000000, image: 'https://via.placeholder.com/200x200?text=Google+Pixel', rating: 4.6 },
  ],
  'Laptop': [
    { _id: '17', name: 'MacBook Pro', price: 45000000, image: 'https://via.placeholder.com/200x200?text=MacBook+Pro', rating: 4.9 },
    { _id: '18', name: 'Dell XPS', price: 35000000, image: 'https://via.placeholder.com/200x200?text=Dell+XPS', rating: 4.7 },
    { _id: '19', name: 'HP Pavilion', price: 25000000, image: 'https://via.placeholder.com/200x200?text=HP+Pavilion', rating: 4.5 },
    { _id: '20', name: 'Lenovo ThinkPad', price: 30000000, image: 'https://via.placeholder.com/200x200?text=Lenovo+ThinkPad', rating: 4.6 },
    { _id: '21', name: 'ASUS ROG', price: 40000000, image: 'https://via.placeholder.com/200x200?text=ASUS+ROG', rating: 4.8 },
    { _id: '22', name: 'Acer Swift', price: 20000000, image: 'https://via.placeholder.com/200x200?text=Acer+Swift', rating: 4.4 },
    { _id: '23', name: 'MSI Gaming', price: 35000000, image: 'https://via.placeholder.com/200x200?text=MSI+Gaming', rating: 4.7 },
    { _id: '24', name: 'Razer Blade', price: 50000000, image: 'https://via.placeholder.com/200x200?text=Razer+Blade', rating: 4.9 },
  ],
  'Thời Trang Nữ': [
    { _id: '25', name: 'Váy đầm', price: 300000, image: 'https://via.placeholder.com/200x200?text=Vay+Dam', rating: 4.6 },
    { _id: '26', name: 'Áo blouse', price: 200000, image: 'https://via.placeholder.com/200x200?text=Ao+Blouse', rating: 4.4 },
    { _id: '27', name: 'Quần jean nữ', price: 280000, image: 'https://via.placeholder.com/200x200?text=Quan+Jean+Nu', rating: 4.3 },
    { _id: '28', name: 'Giày cao gót', price: 400000, image: 'https://via.placeholder.com/200x200?text=Giay+Cao+Got', rating: 4.5 },
    { _id: '29', name: 'Áo khoác nữ', price: 350000, image: 'https://via.placeholder.com/200x200?text=Ao+Khoac+Nu', rating: 4.4 },
    { _id: '30', name: 'Túi xách nữ', price: 500000, image: 'https://via.placeholder.com/200x200?text=Tu+Xach+Nu', rating: 4.6 },
    { _id: '31', name: 'Đồng hồ nữ', price: 800000, image: 'https://via.placeholder.com/200x200?text=Dong+Ho+Nu', rating: 4.5 },
    { _id: '32', name: 'Trang sức', price: 600000, image: 'https://via.placeholder.com/200x200?text=Trang+Suc', rating: 4.7 },
  ],
  'Nhà Cửa': [
    { _id: '33', name: 'Bàn ghế', price: 1500000, image: 'https://via.placeholder.com/200x200?text=Ban+Ghe', rating: 4.4 },
    { _id: '34', name: 'Tủ quần áo', price: 2500000, image: 'https://via.placeholder.com/200x200?text=Tu+Quan+Ao', rating: 4.6 },
    { _id: '35', name: 'Đèn trang trí', price: 500000, image: 'https://via.placeholder.com/200x200?text=Den+Trang+Tri', rating: 4.2 },
    { _id: '36', name: 'Rèm cửa', price: 800000, image: 'https://via.placeholder.com/200x200?text=Rem+Cua', rating: 4.3 },
    { _id: '37', name: 'Thảm trải sàn', price: 400000, image: 'https://via.placeholder.com/200x200?text=Tham+Trai+San', rating: 4.1 },
    { _id: '38', name: 'Gối sofa', price: 200000, image: 'https://via.placeholder.com/200x200?text=Goi+Sofa', rating: 4.3 },
    { _id: '39', name: 'Bình hoa', price: 300000, image: 'https://via.placeholder.com/200x200?text=Binh+Hoa', rating: 4.4 },
    { _id: '40', name: 'Đồng hồ treo tường', price: 600000, image: 'https://via.placeholder.com/200x200?text=Dong+Ho+Treu+Tuong', rating: 4.5 },
  ],
  'Thể Thao': [
    { _id: '41', name: 'Giày thể thao', price: 1200000, image: 'https://via.placeholder.com/200x200?text=Giay+The+Thao', rating: 4.7 },
    { _id: '42', name: 'Quần áo thể thao', price: 400000, image: 'https://via.placeholder.com/200x200?text=Quan+Ao+The+Thao', rating: 4.5 },
    { _id: '43', name: 'Bóng đá', price: 200000, image: 'https://via.placeholder.com/200x200?text=Bong+Da', rating: 4.3 },
    { _id: '44', name: 'Vợt tennis', price: 800000, image: 'https://via.placeholder.com/200x200?text=Vot+Tennis', rating: 4.4 },
    { _id: '45', name: 'Xe đạp thể thao', price: 5000000, image: 'https://via.placeholder.com/200x200?text=Xe+Dap+The+Thao', rating: 4.6 },
    { _id: '46', name: 'Dụng cụ gym', price: 1500000, image: 'https://via.placeholder.com/200x200?text=Dung+Cu+Gym', rating: 4.5 },
    { _id: '47', name: 'Bóng rổ', price: 300000, image: 'https://via.placeholder.com/200x200?text=Bong+Ro', rating: 4.2 },
    { _id: '48', name: 'Bơi lội', price: 600000, image: 'https://via.placeholder.com/200x200?text=Boi+Loi', rating: 4.4 },
  ],
  'Sách': [
    { _id: '49', name: 'Sách văn học', price: 150000, image: 'https://via.placeholder.com/200x200?text=Sach+Van+Hoc', rating: 4.6 },
    { _id: '50', name: 'Sách kinh tế', price: 200000, image: 'https://via.placeholder.com/200x200?text=Sach+Kinh+Te', rating: 4.5 },
    { _id: '51', name: 'Sách thiếu nhi', price: 100000, image: 'https://via.placeholder.com/200x200?text=Sach+Thieu+Nhi', rating: 4.7 },
    { _id: '52', name: 'Sách ngoại ngữ', price: 180000, image: 'https://via.placeholder.com/200x200?text=Sach+Ngoai+Ngu', rating: 4.4 },
    { _id: '53', name: 'Sách khoa học', price: 250000, image: 'https://via.placeholder.com/200x200?text=Sach+Khoa+Hoc', rating: 4.6 },
    { _id: '54', name: 'Sách lịch sử', price: 220000, image: 'https://via.placeholder.com/200x200?text=Sach+Lich+Su', rating: 4.5 },
    { _id: '55', name: 'Sách công nghệ', price: 300000, image: 'https://via.placeholder.com/200x200?text=Sach+Cong+Nghe', rating: 4.7 },
    { _id: '56', name: 'Sách nghệ thuật', price: 350000, image: 'https://via.placeholder.com/200x200?text=Sach+Nghe+Thuat', rating: 4.4 },
  ],
  'Xe Cộ': [
    { _id: '57', name: 'Xe máy', price: 50000000, image: 'https://via.placeholder.com/200x200?text=Xe+May', rating: 4.8 },
    { _id: '58', name: 'Xe đạp', price: 3000000, image: 'https://via.placeholder.com/200x200?text=Xe+Dap', rating: 4.5 },
    { _id: '59', name: 'Phụ tùng xe', price: 500000, image: 'https://via.placeholder.com/200x200?text=Phu+Tung+Xe', rating: 4.3 },
    { _id: '60', name: 'Mũ bảo hiểm', price: 200000, image: 'https://via.placeholder.com/200x200?text=Mu+Bao+Hiem', rating: 4.4 },
    { _id: '61', name: 'Áo khoác xe máy', price: 400000, image: 'https://via.placeholder.com/200x200?text=Ao+Khoac+Xe+May', rating: 4.3 },
    { _id: '62', name: 'Găng tay lái xe', price: 150000, image: 'https://via.placeholder.com/200x200?text=Gang+Tay+Lai+Xe', rating: 4.2 },
    { _id: '63', name: 'Bao đeo xe', price: 300000, image: 'https://via.placeholder.com/200x200?text=Bao+Deo+Xe', rating: 4.4 },
    { _id: '64', name: 'Đèn xe', price: 100000, image: 'https://via.placeholder.com/200x200?text=Den+Xe', rating: 4.1 },
  ],
  'Túi Xách': [
    { _id: '65', name: 'Túi xách nữ', price: 800000, image: 'https://via.placeholder.com/200x200?text=Tu+Xach+Nu', rating: 4.6 },
    { _id: '66', name: 'Túi đeo chéo', price: 500000, image: 'https://via.placeholder.com/200x200?text=Tu+Deo+Cheo', rating: 4.4 },
    { _id: '67', name: 'Ví cầm tay', price: 300000, image: 'https://via.placeholder.com/200x200?text=Vi+Cam+Tay', rating: 4.5 },
    { _id: '68', name: 'Ba lô', price: 400000, image: 'https://via.placeholder.com/200x200?text=Ba+Lo', rating: 4.3 },
    { _id: '69', name: 'Túi du lịch', price: 600000, image: 'https://via.placeholder.com/200x200?text=Tu+Du+Lich', rating: 4.5 },
    { _id: '70', name: 'Túi laptop', price: 350000, image: 'https://via.placeholder.com/200x200?text=Tu+Laptop', rating: 4.4 },
    { _id: '71', name: 'Túi gym', price: 250000, image: 'https://via.placeholder.com/200x200?text=Tu+Gym', rating: 4.2 },
    { _id: '72', name: 'Túi đựng đồ', price: 200000, image: 'https://via.placeholder.com/200x200?text=Tu+Dung+Do', rating: 4.3 },
  ],
  'Thuốc': [
    { _id: '73', name: 'Thuốc cảm', price: 50000, image: 'https://via.placeholder.com/200x200?text=Thuoc+Cam', rating: 4.2 },
    { _id: '74', name: 'Vitamin C', price: 80000, image: 'https://via.placeholder.com/200x200?text=Vitamin+C', rating: 4.5 },
    { _id: '75', name: 'Thuốc giảm đau', price: 60000, image: 'https://via.placeholder.com/200x200?text=Thuoc+Giam+Dau', rating: 4.3 },
    { _id: '76', name: 'Thuốc bổ', price: 120000, image: 'https://via.placeholder.com/200x200?text=Thuoc+Bo', rating: 4.4 },
    { _id: '77', name: 'Thuốc ho', price: 40000, image: 'https://via.placeholder.com/200x200?text=Thuoc+Ho', rating: 4.1 },
    { _id: '78', name: 'Thuốc sổ mũi', price: 35000, image: 'https://via.placeholder.com/200x200?text=Thuoc+So+Mui', rating: 4.2 },
    { _id: '79', name: 'Thuốc kháng sinh', price: 150000, image: 'https://via.placeholder.com/200x200?text=Thuoc+Khang+Sinh', rating: 4.6 },
    { _id: '80', name: 'Thuốc tiêu hóa', price: 70000, image: 'https://via.placeholder.com/200x200?text=Thuoc+Tieu+Hoa', rating: 4.3 },
  ],
};

export default function CategoryList() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setShowProducts(true);
    setCurrentPage(1); // Reset về trang đầu khi chọn danh mục mới
  };

  const handleBackToCategories = () => {
    setShowProducts(false);
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const products = categoryProducts[selectedCategory] || [];
    const totalPages = Math.ceil(products.length / productsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (showProducts && selectedCategory) {
    const products = categoryProducts[selectedCategory] || [];
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);
    
    return (
      <div className="category-section">
        <div className="category-container">
          <div className="category-header">
            <button className="back-button" onClick={handleBackToCategories}>
              ← Quay lại danh mục
            </button>
            <h2 className="category-title">{selectedCategory}</h2>
          </div>
          <div className="products-grid">
            {currentProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="pagination-dots">
              <button 
                className={`arrow-button prev ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`pagination-dot ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  <span className="dot"></span>
                </button>
              ))}
              <button 
                className={`arrow-button next ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="category-section">
      <div className="category-container">
        <h2 className="category-title">Danh Mục Sản Phẩm</h2>
        <div className="category-grid">
          {categories.map((item, index) => (
            <CategoryItem 
              key={index}
              icon={item.icon} 
              name={item.name} 
              color={item.color}
              onClick={() => handleCategoryClick(item.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
