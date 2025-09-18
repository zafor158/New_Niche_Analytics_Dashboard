const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test 2: Login
    console.log('\n2. Testing login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'demo@author.com',
      password: 'password123'
    });
    console.log('✅ Login successful');
    const token = loginResponse.data.token;

    // Set up axios with token
    const authAxios = axios.create({
      baseURL: API_BASE,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Test 3: Get books
    console.log('\n3. Testing books endpoint...');
    const booksResponse = await authAxios.get('/books');
    console.log('✅ Books:', booksResponse.data.books.length, 'found');

    // Test 4: Get sales
    console.log('\n4. Testing sales endpoint...');
    const salesResponse = await authAxios.get('/sales?limit=5');
    console.log('✅ Sales:', salesResponse.data.sales.length, 'found');

    // Test 5: Get analytics
    console.log('\n5. Testing analytics endpoint...');
    const analyticsResponse = await authAxios.get('/sales/analytics/overview');
    console.log('✅ Analytics overview:', analyticsResponse.data.overview);

    // Test 6: Create a new book
    console.log('\n6. Testing book creation...');
    const newBookResponse = await authAxios.post('/books', {
      title: 'Test Book',
      description: 'A test book for API testing',
      isbn: '978-1234567890'
    });
    console.log('✅ Book created:', newBookResponse.data.book.title);

    console.log('\n🎉 All API tests passed!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testAPI();
