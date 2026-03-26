// Test API connection from frontend perspective
const API_BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing API connection...');
    console.log('API Base URL:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/analyze/maheengithub`);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', data);
    
    console.log('API test successful!');
  } catch (error) {
    console.error('API test failed:', error);
  }
}

testAPI();
