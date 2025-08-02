// controllers/orderController.js
const { Order, OrderItem, Product, sequelize } = require('../models');

const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { cartItems, customerDetails, paymentDetails, totals } = req.body;
    const userId = req.user?.id;
    
    // Validate user authentication
    if (!userId) {
      await transaction.rollback();
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    // Validate required data
    if (!cartItems || cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    if (!customerDetails || !paymentDetails || !totals) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Missing required order information'
      });
    }

    console.log('Creating order for user:', userId);
    console.log('Cart items:', cartItems);
    console.log('Totals:', totals);
    
    // Validate stock availability
    for (const item of cartItems) {
      const product = await Product.findByPk(item.id, { transaction });
      
      if (!product) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Product ${item.name} not found`
        });
      }
      
      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }
    }
    
    // FIXED: Generate order number BEFORE creating the order
    const tempOrderNumber = `ORD-${new Date().getFullYear()}-${Date.now()}-${userId}`;
    
    console.log('Generated order number:', tempOrderNumber);
    
    // Create the main order WITH orderNumber
    const order = await Order.create({
      orderNumber: tempOrderNumber, // FIXED: Include orderNumber in initial creation
      userId,
      total: totals.total,
      subtotal: totals.subtotal,
      shipping: totals.shipping || 0,
      tax: totals.tax || 0,
      customerDetails,
      paymentDetails,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }, { transaction });
    
    console.log('Order created with ID:', order.id);
    
    // Generate final order number with actual ID
    const finalOrderNumber = `ORD-${new Date().getFullYear()}-${String(order.id).padStart(3, '0')}`;
    await order.update({ orderNumber: finalOrderNumber }, { transaction });
    
    console.log('Updated order number to:', finalOrderNumber);
    
    // Create order items and update product stock
    for (const item of cartItems) {
      console.log('Creating order item for:', item.name);
      
      await OrderItem.create({
        orderId: order.id,
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        productName: item.name,
        productImage: item.image
      }, { transaction });
      
      // Update product stock
      await Product.update(
        { 
          stock: sequelize.literal(`stock - ${item.quantity}`),
          sold: sequelize.literal(`sold + ${item.quantity}`)
        },
        { 
          where: { id: item.id },
          transaction 
        }
      );
    }
    
    await transaction.commit();
    
    console.log('✅ Order created successfully:', finalOrderNumber);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order.id,
        orderNumber: finalOrderNumber,
        createdAt: order.createdAt,
        total: order.total
      }
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    console.log('Fetching orders for user:', userId);
    
    const orders = await Order.findAll({
      where: { userId },
      include: [{
        model: OrderItem,
        as: 'items',
        attributes: ['id', 'productId', 'quantity', 'price', 'productName', 'productImage']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`Found ${orders.length} orders for user ${userId}`);
    
    res.status(200).json({
      success: true,
      orders
    });
    
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders
};
