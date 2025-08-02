import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { orderAPI } from "../../../services/orderapi"; // ADD THIS IMPORT
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft,
  CreditCard,
  X,
  Lock,
  Truck,
  Shield,
  MapPin,
  CheckCircle,
  ChevronLeft,
  Building
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ShoppingCart() {
  const navigate = useNavigate();
  const { items: cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartItemsCount } = useCart();
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('review');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null); // ADD THIS STATE
  
  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: ""
  });

  const [paymentDetails, setPaymentDetails] = useState({
    accountNumber: "",
    accountHolderName: "",
    accountType: "checking",
    bankName: ""
  });

  // Calculate totals using actual cart data with proper number parsing
  const subtotal = parseFloat(getCartTotal() || 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    setShowCheckoutModal(true);
    setCheckoutStep('review');
  };

  const proceedToDetails = () => {
    setCheckoutStep('details');
  };

  const proceedToPayment = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address'];
    const isValid = requiredFields.every(field => customerDetails[field].trim() !== '');
    
    if (!isValid) {
      alert('Please fill in all required fields');
      return;
    }
    
    setCheckoutStep('payment');
  };

  // UPDATED: Payment handler with order creation
  const handlePayment = async () => {
    const requiredFields = ['accountNumber', 'accountHolderName', 'bankName'];
    const isValid = requiredFields.every(field => paymentDetails[field].trim() !== '');
    
    if (!isValid) {
      alert('Please fill in all payment information');
      return;
    }

    setCheckoutStep('processing');
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // CREATE ORDER AFTER SUCCESSFUL PAYMENT
      const orderData = {
        cartItems: cartItems,
        customerDetails: customerDetails,
        paymentDetails: {
          method: `${paymentDetails.accountType} account ending in ${paymentDetails.accountNumber.slice(-4)}`,
          accountType: paymentDetails.accountType,
          bankName: paymentDetails.bankName
        },
        totals: {
          subtotal,
          shipping,
          tax,
          total
        }
      };

      console.log('Creating order with data:', orderData);

      const orderResponse = await orderAPI.createOrder(orderData);
      
      if (orderResponse.success) {
        setCheckoutStep('success');
        setIsProcessing(false);
        
        // Store order info for success display
        setOrderInfo({
          orderNumber: orderResponse.order.orderNumber,
          orderId: orderResponse.order.id,
          total: orderResponse.order.total
        });

        console.log('Order created successfully:', orderResponse.order);
      } else {
        throw new Error(orderResponse.message || 'Failed to create order');
      }
      
    } catch (error) {
      console.error('Payment/Order creation failed:', error);
      alert(`Payment processing failed: ${error.message}. Please try again.`);
      setCheckoutStep('payment');
      setIsProcessing(false);
    }
  };

  const handleOrderComplete = () => {
    clearCart(); // Clear cart after successful order
    setShowCheckoutModal(false);
    setCheckoutStep('review');
    setOrderInfo(null);
    navigate('/user/orders'); // Navigate to order history
  };

  const closeModal = () => {
    setShowCheckoutModal(false);
    setCheckoutStep('review');
    setOrderInfo(null);
  };

  const goBack = () => {
    if (checkoutStep === 'details') setCheckoutStep('review');
    else if (checkoutStep === 'payment') setCheckoutStep('details');
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Your gaming gear collection
          </p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
            <p className="text-gray-400 mb-6">
              Ready to gear up? Browse our collection of premium gaming accessories.
            </p>
            <Button 
              onClick={() => navigate("/user/products")}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/user/products")}
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Shopping Cart ({getCartItemsCount()} items)
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Review your gaming gear before checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Cart Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-700/30 rounded-lg">
                    <img
                      src={item.image || "/api/placeholder/150/150"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm sm:text-base mb-2 truncate">
                        {item.name}
                      </h3>
                      <p className="text-green-400 font-bold text-lg">
                        ${parseFloat(item.price || 0).toFixed(2)}
                      </p>
                      {!item.inStock && (
                        <p className="text-red-400 text-sm">Out of stock</p>
                      )}
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-600/50 rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0 text-gray-300 hover:text-white"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-3 py-1 text-white font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 text-gray-300 hover:text-white"
                          disabled={!item.inStock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm sticky top-20">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-gray-700">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold mt-6"
                  onClick={handleCheckout}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  Secure checkout powered by 256-bit SSL encryption
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
              <div className="flex items-center gap-4">
                {(checkoutStep === 'details' || checkoutStep === 'payment') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goBack}
                    className="text-gray-400 hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
                <h2 className="text-xl font-bold text-white">
                  {checkoutStep === 'review' && 'Ready to Checkout?'}
                  {checkoutStep === 'details' && 'Shipping Details'}
                  {checkoutStep === 'payment' && 'Payment Information'}
                  {checkoutStep === 'processing' && 'Processing Payment...'}
                  {checkoutStep === 'success' && 'Payment Successful!'}
                </h2>
              </div>
              {checkoutStep !== 'processing' && checkoutStep !== 'success' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Review Step */}
              {checkoutStep === 'review' && (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>{cartItems.length} items</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-600">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                        <Shield className="h-4 w-4 text-green-400" />
                      </div>
                      <span className="text-sm">Secure payment processing</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                        <Truck className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="text-sm">Fast & reliable shipping</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                        <Lock className="h-4 w-4 text-purple-400" />
                      </div>
                      <span className="text-sm">30-day money-back guarantee</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      onClick={proceedToDetails}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold"
                    >
                      Continue to Payment
                    </Button>
                    
                    <Button 
                      onClick={closeModal}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Back to Cart
                    </Button>
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              )}

              {/* Customer Details Step */}
              {checkoutStep === 'details' && (
                <div className="space-y-6">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">First Name *</Label>
                        <Input
                          value={customerDetails.firstName}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, firstName: e.target.value }))}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          placeholder="John"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">Last Name *</Label>
                        <Input
                          value={customerDetails.lastName}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, lastName: e.target.value }))}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">Email *</Label>
                        <Input
                          type="email"
                          value={customerDetails.email}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          placeholder="john@example.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">Phone *</Label>
                        <Input
                          type="tel"
                          value={customerDetails.phone}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label className="text-gray-300 text-sm">Address *</Label>
                      <Input
                        value={customerDetails.address}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="123 Gaming Street"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={proceedToPayment}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold"
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

              {/* Payment Step */}
              {checkoutStep === 'payment' && (
                <div className="space-y-6">
                  {/* Account Information */}
                  <div className="bg-gray-700/30 rounded-lg p-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Bank Account Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">Account Holder Name *</Label>
                        <Input
                          value={paymentDetails.accountHolderName}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, accountHolderName: e.target.value }))}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">Account Number *</Label>
                        <Input
                          value={paymentDetails.accountNumber}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          placeholder="1234567890"
                          maxLength={17}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-sm">Account Type *</Label>
                          <Select 
                            value={paymentDetails.accountType} 
                            onValueChange={(value) => setPaymentDetails(prev => ({ ...prev, accountType: value }))}
                          >
                            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="checking" className="text-white">Checking</SelectItem>
                              <SelectItem value="savings" className="text-white">Savings</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-sm">Bank Name *</Label>
                          <Input
                            value={paymentDetails.bankName}
                            onChange={(e) => setPaymentDetails(prev => ({ ...prev, bankName: e.target.value }))}
                            className="bg-gray-700/50 border-gray-600 text-white"
                            placeholder="Chase Bank"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-3">Order Total</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-2xl font-bold text-white pt-3 border-t border-gray-600">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <Button 
                    onClick={handlePayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-xl font-bold"
                  >
                    <Lock className="h-6 w-6 mr-3" />
                    Pay ${total.toFixed(2)} Now
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Shield className="h-4 w-4" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                </div>
              )}

              {/* Processing Step */}
              {checkoutStep === 'processing' && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold text-white mb-2">Processing Your Payment</h3>
                  <p className="text-gray-400">Please don't close this window...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              )}

              {/* Success Step - UPDATED with real order data */}
              {checkoutStep === 'success' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
                  <p className="text-gray-400 mb-6">
                    Your payment has been processed and your order is confirmed.
                  </p>
                  
                  <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Order Number</p>
                        <p className="text-white font-medium">{orderInfo?.orderNumber || 'Generating...'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Amount Paid</p>
                        <p className="text-white font-medium">${orderInfo?.total ? parseFloat(orderInfo.total).toFixed(2) : total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Payment Method</p>
                        <p className="text-white font-medium">Bank Transfer</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Estimated Delivery</p>
                        <p className="text-white font-medium">3-5 business days</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={handleOrderComplete}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                    >
                      View Order Details
                    </Button>
                    <Button 
                      onClick={() => navigate('/user/products')}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
