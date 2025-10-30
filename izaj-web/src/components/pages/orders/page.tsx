"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import RequireAuth from '../../common/RequireAuth';
import AccountSidebar from '../../common/AccountSidebar';
import { useUserContext } from '../../../context/UserContext';

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
    price: number;
    productId?: string;
  }>;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
}

const MyOrders: React.FC = () => {
  const { user } = useUserContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successOrderNumber, setSuccessOrderNumber] = useState<string>('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
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
      
      if (success === 'true' && orderNumber) {
        setShowSuccessMessage(true);
        setSuccessOrderNumber(orderNumber);
        
        // Clear URL parameters
        window.history.replaceState({}, '', '/orders');
        
        // Hide message after 10 seconds
        setTimeout(() => setShowSuccessMessage(false), 10000);
      }
    }
  }, []);

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
              items: order.items?.map((item: any) => ({
                id: item.id,
                name: item.product_name,
                image: item.product_image || '/placeholder.jpg',
                quantity: item.quantity,
                price: parseFloat(item.unit_price),
                productId: item.product_id
              })) || [],
              total: parseFloat(order.total_amount),
              shippingAddress: `${order.shipping_city}, ${order.shipping_province}`,
              paymentMethod: order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 
                            order.payment_method === 'gcash' ? 'GCash' :
                            order.payment_method === 'maya' ? 'Maya' : 'Credit Card',
              trackingNumber: order.tracking_number || undefined
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
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrder || !cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    try {
      const { cancelOrder: cancelOrderAPI } = await import('@/services/orderService');
      const result = await cancelOrderAPI(selectedOrder.id, cancelReason);

      if (result.success) {
        // Update local state
        setOrders(prev => prev.map(order => 
          order.id === selectedOrder.id 
            ? { ...order, status: 'cancelled' } 
            : order
        ));
        
        // Close modals
        setShowCancelModal(false);
        setSelectedOrder(null);
        setCancelReason('');
        
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
                items: order.items?.map((item: any) => ({
                  id: item.id,
                  name: item.product_name,
                  image: item.product_image || '/placeholder.jpg',
                  quantity: item.quantity,
                  price: parseFloat(item.unit_price),
                  productId: item.product_id
                })) || [],
                total: parseFloat(order.total_amount),
                shippingAddress: `${order.shipping_city}, ${order.shipping_province}`,
                paymentMethod: order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 
                              order.payment_method === 'gcash' ? 'GCash' :
                              order.payment_method === 'maya' ? 'Maya' : 'Credit Card',
                trackingNumber: order.tracking_number || undefined
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
        
        {/* Mobile: My Account Navigation */}
        <div className="lg:hidden bg-white px-4 pt-4 shadow-sm">
          <div
            className="w-full flex items-center justify-between p-0 text-black font-semibold text-lg cursor-pointer mt-4 border-b border-gray-200 pb-3 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
            onClick={() => setIsAccountModalOpen(true)}
            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
          >
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:package-variant" className="text-black w-5 h-5" />
              <span>My Orders</span>
            </div>
            <Icon icon="mdi:chevron-down" className="text-gray-400 w-6 h-6 ml-1" />
          </div>
        </div>

        {/* My Account Modal for Mobile */}
        {isAccountModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end lg:hidden bg-black bg-opacity-40 overflow-y-auto" onClick={() => setIsAccountModalOpen(false)}>
            <div
              className="w-full bg-white animate-slideUp relative shadow-lg max-h-screen overflow-y-auto"
              style={{ minHeight: '240px' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setIsAccountModalOpen(false)}
                aria-label="Close"
              >
                <Icon icon="mdi:close" />
              </button>
              <div className="font-bold text-xl mb-4 text-black text-center mt-4" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>My Account</div>
              <ul className="space-y-1 px-4 pb-6">
                <li>
                  <span className="inline-flex items-center text-black font-semibold text-base" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                    My Account
                  </span>
                </li>
                <li className="pl-8 py-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                  <Link href="/account" className="text-black hover:text-gray-900 text-base block transition-colors" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Profile</Link>
                </li>
                <li className="pl-8 py-3 bg-gray-100 rounded-lg transition-colors duration-300">
                  <span className="text-black font-semibold text-base block" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>My Orders</span>
                </li>
                <li className="pl-8 py-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                  <Link href="/payments" className="text-black hover:text-gray-900 text-base block transition-colors" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Payment Methods</Link>
                </li>
                <li className="pl-8 py-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                  <Link href="/addresses" className="text-black  hover:text-gray-900 text-base block transition-colors" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Addresses</Link>
                </li>
                <li className="pl-8 py-3 hover:bg-gray-50 rounded-lg mb-2 transition-colors duration-300">
                  <Link href="/changepassword" className="text-black hover:text-gray-900 text-base block transition-colors" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Change Password</Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-grow py-6 md:py-12 bg-white">
          <div className="w-full max-w-screen-xl mx-auto px-0">
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
                  <div className="border-b border-gray-200 bg-white">
                    <div className="flex overflow-x-auto scrollbar-hide justify-center">
                      {[
                        { key: 'all', label: 'All Orders', icon: 'mdi:package-variant-closed' },
                        { key: 'pending', label: 'Pending', icon: 'mdi:clock-outline' },
                        { key: 'approved', label: 'Approved', icon: 'mdi:check-circle' },
                        { key: 'in_transit', label: 'In Transit', icon: 'mdi:truck-fast' },
                        { key: 'complete', label: 'Complete', icon: 'mdi:check-all' },
                        { key: 'cancelled', label: 'Cancelled', icon: 'mdi:close-circle' }
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setSelectedStatus(tab.key)}
                          className={`flex items-center gap-2 px-6 py-4 text-base font-medium whitespace-nowrap transition-all duration-200 ${
                            selectedStatus === tab.key
                              ? 'text-black border-b-2 border-black'
                              : 'text-gray-600 hover:text-black hover:bg-gray-50'
                          }`}
                          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}
                        >
                          <Icon icon={tab.icon} className="w-4 h-4" />
                          {tab.label}
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
                          className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium"
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
                              <div className="flex items-center gap-3 flex-wrap justify-between">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <h4 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{order.orderNumber}</h4>
                                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold ${getStatusColor(order.status)}`} style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                                    <Icon icon={getStatusIcon(order.status)} className="w-4 h-4" />
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Total:</span>
                                  <span className="text-lg font-bold text-black" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{formatPrice(order.total)}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{formatDate(order.date)}</p>
                            </div>

                            {/* Order Items and Buttons */}
                            <div className="flex gap-4 mb-4">
                              {/* Order Items */}
                              <div className="flex-1 space-y-3">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-4">
                                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                      <img 
                                        src={item.image} 
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-800 truncate" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>{item.name}</p>
                                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Buttons */}
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium text-sm flex items-center gap-2 whitespace-nowrap"
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
                                    className="px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-2 whitespace-nowrap"
                                    style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500, backgroundColor: '#00A86B' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#009059'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00A86B'}
                                  >
                                    <Icon icon="mdi:star-outline" className="w-4 h-4" />
                                    Leave Review
                                  </button>
                                )}
                                {order.status === 'complete' && reviewedOrders.has(order.id) && (
                                  <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm flex items-center gap-2 whitespace-nowrap">
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
                            <div className="mt-4 bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-6 shadow-lg">
                              <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                    <Icon icon="mdi:star" className="w-5 h-5 text-white" />
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
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
                                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                  disabled={isSubmittingReview}
                                >
                                  <Icon icon="mdi:close" className="w-5 h-5 text-gray-500" />
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
                              <div className="flex gap-3">
                                <button
                                  onClick={() => {
                                    setShowReviewForm(false);
                                    setReviewOrderId(null);
                                    setReviewRating(5);
                                    setReviewComment('');
                                  }}
                                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={isSubmittingReview}
                                  style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => submitReview(order)}
                                  disabled={isSubmittingReview || !reviewComment.trim()}
                                  className="flex-1 px-4 py-3 text-white rounded-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
              className="relative w-[420px] sm:w-[500px] md:w-[540px] lg:w-[580px] xl:w-[620px] bg-gradient-to-b from-gray-50 to-white h-screen shadow-2xl overflow-y-auto z-[10000]"
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: 'slideInRight 0.3s ease-out'
              }}
            >
              {/* Header */}
              <div className="sticky top-0 z-20 bg-white px-6 py-5 border-b-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                      Order Details
                    </h2>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{selectedOrder.orderNumber}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Icon icon="mdi:close" width="24" height="24" className="text-gray-700" />
                  </button>
                </div>
                {/* Status Badge */}
                <div>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-semibold shadow-md ${getStatusColor(selectedOrder.status)}`} style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                    <Icon icon={getStatusIcon(selectedOrder.status)} className="w-5 h-5" />
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6">

              {/* Modal Content */}
              <div className="space-y-6">
                {/* All Order Details in One Container */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
                  {/* Order Items Section */}
                  <div className="p-4 border-b-2 border-gray-200 bg-gradient-to-r from-gray-100 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <Icon icon="mdi:cart-outline" className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Order Items</h4>
                      <span className="ml-auto text-sm font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded-lg" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                        {selectedOrder.items.length} {selectedOrder.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-sm">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 mb-1 truncate" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{item.name}</p>
                          <p className="text-xs text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Details Section */}
                  <div className="p-5 border-t-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon icon="mdi:truck-delivery" className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Shipping Details</h4>
                    </div>
                    <div className="space-y-3 pl-10">
                      <div className="flex items-start gap-3">
                        <Icon icon="mdi:map-marker" className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Delivery Address</p>
                          <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{selectedOrder.shippingAddress}</p>
                        </div>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                          <Icon icon="mdi:package-variant" className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Tracking Number</p>
                            <p className="text-sm font-bold text-blue-600" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{selectedOrder.trackingNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment & Order Info Section */}
                  <div className="p-5 border-t-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon icon="mdi:credit-card" className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Payment & Info</h4>
                    </div>
                    <div className="space-y-3 pl-10">
                      <div className="flex items-start gap-3">
                        <Icon icon="mdi:calendar" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Order Date</p>
                          <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{formatDate(selectedOrder.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon icon="mdi:wallet" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Payment Method</p>
                          <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{selectedOrder.paymentMethod}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3 border-2 border-green-200">
                        <Icon icon="mdi:cash" className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Total Amount</p>
                          <p className="text-2xl font-bold text-black" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{formatPrice(selectedOrder.total)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>


              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 px-6 py-4 shadow-lg">
                <div className="space-y-3">
                  {/* Cancel Button - Only for Pending Orders */}
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={handleCancelOrder}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 text-base font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 rounded-xl shadow-md"
                      style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                    >
                      <Icon icon="mdi:close-circle" className="w-5 h-5" />
                      Cancel Order
                    </button>
                  )}
                  
                  {/* Contact Support - For Active Orders (not cancelled/complete) */}
                  {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'complete' && selectedOrder.status !== 'pending' && (
                    <button
                      className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-6 text-base font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-200 flex items-center justify-center gap-2 rounded-xl shadow-md"
                      style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                    >
                      <Icon icon="mdi:message-outline" className="w-5 h-5" />
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
        {showCancelModal && selectedOrder && (
          <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={() => {
              if (!isCancelling) {
                setShowCancelModal(false);
                setCancelReason('');
              }
            }}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Icon icon="mdi:alert-circle" className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Cancel Order?</h3>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Order: {selectedOrder.orderNumber}</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-red-800 flex items-start gap-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                    <Icon icon="mdi:information" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                      Are you sure you want to cancel this order? This action cannot be undone.
                    </span>
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                    Reason for Cancellation *
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                    rows={4}
                    placeholder="Please tell us why you're cancelling this order..."
                    disabled={isCancelling}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setCancelReason('');
                    }}
                    disabled={isCancelling}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                  >
                    No, Keep Order
                  </button>
                  <button
                    onClick={confirmCancelOrder}
                    disabled={isCancelling || !cancelReason.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={() => {
              if (!isSubmittingReview) {
                setShowReviewModal(false);
                setReviewRating(5);
                setReviewComment('');
              }
            }}
          >
            <div 
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl transform transition-all"
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: 'scaleIn 0.2s ease-out'
              }}
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
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (!isSubmittingReview) {
                      setShowReviewModal(false);
                      setReviewRating(5);
                      setReviewComment('');
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmittingReview}
                  style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => submitReview()}
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(20px);
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
          animation: slideIn 0.3s ease-out;
        }

        @supports (backdrop-filter: blur(20px)) or (-webkit-backdrop-filter: blur(20px)) {
          .backdrop-blur {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
        }
      `}</style>
    </RequireAuth>
  );
};

export default MyOrders;

