const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Product images URLs (using placeholder images for demo)
const productImages = {
  "iphone-15-pro-max.jpg": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
  "samsung-s24-ultra.jpg": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
  "macbook-pro-16-m3.jpg": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
  "dell-xps-15.jpg": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
  "nike-air-jordan-1.jpg": "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop",
  "gucci-marmont-bag.jpg": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
  "nike-air-max-270.jpg": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
  "adidas-ultraboost-22.jpg": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop",
  "philips-air-fryer.jpg": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
  "dyson-v15-detect.jpg": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
  "la-mer-cream.jpg": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop",
  "sk-ii-essence.jpg": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=500&fit=crop",
  "rolex-submariner.jpg": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop",
  "cartier-love-bracelet.jpg": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
  "great-gatsby-book.jpg": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop",
  "harry-potter-collection.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
  "tesla-model-s-plaid.jpg": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&h=500&fit=crop",
  "bmw-x7-m60i.jpg": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=500&fit=crop",
  "sony-wh-1000xm5.jpg": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
  "apple-airpods-pro-2.jpg": "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop"
};

// Function to download image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const filepath = path.join(__dirname, '../server/public/images', filename);
    
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('📥 Starting image downloads...');
  
  const downloadPromises = Object.entries(productImages).map(([filename, url]) => 
    downloadImage(url, filename).catch(err => {
      console.error(`❌ Failed to download ${filename}:`, err.message);
      return null;
    })
  );
  
  await Promise.all(downloadPromises);
  console.log('🎉 Image download process completed!');
}

downloadAllImages(); 