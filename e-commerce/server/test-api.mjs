// Using built-in fetch (Node.js 18+)

async function testAPI() {
    const baseURL = 'http://localhost:8080/api/products/search';
    
    const testCases = [
        {
            name: 'Test 1: Search "adidas" only',
            url: `${baseURL}?keyword=adidas`
        },
        {
            name: 'Test 2: Search "adidas" + category "Sports"',
            url: `${baseURL}?keyword=adidas&category=Sports`
        },
        {
            name: 'Test 3: Search "adidas" + brand "Nike"',
            url: `${baseURL}?keyword=adidas&brand=Nike`
        },
        {
            name: 'Test 4: Search "adidas" + category "Sports" + brand "Nike"',
            url: `${baseURL}?keyword=adidas&category=Sports&brand=Nike`
        },
        {
            name: 'Test 5: Brand filter only - "Nike"',
            url: `${baseURL}?brand=Nike`
        },
        {
            name: 'Test 6: Brand filter only - "Apple"',
            url: `${baseURL}?brand=Apple`
        },
        {
            name: 'Test 7: Multiple brands - "Nike,Apple"',
            url: `${baseURL}?brand=Nike,Apple`
        },
        {
            name: 'Test 8: Category + Brand - "Sports" + "Nike"',
            url: `${baseURL}?category=Sports&brand=Nike`
        }
    ];

    for (const testCase of testCases) {
        console.log(`\n🔍 ${testCase.name}`);
        console.log(`URL: ${testCase.url}`);
        
        try {
            const response = await fetch(testCase.url);
            const data = await response.json();
            
            console.log(`Status: ${response.status}`);
            console.log(`Results: ${data.data?.products?.length || 0} products`);
            
            if (data.data?.products?.length > 0) {
                console.log('Sample products:');
                data.data.products.slice(0, 3).forEach((product, index) => {
                    console.log(`  ${index + 1}. ${product.name} (Brand: ${product.brand}, Category: ${product.categoryID})`);
                });
            }
        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
        }
    }
}

testAPI();
