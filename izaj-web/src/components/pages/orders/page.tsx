"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import RequireAuth from '../../common/RequireAuth';
import AccountSidebar from '../../common/AccountSidebar';
import { useUserContext } from '../../../context/UserContext';
import { useCartContext } from '../../../context/CartContext';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'approved' | 'in_transit' | 'complete' | 'cancelled';
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number; // Sale price (discounted price)
    originalPrice?: number; // Original price if on sale
    discount?: number; // Total discount amount
    productId?: string;
  }>;
  total: number;
  shippingFee: number;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
  cancellationReason?: string;
  adminNotes?: string;
}

const MyOrders: React.FC = () => {
  const { user } = useUserContext();
  const { clearCart } = useCartContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successOrderNumber, setSuccessOrderNumber] = useState<string>('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelReasonDropdown, setShowCancelReasonDropdown] = useState(false);
  const [isCancelReasonInputFocused, setIsCancelReasonInputFocused] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });
  // Initialize reviewed orders from localStorage
  const getInitialReviewedOrders = (): Set<string> => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reviewedOrders');
      if (saved) {
        try {
          const orderIds = JSON.parse(saved);
          return new Set(orderIds);
        } catch (error) {
          console.error('Error loading reviewed orders:', error);
        }
      }
    }
    return new Set();
  };

  const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(getInitialReviewedOrders);

  // Predefined cancellation reasons
  const cancellationReasons = [
    'Changed my mind',
    'Found a better price elsewhere',
    'Ordered by mistake',
    'Item no longer needed',
    'Shipping takes too long',
    'Payment issue',
    'Duplicate order',
    'Other reason'
  ];

  // Save reviewed orders to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reviewedOrders', JSON.stringify(Array.from(reviewedOrders)));
    }
  }, [reviewedOrders]);

  useEffect(() => {
    // Check for success message from checkout
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const success = params.get('success');
      const orderNumber = params.get('order');
      const orderCompleted = params.get('order_completed');
      
      // Clear cart if order was just completed
      if (orderCompleted === 'true') {
        clearCart();
        // Clear URL parameters
        window.history.replaceState({}, '', '/orders');
      }
      
      if (success === 'true' && orderNumber) {
        setShowSuccessMessage(true);
        setSuccessOrderNumber(orderNumber);
        
        // Clear URL parameters
        window.history.replaceState({}, '', '/orders');
        
        // Hide message after 10 seconds
        setTimeout(() => setShowSuccessMessage(false), 10000);
      }
    }
  }, [clearCart]);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // Import the service
        const { getOrders: fetchOrdersFromAPI } = await import('@/services/orderService');
        const result = await fetchOrdersFromAPI('all', 100, 0);
        
        if (result.success && result.data) {
          // Transform API data to match our Order interface
          const transformedOrders = (result.data as any[]).map((order) => {
            // Map old statuses to new ones
            let status = order.status;
            if (status === 'delivering') status = 'in_transit';
            
            return {
              id: order.id,
              orderNumber: order.order_number,
              date: order.created_at,
              status: status,
              items: order.items?.map((item: any) => {
                const unitPrice = parseFloat(item.unit_price); // Sale price
                const discount = parseFloat(item.discount || 0); // Total discount amount
                const discountPerUnit = item.quantity > 0 ? discount / item.quantity : 0;
                const originalPrice = discount > 0 ? unitPrice + discountPerUnit : undefined;
                
                return {
                  id: item.id,
                  name: item.product_name,
                  image: item.product_image || '/placeholder.jpg',
                  quantity: item.quantity,
                  price: unitPrice, // Sale price (discounted price)
                  originalPrice: originalPrice, // Calculated from unit_price + discount
                  discount: discount, // Total discount amount
                  productId: item.product_id
                };
              }) || [],
              total: parseFloat(order.total_amount),
              shippingFee: parseFloat(order.shipping_fee || 0),
              shippingAddress: `${order.shipping_city}, ${order.shipping_province}`,
              paymentMethod: order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 
                            order.payment_method === 'gcash' ? 'GCash' :
                            order.payment_method === 'maya' ? 'Maya' : 'Credit Card',
              trackingNumber: order.tracking_number || undefined,
              cancellationReason: order.cancellation_reason || undefined,
              adminNotes: order.admin_notes || undefined
            };
          });
          
          setOrders(transformedOrders);
        } else {
          console.warn('Failed to fetch orders from API');
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'mdi:clock-outline';
      case 'approved':
        return 'mdi:check-circle';
      case 'in_transit':
        return 'mdi:truck-fast';
      case 'complete':
        return 'mdi:check-all';
      case 'cancelled':
        return 'mdi:close-circle';
      default:
        return 'mdi:package';
    }
  };

  const getStatusLabel = (status: Order['status'], isMobile: boolean = false) => {
    const labels: Record<Order['status'], { full: string; mobile: string }> = {
      pending: { full: 'Pending', mobile: 'Pending' },
      approved: { full: 'Approved', mobile: 'Approved' },
      in_transit: { full: 'In Transit', mobile: 'Transit' },
      complete: { full: 'Complete', mobile: 'Complete' },
      cancelled: { full: 'Cancelled', mobile: 'Cancel' }
    };
    
    const label = labels[status] || { full: status, mobile: status };
    return isMobile ? label.mobile : label.full;
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in_transit':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'complete':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusSteps = (status: Order['status']) => {
    const steps = [
      { key: 'pending', label: 'Pending', icon: 'mdi:clock-outline' },
      { key: 'approved', label: 'Approved', icon: 'mdi:check-circle' },
      { key: 'in_transit', label: 'In Transit', icon: 'mdi:truck-fast' },
      { key: 'complete', label: 'Complete', icon: 'mdi:check-all' }
    ];

    if (status === 'cancelled') {
      return [
        { key: 'cancelled', label: 'Cancelled', icon: 'mdi:close-circle', active: true, completed: true }
      ];
    }

    const statusOrder = ['pending', 'approved', 'in_transit', 'complete'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      active: index === currentIndex,
      completed: index < currentIndex
    }));
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleCancelOrder = () => {
    if (selectedOrder) {
      setOrderToCancel(selectedOrder);
      setShowCancelModal(true);
      setSelectedOrder(null); // Close the order details modal
      setCancelReason('');
      setShowCancelReasonDropdown(false);
      setIsCancelReasonInputFocused(false);
    }
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel || !cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    try {
      const { cancelOrder: cancelOrderAPI } = await import('@/services/orderService');
      const result = await cancelOrderAPI(orderToCancel.id, cancelReason);

      if (result.success) {
        // Update local state
        setOrders(prev => prev.map(order => 
          order.id === orderToCancel.id 
            ? { ...order, status: 'cancelled', cancellationReason: cancelReason } 
            : order
        ));
        
        // Close modals
        setShowCancelModal(false);
        setOrderToCancel(null);
        setCancelReason('');
        setShowCancelReasonDropdown(false);
        setIsCancelReasonInputFocused(false);
        
        // Show success message
        alert('Order cancelled successfully');
        
        // Refresh orders
        const fetchOrders = async () => {
          const { getOrders: fetchOrdersFromAPI } = await import('@/services/orderService');
          const result = await fetchOrdersFromAPI('all', 100, 0);
          if (result.success && result.data) {
            const transformedOrders = (result.data as any[]).map((order) => {
              // Map old statuses to new ones
              let status = order.status;
              if (status === 'delivering') status = 'in_transit';
              
              return {
                id: order.id,
                orderNumber: order.order_number,
                date: order.created_at,
                status: status,
                items: order.items?.map((item: any) => {
                  const unitPrice = parseFloat(item.unit_price); // Sale price
                  const discount = parseFloat(item.discount || 0); // Total discount amount
                  const discountPerUnit = item.quantity > 0 ? discount / item.quantity : 0;
                  const originalPrice = discount > 0 ? unitPrice + discountPerUnit : undefined;
                  
                  return {
                    id: item.id,
                    name: item.product_name,
                    image: item.product_image || '/placeholder.jpg',
                    quantity: item.quantity,
                    price: unitPrice, // Sale price (discounted price)
                    originalPrice: originalPrice, // Calculated from unit_price + discount
                    discount: discount, // Total discount amount
                    productId: item.product_id
                  };
                }) || [],
                total: parseFloat(order.total_amount),
                shippingFee: parseFloat(order.shipping_fee || 0),
                shippingAddress: `${order.shipping_city}, ${order.shipping_province}`,
                paymentMethod: order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 
                              order.payment_method === 'gcash' ? 'GCash' :
                              order.payment_method === 'maya' ? 'Maya' : 'Credit Card',
              trackingNumber: order.tracking_number || undefined,
              cancellationReason: order.cancellation_reason || undefined,
              adminNotes: order.admin_notes || undefined
            };
            });
            setOrders(transformedOrders);
          }
        };
        fetchOrders();
      } else {
        alert(result.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const submitReview = async (order?: Order) => {
    const orderToReview = order || selectedOrder;
    
    if (!orderToReview || !reviewComment.trim()) {
      setToast({ show: true, message: 'Please write a review comment', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
      return;
    }

    setIsSubmittingReview(true);
    try {
      // Prepare review data
      const reviewData = {
        order_id: orderToReview.id,
        order_number: orderToReview.orderNumber,
        rating: reviewRating,
        comment: reviewComment,
        items: orderToReview.items.map(item => ({
          product_id: item.productId || item.id,
          product_name: item.name
        }))
      };

      console.log('📝 Submitting reviews:', reviewData);
      
      // Send to API
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

      const result = await response.json();

      if (result.success) {
        // Mark order as reviewed
        setReviewedOrders(prev => new Set(prev).add(orderToReview.id));
        
        // Order should already be complete, no need to update status
        
        // Close review form and show success
        setShowReviewForm(false);
        setReviewOrderId(null);
        setReviewRating(5);
        setReviewComment('');
        setToast({ show: true, message: 'Thank you for your review! Your feedback has been submitted and will appear on the product page.', type: 'success' });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
      } else {
        setToast({ show: true, message: result.error || 'Failed to submit review. Please try again.', type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
      }
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      setToast({ show: true, message: 'Failed to submit review. Please try again.', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <RequireAuth>
      <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: 'Jost, sans-serif' }}>
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
            <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 shadow-2xl animate-bounce">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Icon icon="mdi:check-circle" className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-semibold text-green-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Order Placed Successfully!</h3>
                  <p className="mt-1 text-sm text-green-700" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                    Your order <span className="font-bold" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{successOrderNumber}</span> has been received and is being processed.
                  </p>
                  <p className="mt-1 text-xs text-green-600" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                    We&apos;ll send you updates via email.
                  </p>
                </div>
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="flex-shrink-0 ml-4 text-green-600 hover:text-green-800"
                >
                  <Icon icon="mdi:close" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast.show && (
          <div className="fixed top-4 right-4 z-[100] max-w-md w-full mx-4 animate-slideIn">
            <div className={`border-2 rounded-xl p-4 shadow-2xl ${
              toast.type === 'success' 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Icon 
                    icon={toast.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'} 
                    className={`w-6 h-6 ${toast.type === 'success' ? 'text-green-600' : 'text-red-600'}`} 
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className={`text-sm ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`} style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => setToast({ show: false, message: '', type: 'success' })}
                  className={`flex-shrink-0 ml-4 ${toast.type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}
                >
                  <Icon icon="mdi:close" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile: My Account Navigation removed per request */}

        {/* Main Content */}
        <main className="flex-grow py-6 md:py-12 pb-24 lg:pb-12 bg-white">
          <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-0">
            {/* Header Section - Similar to ProductList */}
            <div className="mb-6 sm:mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-800 mb-2 mt-0 sm:mt-1 lg:mt-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                My Orders
              </h1>
              
              {/* Horizontal line under title */}
              <div className="w-24 h-0.5 bg-gray-800 mx-auto mb-8"></div>
              
              <div className="max-w-4xl mx-auto">
                <p className="text-gray-700 text-sm sm:text-base mb-6 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                  Track and manage your orders. View order details, status updates, and more.
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
              {/* Left Column - Sidebar - Only on large screens */}
              <AccountSidebar 
                userData={user ? { firstName: user.firstName, lastName: user.lastName } : { firstName: '', lastName: '' }}
                profileImage={user?.profilePicture || ''}
                activePage="orders"
              />

              {/* Right Column - Orders Content */}
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-300">

                  {/* Filter Tabs */}
                  <div className="border-b border-gray-200 bg-white sticky top-0 z-0">
                    <div className="flex overflow-x-auto scrollbar-hide lg:justify-center -mx-4 sm:mx-0 px-4 sm:px-0">
                      {[
                        { key: 'all', label: 'All Orders', icon: 'mdi:package-variant-closed', shortLabel: 'All' },
                        { key: 'pending', label: 'Pending', icon: 'mdi:clock-outline', shortLabel: 'Pending' },
                        { key: 'approved', label: 'Approved', icon: 'mdi:check-circle', shortLabel: 'Approved' },
                        { key: 'in_transit', label: 'In Transit', icon: 'mdi:truck-fast', shortLabel: 'Transit' },
                        { key: 'complete', label: 'Complete', icon: 'mdi:check-all', shortLabel: 'Complete' },
                        { key: 'cancelled', label: 'Cancelled', icon: 'mdi:close-circle', shortLabel: 'Cancelled' }
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setSelectedStatus(tab.key)}
                          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                            selectedStatus === tab.key
                              ? 'text-black border-b-2 border-black bg-gray-50 sm:bg-transparent'
                              : 'text-gray-600 hover:text-black hover:bg-gray-50'
                          }`}
                          style={{ fontFamily: 'Jost, sans-serif', fontWeight: selectedStatus === tab.key ? 600 : 500 }}
                        >
                          <Icon icon={tab.icon} className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="hidden sm:inline">{tab.label}</span>
                          <span className="sm:hidden">{tab.shortLabel}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="p-4 sm:p-6">
                    {isLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <Icon icon="mdi:loading" className="w-8 h-8 text-gray-400 animate-spin" />
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <div className="text-center py-12">
                        <Icon icon="mdi:package-variant-closed" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>No orders found</p>
                        <p className="text-gray-400 text-sm mt-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Start shopping to see your orders here</p>
                        <Link 
                          href="/product-list"
                          className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium text-sm sm:text-base w-full sm:w-auto text-center"
                          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}
                        >
                          Browse Products
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredOrders.map((order) => (
                          <React.Fragment key={order.id}>
                          <div
                            className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200 bg-white"
                          >
                            {/* Order Header */}
                            <div className="mb-4">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 sm:justify-between">
                                <div className="flex flex-col gap-1">
                                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Order ID</p>
                                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                    <h4 className="text-base sm:text-lg font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{order.orderNumber}</h4>
                                  <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-xs sm:text-sm font-semibold ${getStatusColor(order.status)}`} style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                                    <Icon icon={getStatusIcon(order.status)} className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="hidden sm:inline whitespace-nowrap">{getStatusLabel(order.status, false)}</span>
                                    <span className="sm:hidden whitespace-nowrap">{getStatusLabel(order.status, true)}</span>
                                  </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <span className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Total:</span>
                                  <span className="text-base sm:text-lg font-bold text-black" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{formatPrice(order.total + order.shippingFee)}</span>
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{formatDate(order.date)}</p>
                            </div>

                            {/* Order Items and Buttons */}
                            <div className="flex flex-col lg:flex-row gap-4 mb-4">
                              {/* Order Items */}
                              <div className="flex-1 space-y-3">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                      <img 
                                        src={item.image} 
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs sm:text-sm font-medium text-gray-800 truncate" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>{item.name}</p>
                                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Buttons */}
                              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="w-full sm:w-auto lg:w-full px-4 py-2.5 sm:py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                                  style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}
                                >
                                  <Icon icon="mdi:eye-outline" className="w-4 h-4" />
                                  View Details
                                </button>
                                {order.status === 'complete' && !reviewedOrders.has(order.id) && (
                                  <button
                                    onClick={() => {
                                      setShowReviewForm(true);
                                      setReviewOrderId(order.id);
                                      setReviewRating(5);
                                      setReviewComment('');
                                    }}
                                    className="w-full sm:w-auto lg:w-full px-4 py-2.5 sm:py-2 text-white rounded-lg transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                                    style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500, backgroundColor: '#00A86B' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#009059'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00A86B'}
                                  >
                                    <Icon icon="mdi:star-outline" className="w-4 h-4" />
                                    Leave Review
                                  </button>
                                )}
                                {order.status === 'complete' && reviewedOrders.has(order.id) && (
                                  <span className="w-full sm:w-auto lg:w-full px-4 py-2.5 sm:py-2 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm flex items-center justify-center gap-2 whitespace-nowrap">
                                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-600" />
                                    Review Submitted
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Order Details */}
                            <div className="border-t border-gray-100 pt-4">
                              {order.trackingNumber && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Tracking Number:</span>
                                  <span className="text-gray-800 font-medium" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>{order.trackingNumber}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Review Form - Show inline for complete orders that haven't been reviewed */}
                          {order.status === 'complete' && !reviewedOrders.has(order.id) && showReviewForm && reviewOrderId === order.id && (
                            <div className="mt-4 bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-4 sm:p-6 shadow-lg">
                              <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                    <Icon icon="mdi:star" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                  </div>
                                  <h3 className="text-base sm:text-xl font-bold text-gray-800 truncate" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                                    Leave a Review
                                  </h3>
                                </div>
                                <button
                                  onClick={() => {
                                    setShowReviewForm(false);
                                    setReviewOrderId(null);
                                    setReviewRating(5);
                                    setReviewComment('');
                                  }}
                                  className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
                                  disabled={isSubmittingReview}
                                >
                                  <Icon icon="mdi:close" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                </button>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                                  Order: <span className="font-semibold" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{order.orderNumber}</span>
                                </p>
                                <p className="text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                                  Share your experience with the products from this order
                                </p>
                              </div>

                              {/* Rating */}
                              <div className="mb-6">
                                <label className="block text-base font-bold text-gray-800 mb-3" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                                  How would you rate your experience?
                                </label>
                                <div className="flex gap-2 justify-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setReviewRating(star)}
                                      className="transition-all duration-200 hover:scale-110 transform"
                                      disabled={isSubmittingReview}
                                    >
                                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                                        star <= reviewRating 
                                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg scale-110' 
                                          : 'bg-gray-100 hover:bg-gray-200'
                                      }`}>
                                        <Icon 
                                          icon={star <= reviewRating ? "mdi:star" : "mdi:star-outline"} 
                                          className={`w-6 h-6 ${
                                            star <= reviewRating ? 'text-white' : 'text-gray-400'
                                          }`}
                                        />
                                      </div>
                                    </button>
                                  ))}
                                </div>
                                <p className="text-center text-sm text-gray-500 mt-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                                  {reviewRating === 1 && "Poor"}
                                  {reviewRating === 2 && "Fair"}
                                  {reviewRating === 3 && "Good"}
                                  {reviewRating === 4 && "Very Good"}
                                  {reviewRating === 5 && "Excellent"}
                                </p>
                              </div>

                              {/* Comment */}
                              <div className="mb-6">
                                <label className="block text-base font-bold text-gray-800 mb-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                                  Tell us about your experience <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Share your thoughts about the products, quality, delivery, or overall experience..."
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all duration-200 bg-white shadow-sm"
                                    disabled={isSubmittingReview}
                                    required
                                    style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}
                                  />
                                  <div className="absolute bottom-2 right-2 text-xs text-gray-400" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                                    {reviewComment.length}/500
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                  onClick={() => {
                                    setShowReviewForm(false);
                                    setReviewOrderId(null);
                                    setReviewRating(5);
                                    setReviewComment('');
                                  }}
                                  className="w-full sm:flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={isSubmittingReview}
                                  style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => submitReview(order)}
                                  disabled={isSubmittingReview || !reviewComment.trim()}
                                  className="w-full sm:flex-1 px-4 py-3 text-white rounded-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                  style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600, backgroundColor: '#00A86B' }}
                                  onMouseEnter={(e) => !isSubmittingReview && !reviewComment.trim() && (e.currentTarget.style.backgroundColor = '#009059')}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00A86B'}
                                >
                                  {isSubmittingReview ? (
                                    <>
                                      <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                                      Submitting...
                                    </>
                                  ) : (
                                    <>
                                      <Icon icon="mdi:check" className="w-4 h-4" />
                                      Submit Review
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                          </React.Fragment>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        </main>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-[9999] flex items-start justify-end"
            onClick={() => setSelectedOrder(null)}
          >
            <div 
              className="relative w-full sm:w-[420px] md:w-[500px] lg:w-[540px] xl:w-[580px] bg-gradient-to-b from-gray-50 to-white h-screen shadow-2xl overflow-y-auto z-[10000] modal-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-20 bg-white px-4 sm:px-6 py-4 sm:py-5 border-b-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 truncate" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                      Order Details
                    </h2>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Order ID</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{selectedOrder.orderNumber}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
                  >
                    <Icon icon="mdi:close" width="24" height="24" className="text-gray-700" />
                  </button>
                </div>
                {/* Status Badge */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 text-xs sm:text-sm font-semibold shadow-md ${getStatusColor(selectedOrder.status)}`} style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                    <Icon icon={getStatusIcon(selectedOrder.status)} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="whitespace-nowrap">{getStatusLabel(selectedOrder.status, false)}</span>
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-4 sm:p-6">

              {/* Modal Content */}
              <div className="space-y-6">
                {/* All Order Details in One Container */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
                  {/* Order Items Section */}
                  <div className="p-3 sm:p-4 border-b-2 border-gray-200 bg-gradient-to-r from-gray-100 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center">
                        <Icon icon="mdi:cart-outline" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Order Items</h4>
                      <span className="ml-auto text-xs sm:text-sm font-semibold text-gray-600 bg-gray-200 px-2 sm:px-3 py-1 rounded-lg" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                        {selectedOrder.items.length} {selectedOrder.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200">
                        <div className="relative">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-sm">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-lg">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-gray-800 mb-1 truncate" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{item.name}</p>
                          <p className="text-xs text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {item.originalPrice && item.originalPrice > item.price && item.discount && item.discount > 0 ? (
                            <div>
                              <p className="text-xs text-gray-400 line-through" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                                {formatPrice(item.originalPrice * item.quantity)}
                              </p>
                              <p className="text-xs sm:text-sm font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                                {formatPrice(item.price * item.quantity)}
                              </p>
                              <p className="text-xs text-green-600 font-semibold mt-0.5" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                                -{formatPrice(item.discount)} discount
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs sm:text-sm font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cancellation Reason Section - Only show if order is cancelled */}
                  {selectedOrder.status === 'cancelled' ? (
                    <div className="p-4 sm:p-5 border-t-2 border-gray-200">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Icon icon="mdi:close-circle" className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Cancellation Details</h4>
                      </div>
                      <div className="space-y-3 pl-8 sm:pl-10">
                        {selectedOrder.cancellationReason && (
                          <div className="flex items-start gap-2 sm:gap-3 bg-red-50 rounded-lg p-3 sm:p-4 border-2 border-red-200">
                            <Icon icon="mdi:alert-circle" className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Reason for Cancellation</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-800 break-words" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                                {selectedOrder.cancellationReason}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedOrder.adminNotes && (
                          <div className="flex items-start gap-2 sm:gap-3 bg-gray-50 rounded-lg p-3 sm:p-4 border-2 border-gray-200">
                            <Icon icon="mdi:note-text" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Admin Notes</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-800 break-words whitespace-pre-wrap" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                                {selectedOrder.adminNotes}
                              </p>
                            </div>
                          </div>
                        )}
                        {!selectedOrder.cancellationReason && !selectedOrder.adminNotes && (
                          <div className="flex items-start gap-2 sm:gap-3 bg-gray-50 rounded-lg p-3 sm:p-4 border-2 border-gray-200">
                            <Icon icon="mdi:information" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                                No cancellation details available
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                  {/* Shipping Details Section */}
                  <div className="p-4 sm:p-5 border-t-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon icon="mdi:truck-delivery" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Shipping Details</h4>
                    </div>
                    <div className="space-y-3 pl-8 sm:pl-10">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Icon icon="mdi:map-marker" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Delivery Address</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-800 break-words" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{selectedOrder.shippingAddress}</p>
                        </div>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex items-start gap-2 sm:gap-3 bg-blue-50 rounded-lg p-2 sm:p-3 border-2 border-blue-200">
                          <Icon icon="mdi:package-variant" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Tracking Number</p>
                            <p className="text-xs sm:text-sm font-bold text-blue-600 break-all" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{selectedOrder.trackingNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment & Order Info Section */}
                  <div className="p-4 sm:p-5 border-t-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon icon="mdi:credit-card" className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Payment & Info</h4>
                    </div>
                    <div className="space-y-3 pl-8 sm:pl-10">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Icon icon="mdi:calendar" className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Order Date</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{formatDate(selectedOrder.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Icon icon="mdi:wallet" className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Payment Method</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{selectedOrder.paymentMethod}</p>
                        </div>
                      </div>
                      {/* Total Breakdown */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                              Items Total
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                              {formatPrice(selectedOrder.total)}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                              Shipping Fee
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                              {selectedOrder.status === 'pending' 
                                ? 'Pending' 
                                : selectedOrder.shippingFee === 0 
                                  ? 'FREE' 
                                  : formatPrice(selectedOrder.shippingFee)}
                            </p>
                          </div>
                          <div className="border-t-2 border-green-300 pt-2 mt-2">
                            <div className="flex justify-between items-center">
                              <p className="text-sm sm:text-base font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                                Grand Total
                              </p>
                              <p className="text-xl sm:text-2xl font-bold text-green-600" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                                {formatPrice(selectedOrder.total + selectedOrder.shippingFee)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    </>
                  )}
                </div>

              </div>


              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
                <div className="space-y-2 sm:space-y-3">
                  {/* Cancel Button - Only for Pending Orders */}
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={handleCancelOrder}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 rounded-xl shadow-md"
                      style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                    >
                      <Icon icon="mdi:close-circle" className="w-4 h-4 sm:w-5 sm:h-5" />
                      Cancel Order
                    </button>
                  )}
                  
                  {/* Contact Support - For Active Orders (not cancelled/complete) */}
                  {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'complete' && selectedOrder.status !== 'pending' && (
                    <button
                      className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-200 flex items-center justify-center gap-2 rounded-xl shadow-md"
                      style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                    >
                      <Icon icon="mdi:message-outline" className="w-4 h-4 sm:w-5 sm:h-5" />
                      Contact Support
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Cancel Order Confirmation Modal */}
        {showCancelModal && orderToCancel && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-[60] flex items-center justify-center p-4 modal-backdrop"
            onClick={() => {
              if (!isCancelling) {
                setShowCancelModal(false);
                setOrderToCancel(null);
                setCancelReason('');
                setShowCancelReasonDropdown(false);
                setIsCancelReasonInputFocused(false);
              }
            }}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] modal-scale-in overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex-shrink-0 bg-white px-6 py-5 border-b-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Icon icon="mdi:alert-circle" className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Cancel Order?</h3>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Order: {orderToCancel.orderNumber}</p>
                  </div>
                </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs text-red-800 flex items-start gap-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                    <Icon icon="mdi:information" className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      Are you sure you want to cancel this order? This action cannot be undone.
                    </span>
                  </p>
                </div>
                </div>

              {/* Content Container */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Order Items Section */}
                  <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
                    <div className="p-3 sm:p-4 border-b-2 border-gray-200 bg-gradient-to-r from-gray-100 to-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center">
                          <Icon icon="mdi:cart-outline" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Order Items</h4>
                        <span className="ml-auto text-xs sm:text-sm font-semibold text-gray-600 bg-gray-200 px-2 sm:px-3 py-1 rounded-lg" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                          {orderToCancel.items.length} {orderToCancel.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 space-y-3">
                      {orderToCancel.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200">
                          <div className="relative">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-sm">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-lg">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-gray-800 mb-1 truncate" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{item.name}</p>
                            <p className="text-xs text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            {item.originalPrice && item.originalPrice > item.price && item.discount && item.discount > 0 ? (
                              <div>
                                <p className="text-xs text-gray-400 line-through" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                                  {formatPrice(item.originalPrice * item.quantity)}
                                </p>
                                <p className="text-xs sm:text-sm font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            ) : (
                              <p className="text-xs sm:text-sm font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cancellation Reason Section */}
                  <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Icon icon="mdi:close-circle" className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Cancellation Reason</h4>
                      </div>
                      <div className="relative">
                          <input
                            type="text"
                    value={cancelReason}
                            onChange={(e) => {
                              setCancelReason(e.target.value);
                              // Hide dropdown when user types
                              if (e.target.value.trim().length > 0) {
                                setShowCancelReasonDropdown(false);
                              } else {
                                setShowCancelReasonDropdown(isCancelReasonInputFocused);
                              }
                            }}
                            onFocus={() => {
                              setIsCancelReasonInputFocused(true);
                              // Show dropdown only if input is empty
                              if (!cancelReason.trim()) {
                                setShowCancelReasonDropdown(true);
                              }
                            }}
                            onBlur={() => {
                              setIsCancelReasonInputFocused(false);
                              // Delay hiding dropdown to allow click on dropdown item
                              setTimeout(() => {
                                setShowCancelReasonDropdown(false);
                              }, 200);
                            }}
                            className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Please tell us why you're cancelling this order..."
                    disabled={isCancelling}
                            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}
                  />
                          {!cancelReason.trim() && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <Icon icon="mdi:chevron-down" className="w-5 h-5 text-gray-400" />
                </div>
                          )}
                          
                          {/* Dropdown */}
                          {showCancelReasonDropdown && !cancelReason.trim() && (
                            <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                              {cancellationReasons.map((reason, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setCancelReason(reason);
                                    setShowCancelReasonDropdown(false);
                                    setIsCancelReasonInputFocused(false);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0"
                                  style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}
                                  disabled={isCancelling}
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon icon="mdi:check-circle-outline" className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-700">{reason}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                          * Required field
                        </p>
                      </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex-shrink-0 bg-white border-t-2 border-gray-200 px-6 py-4 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setOrderToCancel(null);
                      setCancelReason('');
                      setShowCancelReasonDropdown(false);
                      setIsCancelReasonInputFocused(false);
                    }}
                    disabled={isCancelling}
                    className="w-full sm:flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                  >
                    No, Keep Order
                  </button>
                  <button
                    onClick={confirmCancelOrder}
                    disabled={isCancelling || !cancelReason.trim()}
                    className="w-full sm:flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                  >
                    {isCancelling ? (
                      <>
                        <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <Icon icon="mdi:check" className="w-5 h-5" />
                        Yes, Cancel Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedOrder && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-[60] flex items-center justify-center p-4 modal-backdrop"
            onClick={() => {
              if (!isSubmittingReview) {
                setShowReviewModal(false);
                setReviewRating(5);
                setReviewComment('');
              }
            }}
          >
            <div 
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl modal-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                  <Icon icon="mdi:star" className="text-yellow-500" />
                  Leave a Review
                </h3>
                <button
                  onClick={() => {
                    if (!isSubmittingReview) {
                      setShowReviewModal(false);
                      setReviewRating(5);
                      setReviewComment('');
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmittingReview}
                >
                  <Icon icon="mdi:close" className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                  Order: <span className="font-semibold" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{selectedOrder.orderNumber}</span>
                </p>
                <p className="text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                  Share your experience with the products from this order
                </p>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                      disabled={isSubmittingReview}
                    >
                      <Icon 
                        icon={star <= reviewRating ? "mdi:star" : "mdi:star-outline"} 
                        className={`w-10 h-10 ${
                          star <= reviewRating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us about your experience with the products..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  disabled={isSubmittingReview}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    if (!isSubmittingReview) {
                      setShowReviewModal(false);
                      setReviewRating(5);
                      setReviewComment('');
                    }
                  }}
                  className="w-full sm:flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmittingReview}
                  style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => submitReview()}
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="w-full sm:flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                >
                  {isSubmittingReview ? (
                    <>
                      <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:check" className="w-5 h-5" />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS for modal animations and blur */}
      <style jsx>{`
        /* Optimized modal backdrop animation */
        .modal-backdrop {
          animation: fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: opacity;
        }

        /* Optimized slide-in animation for order details modal */
        .modal-slide-in {
          animation: slideInRight 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity;
        }

        /* Optimized scale-in animation for centered modals */
        .modal-scale-in {
          animation: scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity;
        }

        /* Performance optimization: reduce repaints */
        @media (prefers-reduced-motion: reduce) {
          .modal-backdrop,
          .modal-slide-in,
          .modal-scale-in,
          .animate-slideIn {
            animation: none;
          }
        }
      `}</style>
    </RequireAuth>
  );
};

export default MyOrders;

