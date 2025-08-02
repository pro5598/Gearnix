// routes/orders.js - FIXED VERSION
const express = require('express');
const router = express.Router();

// FIXED: Import the specific function you need from the authMiddleware object
const { authenticateToken } = require('../viable/authMiddleware');
const { createOrder, getUserOrders } = require('../controllers/orderController');

// Verify functions before using them
if (typeof authenticateToken !== 'function') {
  throw new Error('authenticateToken is not a function');
}
if (typeof createOrder !== 'function') {
  throw new Error('createOrder is not a function');
}
if (typeof getUserOrders !== 'function') {
  throw new Error('getUserOrders is not a function');
}

console.log('✅ All handlers verified as functions');

// Setup routes - using authenticateToken instead of authMiddleware
router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getUserOrders);

module.exports = router;
