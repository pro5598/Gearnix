import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../../../services/orderAPI";
import { productAPI } from "../../../services/api";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  Activity,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
  Loader
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: [],
    orderStats: {
      thisMonth: 0,
      thisMonthRevenue: 0,
      completedOrders: 0,
      processingOrders: 0,
      cancelledOrders: 0
    },
    productStats: {
      activeProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0
    }
  });

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchAdminDashboardData();
  }, []);

  const fetchAdminDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel
      await Promise.all([
        fetchAllOrders(),
        fetchAllProducts(),
        fetchUserCount() // You'll need to implement this API endpoint
      ]);

      console.log('✅ Admin dashboard data loaded successfully');
    } catch (err) {
      console.error('❌ Error fetching admin dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    try {
      console.log('🔄 Fetching all orders for admin dashboard...');
      
      // Try different API endpoints for admin
      let response;
      try {
        response = await orderAPI.getOrders(); // This should get all orders for admin
        console.log('📡 Admin orders API response:', response);
      } catch (firstError) {
        console.log('❌ getOrders failed, trying alternative:', firstError);
        try {
          response = await orderAPI.getUserOrders();
          console.log('📡 Fallback orders API response:', response);
        } catch (secondError) {
          console.error('❌ Both API calls failed:', secondError);
          throw new Error('Unable to fetch orders from any API endpoint');
        }
      }
      
      if (response && (response.success || response.orders || Array.isArray(response))) {
        let orders = [];
        
        // Handle different response structures
        if (response.orders) {
          orders = response.orders;
        } else if (Array.isArray(response.data)) {
          orders = response.data;
        } else if (Array.isArray(response)) {
          orders = response;
        }
        
        console.log('📊 Total orders loaded:', orders.length);

        // Calculate comprehensive stats
        const totalOrders = orders.length;
        let totalRevenue = 0;
        let pendingOrders = 0;
        let completedOrders = 0;
        let processingOrders = 0;
        let cancelledOrders = 0;
        
        // Get current month data
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        let thisMonthOrders = 0;
        let thisMonthRevenue = 0;

        orders.forEach((order) => {
          // Calculate revenue using multiple field strategies
          let orderTotal = 0;
          const possibleTotalFields = ['total', 'totalAmount', 'subtotal', 'price', 'amount', 'finalAmount'];
          
          for (const fieldName of possibleTotalFields) {
            const fieldValue = order[fieldName];
            if (fieldValue !== undefined && fieldValue !== null && !isNaN(parseFloat(fieldValue)) && fieldValue > 0) {
              orderTotal = parseFloat(fieldValue);
              break;
            }
          }

          // Calculate from items if no total field found
          if (orderTotal === 0 && order.items && order.items.length > 0) {
            orderTotal = order.items.reduce((sum, item) => {
              const itemPrice = parseFloat(item.price || item.product?.price || 0);
              const itemQuantity = parseInt(item.quantity || 1);
              return sum + (itemPrice * itemQuantity);
            }, 0);
          }

          totalRevenue += orderTotal;

          // Count order statuses
          const status = (order.status || 'pending').toLowerCase();
          switch (status) {
            case 'pending':
              pendingOrders++;
              break;
            case 'completed':
            case 'delivered':
              completedOrders++;
              break;
            case 'processing':
            case 'shipped':
              processingOrders++;
              break;
            case 'cancelled':
            case 'canceled':
              cancelledOrders++;
              break;
          }

          // Check if order is from this month
          const orderDate = new Date(order.createdAt || order.created_at || order.date);
          if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
            thisMonthOrders++;
            thisMonthRevenue += orderTotal;
          }
        });

        // Get recent orders (last 10)
        const recentOrders = orders
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || a.created_at || a.date || 0);
            const dateB = new Date(b.createdAt || b.created_at || b.date || 0);
            return dateB - dateA;
          })
          .slice(0, 10)
          .map(order => {
            let orderTotal = 0;
            
            // Calculate total using same logic
            const possibleTotalFields = ['total', 'totalAmount', 'subtotal', 'price', 'amount', 'finalAmount'];
            
            for (const fieldName of possibleTotalFields) {
              const fieldValue = order[fieldName];
              if (fieldValue !== undefined && fieldValue !== null && !isNaN(parseFloat(fieldValue)) && fieldValue > 0) {
                orderTotal = parseFloat(fieldValue);
                break;
              }
            }

            if (orderTotal === 0 && order.items && order.items.length > 0) {
              orderTotal = order.items.reduce((sum, item) => {
                const itemPrice = parseFloat(item.price || item.product?.price || 0);
                const itemQuantity = parseInt(item.quantity || 1);
                return sum + (itemPrice * itemQuantity);
              }, 0);
            }

            return {
              id: order.orderNumber || order.id,
              customer: order.user?.firstName || order.user?.username || order.customerName || 'Unknown Customer',
              amount: orderTotal,
              status: order.status || 'pending',
              time: formatTimeAgo(order.createdAt || order.created_at || order.date),
              userId: order.userId || order.user?.id
            };
          });

        // Update dashboard data
        setDashboardData(prev => ({
          ...prev,
          totalOrders,
          totalRevenue,
          pendingOrders,
          recentOrders,
          orderStats: {
            thisMonth: thisMonthOrders,
            thisMonthRevenue,
            completedOrders,
            processingOrders,
            cancelledOrders
          }
        }));

        console.log('📊 Order stats calculated:', {
          totalOrders,
          totalRevenue,
          pendingOrders,
          thisMonthOrders,
          thisMonthRevenue
        });

      } else {
        throw new Error('Invalid orders API response');
      }
    } catch (error) {
      console.error('❌ Error fetching admin orders:', error);
      throw error;
    }
  };

  const fetchAllProducts = async () => {
    try {
      console.log('🔄 Fetching all products for admin dashboard...');
      const response = await productAPI.getProducts({
        limit: 1000 // Get all products
      });

      let productsArray = [];
      if (response.data && response.data.products) {
        productsArray = response.data.products;
      } else if (response.products) {
        productsArray = response.products;
      } else if (Array.isArray(response.data)) {
        productsArray = response.data;
      } else if (Array.isArray(response)) {
        productsArray = response;
      }

      const totalProducts = productsArray.length;
      const activeProducts = productsArray.filter(p => p.status === 'active').length;
      const lowStockProducts = productsArray.filter(p => p.stock > 0 && p.stock <= 10).length;
      const outOfStockProducts = productsArray.filter(p => p.stock === 0).length;

      setDashboardData(prev => ({
        ...prev,
        totalProducts,
        productStats: {
          activeProducts,
          lowStockProducts,
          outOfStockProducts
        }
      }));

      console.log('📦 Product stats calculated:', {
        totalProducts,
        activeProducts,
        lowStockProducts,
        outOfStockProducts
      });

    } catch (error) {
      console.error('❌ Error fetching admin products:', error);
      // Don't throw error, just log it as products might not be critical
    }
  };

  const fetchUserCount = async () => {
    try {
      // This endpoint would need to be implemented in your backend
      // For now, we'll use a placeholder or calculate from orders
      console.log('👥 Calculating user count from available data...');
      
      // You could implement a users API endpoint like:
      // const response = await fetch('/api/admin/users/count');
      // const data = await response.json();
      // setDashboardData(prev => ({ ...prev, totalUsers: data.count }));

      // For now, estimate from unique order users
      if (dashboardData.recentOrders.length > 0) {
        const uniqueUsers = new Set(dashboardData.recentOrders.map(order => order.userId).filter(Boolean));
        setDashboardData(prev => ({
          ...prev,
          totalUsers: uniqueUsers.size * 10 // Rough estimate
        }));
      }

    } catch (error) {
      console.error('❌ Error fetching user count:', error);
      // Set a default value
      setDashboardData(prev => ({ ...prev, totalUsers: 0 }));
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
      case 'closed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
      case 'open':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing':
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <span className="ml-4 text-gray-300 text-lg">Loading admin dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Welcome to Gearnix Admin Panel - Monitor your gaming platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchAdminDashboardData}
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              onClick={fetchAdminDashboardData}
              variant="ghost"
              size="sm"
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Estimated count</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Products</p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData.totalProducts}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {dashboardData.productStats.activeProducts} active
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData.totalOrders}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  +{dashboardData.orderStats.thisMonth} this month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Revenue</p>
                <p className="text-2xl font-bold text-white">
                  ${dashboardData.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  +${dashboardData.orderStats.thisMonthRevenue.toFixed(0)} this month
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Pending Orders</p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData.pendingOrders}
                </p>
                <p className="text-xs text-gray-500 mt-1">Need attention</p>
              </div>
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData.productStats.lowStockProducts}
                </p>
                <p className="text-xs text-gray-500 mt-1">Products ≤10 stock</p>
              </div>
              <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders - Now takes full width */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!dashboardData.recentOrders || dashboardData.recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No orders found</p>
              <p className="text-gray-500 text-sm">Orders will appear here once customers start placing them</p>
            </div>
          ) : (
            <>
              {dashboardData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium text-sm">{order.id}</span>
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">{order.customer}</p>
                    <p className="text-gray-500 text-xs">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">${order.amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => navigate('/admin/orders')}
              >
                View All Orders
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
