const API_BASE = 'http://localhost:8080/api';

async function testOrderAPI() {
  console.log('Testing Order API...\n');

  try {
    // Test 1: Get a product to order
    console.log('1. Getting product information...');
    const productsResponse = await fetch(`${API_BASE}/products`);
    const productsData = await productsResponse.json();
    
    console.log('Products response:', productsData);
    
    if (!productsData.success || !productsData.data?.products || !productsData.data.products.length) {
      console.log('No products found');
      return;
    }

    const product = productsData.data.products.find(p => p.inventory?.quantity > 0);
    if (!product) {
      console.log('No products with inventory found');
      return;
    }

    console.log('Selected product:', {
      id: product._id,
      name: product.name,
      inventory: product.inventory.quantity,
      sold: product.sold
    });

    // Test 2: Login to get token
    console.log('\n2. Logging in...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alterix1@example.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      console.log('Login failed:', loginData.message);
      return;
    }

    const token = loginData.token;
    console.log('Login successful, got token');

    // Test 3: Create order
    console.log('\n3. Creating order...');
    const orderData = {
      total: product.price?.sale || product.price?.original || 100,
      shippingAddress: 'Test Address, Test City',
      paymentMethod: 'Cash',
      items: [{
        productID: product._id,
        quantity: 1,
        unitPrice: product.price?.sale || product.price?.original || 100,
        discount: 0
      }],
      note: 'Test order for inventory testing'
    };

    const orderResponse = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const orderResult = await orderResponse.json();
    console.log('Order creation result:', orderResult);

    if (orderResult.success) {
      console.log('✅ Order created successfully');
      
      // Test 4: Check product inventory after order
      console.log('\n4. Checking inventory after order...');
      const productAfterResponse = await fetch(`${API_BASE}/products/${product._id}`);
      const productAfterData = await productAfterResponse.json();
      
      if (productAfterData.success) {
        const updatedProduct = productAfterData.product;
        console.log('Product after order:', {
          inventory: updatedProduct.inventory.quantity,
          sold: updatedProduct.sold
        });
        
        const inventoryDecreased = updatedProduct.inventory.quantity === product.inventory.quantity - 1;
        const soldIncreased = updatedProduct.sold === product.sold + 1;
        
        console.log('Inventory decreased:', inventoryDecreased ? '✅' : '❌');
        console.log('Sold increased:', soldIncreased ? '✅' : '❌');
        
        if (inventoryDecreased && soldIncreased) {
          console.log('\n🎉 All inventory tests passed!');
        } else {
          console.log('\n❌ Inventory update failed');
        }
      }
    } else {
      console.log('❌ Order creation failed:', orderResult.message);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testOrderAPI();
