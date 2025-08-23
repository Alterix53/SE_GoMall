async function testApproveSellerAPI() {
  try {
    // First, get admin token by logging in
    const loginResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      console.error('Failed to login:', loginData.message);
      return;
    }

    const token = loginData.data.token;
    console.log('Got admin token');

    // Get pending sellers
    const sellersResponse = await fetch('http://localhost:5000/api/admin/sellers?status=pending', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const sellersData = await sellersResponse.json();
    console.log('Sellers response:', sellersData);

    if (!sellersData.success || !sellersData.data.sellers || sellersData.data.sellers.length === 0) {
      console.log('No pending sellers found');
      return;
    }

    const sellerId = sellersData.data.sellers[0]._id;
    console.log('Testing approve with seller ID:', sellerId);

    // Test approve endpoint
    const approveResponse = await fetch(`http://localhost:5000/api/admin/sellers/${sellerId}/approve`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const approveData = await approveResponse.json();
    console.log('Approve response:', approveData);

  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testApproveSellerAPI();
