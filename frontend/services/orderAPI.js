// services/orderAPI.js
const API_BASE_URL = 'http://localhost:5000/api'; // FIXED: Changed from 5173 to 5000

export const orderAPI = {
  // Create new order
  createOrder: async (orderData) => {
    const token = localStorage.getItem('token');
    
    console.log('🚀 Creating order with data:', orderData);
    console.log('🔑 Using token:', token ? 'Token present' : 'No token');
    console.log('📡 API URL:', `${API_BASE_URL}/orders`);
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    
    console.log('📨 Response status:', response.status);
    console.log('📨 Response ok:', response.ok);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      throw new Error(errorData.message || 'Failed to create order');
    }
    
    const result = await response.json();
    console.log('✅ Order created successfully:', result);
    return result;
  },

  // Get user orders
  getOrders: async () => {
    const token = localStorage.getItem('token');
    
    console.log('📡 Fetching orders from:', `${API_BASE_URL}/orders`);
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch orders');
    }
    
    return response.json();
  }
};
