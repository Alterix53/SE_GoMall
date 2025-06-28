import React from 'react';
import CategoryItem from './CategoryItem';

// Danh sách danh mục (bạn có thể lấy từ API sau này)
const categories = [
  { icon: '/img/fashion.png', name: 'Thời Trang' },
  { icon: '/img/phone.png', name: 'Điện Thoại & Phụ Kiện' },
  { icon: '/img/laptop.png', name: 'Máy Tính & Laptop' },
  { icon: '/img/camera.png', name: 'Máy Ảnh & Máy Quay Phim' },
  { icon: '/img/shoes.png', name: 'Giày Dép Nam' },
  { icon: '/img/watch.png', name: 'Đồng Hồ' },
  // ... thêm các mục khác
];

export default function CategoryList() {
  return (
    <section className="bg-white py-4">
      <div className="container">
        <h5 className="fw-bold mb-4">Category</h5>
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5 row-cols-lg-6 g-3">
          {categories.map((item, index) => (
            <div className="col" key={index}>
              <CategoryItem icon={item.icon} name={item.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
