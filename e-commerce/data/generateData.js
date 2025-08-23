const fs = require('fs');
const path = require('path');

// Expanded categories with English names
const categories = [
  {
    "categoryName": "Phones",
    "slug": "phones",
    "description": "Smartphones from leading brands with latest technology.",
    "image": "/images/Phone.png",
    "icon": "fas fa-mobile-alt",
    "parentID": null
  },
  {
    "categoryName": "Laptops",
    "slug": "laptops", 
    "description": "High-performance laptops for work and entertainment.",
    "image": "/images/Laptop.png",
    "icon": "fas fa-laptop",
    "parentID": null
  },
  {
    "categoryName": "Fashion",
    "slug": "fashion",
    "description": "Trendy clothing and accessories for men and women.",
    "image": "/images/Clothes.png",
    "icon": "fas fa-tshirt",
    "parentID": null
  },
  {
    "categoryName": "Sports",
    "slug": "sports",
    "description": "Professional sports equipment and athletic wear.",
    "image": "/images/TheThao.png",
    "icon": "fas fa-dumbbell",
    "parentID": null
  },
  {
    "categoryName": "Home & Garden",
    "slug": "home-garden",
    "description": "Modern home appliances and garden tools.",
    "image": "/images/DoGiaDung.png",
    "icon": "fas fa-home",
    "parentID": null
  },
  {
    "categoryName": "Beauty & Cosmetics",
    "slug": "beauty-cosmetics",
    "description": "High-quality skincare and beauty products.",
    "image": "/images/MyPham.png",
    "icon": "fas fa-spa",
    "parentID": null
  },
  {
    "categoryName": "Accessories",
    "slug": "accessories",
    "description": "Premium fashion accessories and bags.",
    "image": "/images/Gucci.jpg",
    "icon": "fas fa-bag-shopping",
    "parentID": null
  },
  {
    "categoryName": "Books",
    "slug": "books",
    "description": "Books across all genres and educational materials.",
    "image": "/images/Book.png",
    "icon": "fas fa-book",
    "parentID": null
  },
  {
    "categoryName": "Vehicles",
    "slug": "vehicles",
    "description": "Cars, motorcycles, and vehicle accessories.",
    "image": "/images/Xe.png",
    "icon": "fas fa-car",
    "parentID": null
  },
  {
    "categoryName": "Electronics",
    "slug": "electronics",
    "description": "Consumer electronics and gadgets.",
    "image": "/images/Phone.png",
    "icon": "fas fa-tv",
    "parentID": null
  }
];

  // Product data templates for each category
  const productTemplates = {
    "Phones": [
      { 
        name: "iPhone 15 Pro Max", 
        price: 35000000, 
        brand: "Apple",
        description: "iPhone 15 Pro Max with A17 Pro chip, 48MP camera, Super Retina XDR 6.7 inch display, titanium design.",
        image: "iphone-15-pro-max.jpg"
      },
      { 
        name: "Samsung Galaxy S24 Ultra", 
        price: 32000000, 
        brand: "Samsung",
        description: "Galaxy S24 Ultra with integrated S Pen, 200MP camera, Dynamic AMOLED 2X 6.8 inch display, Snapdragon 8 Gen 3 chip.",
        image: "samsung-s24-ultra.jpg"
      }
    ],
      "Laptops": [
      { 
        name: "MacBook Pro 16-inch M3 Max", 
        price: 65000000, 
        brand: "Apple",
        description: "MacBook Pro 16 inch with M3 Max chip, Liquid Retina XDR display, 32GB RAM, 1TB SSD, extremely powerful performance.",
        image: "macbook-pro-16-m3.jpg"
      },
      { 
        name: "Dell XPS 15 9530", 
        price: 42000000, 
        brand: "Dell",
        description: "Dell XPS 15 with Intel Core i9-13900H, RTX 4070, OLED 3.5K display, 32GB RAM, 1TB SSD.",
        image: "dell-xps-15.jpg"
      }
    ],
      "Fashion": [
      { 
        name: "Nike Air Jordan 1 Retro High OG", 
        price: 4500000, 
        brand: "Nike",
        description: "Air Jordan 1 Retro High OG with classic design, premium leather material, attractive colors.",
        image: "nike-air-jordan-1.jpg"
      },
      { 
        name: "Gucci Marmont Small Shoulder Bag", 
        price: 28000000, 
        brand: "Gucci",
        description: "Gucci Marmont bag with classic design, soft leather material, distinctive GG logo.",
        image: "gucci-marmont-bag.jpg"
      }
    ],
      "Sports": [
      { 
        name: "Nike Air Max 270", 
        price: 3200000, 
        brand: "Nike",
        description: "Nike Air Max 270 with largest Air Max air cushion, fashionable design, suitable for sports and casual wear.",
        image: "nike-air-max-270.jpg"
      },
      { 
        name: "Adidas Ultraboost 22", 
        price: 3800000, 
        brand: "Adidas",
        description: "Adidas Ultraboost 22 with Boost technology, Continental sole, sock-fit design, high running performance.",
        image: "adidas-ultraboost-22.jpg"
      }
    ],
      "Home & Garden": [
      { 
        name: "Philips Air Fryer HD9654/90", 
        price: 4500000, 
        brand: "Philips",
        description: "Philips Air Fryer with TurboStar technology, 1.2kg capacity, oil saving, healthy cooking.",
        image: "philips-air-fryer.jpg"
      },
      { 
        name: "Dyson V15 Detect Absolute", 
        price: 22000000, 
        brand: "Dyson",
        description: "Dyson V15 Detect with laser detection, 240AW power, 60-minute battery, HEPA filtration technology.",
        image: "dyson-v15-detect.jpg"
      }
    ],
      "Beauty & Cosmetics": [
      { 
        name: "La Mer Crème de la Mer", 
        price: 12000000, 
        brand: "La Mer",
        description: "La Mer Crème de la Mer with Miracle Broth, deep hydration, skin recovery, anti-aging.",
        image: "la-mer-cream.jpg"
      },
      { 
        name: "SK-II Facial Treatment Essence", 
        price: 5500000, 
        brand: "SK-II",
        description: "SK-II Essence với Pitera, làm sáng da, cải thiện kết cấu, chống lão hóa hiệu quả.",
        image: "sk-ii-essence.jpg"
      }
    ],
      "Accessories": [
      { 
        name: "Rolex Submariner Date", 
        price: 280000000, 
        brand: "Rolex",
        description: "Rolex Submariner Date với vỏ Oystersteel, dây đeo Oyster, chống nước 300m, movement tự động.",
        image: "rolex-submariner.jpg"
      },
      { 
        name: "Cartier Love Bracelet", 
        price: 55000000, 
        brand: "Cartier",
        description: "Cartier Love Bracelet với thiết kế cổ điển, chất liệu vàng 18k, khóa vặn đặc trưng.",
        image: "cartier-love-bracelet.jpg"
      }
    ],
      "Books": [
      { 
        name: "The Great Gatsby (Deluxe Edition)", 
        price: 250000, 
        brand: "F. Scott Fitzgerald",
        description: "The Great Gatsby phiên bản deluxe với bìa cứng, minh họa đẹp, tác phẩm văn học kinh điển.",
        image: "great-gatsby-book.jpg"
      },
      { 
        name: "Harry Potter Complete Collection", 
        price: 1200000, 
        brand: "J.K. Rowling",
        description: "Bộ sưu tập Harry Potter đầy đủ 7 tập, bìa cứng, minh họa đẹp, phiên bản collector.",
        image: "harry-potter-collection.jpg"
      }
    ],
      "Vehicles": [
      { 
        name: "Tesla Model S Plaid", 
        price: 2500000000, 
        brand: "Tesla",
        description: "Tesla Model S Plaid với hiệu suất cực cao, tăng tốc 0-100km/h trong 2.1s, tầm hoạt động 600km.",
        image: "tesla-model-s-plaid.jpg"
      },
      { 
        name: "BMW X7 M60i", 
        price: 4500000000, 
        brand: "BMW",
        description: "BMW X7 M60i với động cơ V8 TwinPower Turbo, thiết kế sang trọng, nội thất cao cấp.",
        image: "bmw-x7-m60i.jpg"
      }
    ],
      "Electronics": [
      { 
        name: "Sony WH-1000XM5", 
        price: 9500000, 
        brand: "Sony",
        description: "Sony WH-1000XM5 với công nghệ noise cancellation hàng đầu, âm thanh chất lượng cao, pin 30 giờ.",
        image: "sony-wh-1000xm5.jpg"
      },
      { 
        name: "Apple AirPods Pro 2", 
        price: 7500000, 
        brand: "Apple",
        description: "Apple AirPods Pro 2 với Active Noise Cancellation, Spatial Audio, chip H2, pin 6 giờ.",
        image: "apple-airpods-pro-2.jpg"
      }
    ]
};

// Generate products
function generateProducts() {
  const products = [];
  let productId = 1;

  categories.forEach((category, categoryIndex) => {
    const categoryId = categoryIndex + 1;
    const templates = productTemplates[category.categoryName] || [];
    
    // Generate 2 products per category (10 categories * 2 = 20 products)
    for (let i = 0; i < 2; i++) {
      const template = templates[i % templates.length];
      const variation = Math.floor(i / templates.length) + 1;
      
      const basePrice = template.price;
      const salePrice = Math.floor(basePrice * (0.7 + Math.random() * 0.2)); // 70-90% of original
      const flashSalePrice = Math.floor(basePrice * (0.5 + Math.random() * 0.15)); // 50-65% of original
      
      const product = {
        id: productId++,
        name: template.name,
        price_original: basePrice,
        price_sale: salePrice,
        description: template.description || `${template.name} - High quality ${category.categoryName.toLowerCase()} product from ${template.brand}. Features premium materials and innovative design.`,
        categoryID: categoryId,
        sellerID: Math.floor(Math.random() * 10) + 1,
        images_url: `/images/${template.image || `${template.brand.toLowerCase().replace(/\s+/g, '-')}-${i + 1}.jpg`}`,
        images_isPrimary: true,
        inventory_quantity: Math.floor(Math.random() * 200) + 10,
        inventory_lowStockThreshold: Math.floor(Math.random() * 10) + 5,
        tags: `${category.slug}, ${template.brand.toLowerCase()}, ${category.categoryName.toLowerCase()}`,
        rating_count: Math.floor(Math.random() * 500) + 50,
        sold: Math.floor(Math.random() * 1000) + 100,
        views: Math.floor(Math.random() * 5000) + 500,
        isActive: true,
        isFeatured: Math.random() > 0.8, // 20% chance
        isFlashSale: Math.random() > 0.7, // 30% chance
        flashSalePrice: Math.random() > 0.7 ? flashSalePrice : null,
        flashSaleEndDate: Math.random() > 0.7 ? "2025-08-15" : null
      };
      
      products.push(product);
    }
  });

  return products;
}

// Generate and save data
function generateData() {
  console.log('Generating categories...');
  fs.writeFileSync(
    path.join(__dirname, 'Categories.json'),
    JSON.stringify(categories, null, 2)
  );
  console.log(`✅ Generated ${categories.length} categories`);

  console.log('Generating products...');
  const products = generateProducts();
  fs.writeFileSync(
    path.join(__dirname, 'products.json'),
    JSON.stringify(products, null, 2)
  );
  console.log(`✅ Generated ${products.length} products`);

  // Generate summary
  const summary = {
    totalCategories: categories.length,
    totalProducts: products.length,
    productsPerCategory: Math.floor(products.length / categories.length),
    categories: categories.map(cat => ({
      name: cat.categoryName,
      slug: cat.slug,
      productCount: products.filter(p => p.categoryID === categories.indexOf(cat) + 1).length
    }))
  };

  fs.writeFileSync(
    path.join(__dirname, 'data-summary.json'),
    JSON.stringify(summary, null, 2)
  );
  console.log('✅ Generated data summary');
  console.log('\n📊 Data Summary:');
  console.log(`Categories: ${summary.totalCategories}`);
  console.log(`Products: ${summary.totalProducts}`);
  console.log(`Products per category: ${summary.productsPerCategory}`);
}

generateData(); 