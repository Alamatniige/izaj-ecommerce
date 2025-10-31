"use client";


import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import RequireAuth from '../../common/RequireAuth';
import AccountSidebar from '../../common/AccountSidebar';
import { addressService, Address } from '../../../services/addressService';

interface LocalAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
}

const MyPurchase: React.FC = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
  });
  const [profileImage, setProfileImage] = useState<string>('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    province: '',
    city: '',
    barangay: ''
  });
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
        });
        // Get profile image using user ID for proper isolation
        const storedProfileImage = localStorage.getItem(`profileImage_${user.id}`);
        if (storedProfileImage) {
          setProfileImage(storedProfileImage);
        }

        // Load addresses from database
        loadAddresses();
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
  }, []);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const addressesData = await addressService.getAddresses();
      setAddresses(addressesData);
    } catch (error) {
      console.error('Error loading addresses:', error);
      
      // Check if user is logged in
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!storedUser) {
        console.log('No user found, skipping address loading');
        return;
      }

      // Fallback to localStorage if API fails
      const user = JSON.parse(storedUser);
      const userSpecificKey = `addresses_${user.id}`;
      const storedAddresses = localStorage.getItem(userSpecificKey);
      if (storedAddresses) {
        try {
          const localAddresses = JSON.parse(storedAddresses);
          setAddresses(localAddresses.map((addr: LocalAddress) => ({
            id: addr.id,
            user_id: user.id,
            name: addr.name,
            phone: addr.phone,
            address: addr.address,
            is_default: false,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })));
        } catch (error) {
          console.error('Error parsing stored addresses:', error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      province: '',
      city: '',
      barangay: ''
    });
    setIsAddingNew(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    
    // Parse the address to extract components
    const addressParts = address.address.split(',').map(part => part.trim());
    let streetAddress = '';
    let barangay = '';
    let city = '';
    let province = '';
    
    if (addressParts.length >= 4) {
      streetAddress = addressParts[0];
      barangay = addressParts[1];
      city = addressParts[2];
      province = addressParts[3];
    } else if (addressParts.length >= 3) {
      streetAddress = addressParts[0];
      city = addressParts[1];
      province = addressParts[2];
    } else if (addressParts.length >= 2) {
      streetAddress = addressParts[0];
      city = addressParts[1];
    } else {
      streetAddress = address.address;
    }
    
    setFormData({
      name: address.name,
      phone: address.phone,
      address: streetAddress,
      province: province,
      city: city,
      barangay: barangay
    });
    setIsAddingNew(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        setIsLoading(true);
        await addressService.deleteAddress(id);
        setSuccessMessage('Address deleted successfully!');
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessage('');
        }, 3000);
        // Reload addresses from database
        await loadAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Error deleting address. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name.trim() || !formData.phone.trim() || !formData.province.trim() || !formData.city.trim() || !formData.barangay.trim() || !formData.address.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      setIsLoading(true);

      const composedAddress = `${formData.address.trim()}, ${formData.barangay.trim()}, ${formData.city.trim()}, ${formData.province.trim()}`.replace(/,\s*,/g, ', ').trim();

      if (editingAddress) {
        // Update existing address
        await addressService.updateAddress(editingAddress.id, {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: composedAddress,
          is_default: editingAddress.is_default
        });
        setSuccessMessage('Address updated successfully!');
      } else {
        // Add new address
        await addressService.createAddress({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: composedAddress,
          is_default: addresses.length === 0 // Set as default if it's the first address
        });
        setSuccessMessage('Address added successfully!');
      }

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage('');
      }, 3000);

      setIsAddingNew(false);
      setEditingAddress(null);
      setFormData({
        name: '',
        phone: '',
        address: '',
        province: '',
        city: '',
        barangay: ''
      });

      // Reload addresses from database
      await loadAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Error saving address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      setIsLoading(true);
      await addressService.setDefaultAddress(addressId);
      setSuccessMessage('Default address updated successfully!');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage('');
      }, 3000);
      // Reload addresses from database
      await loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Error setting default address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingAddress(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      province: '',
      city: '',
      barangay: ''
    });
  };

  return (
    <RequireAuth>
    <style jsx>{`
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
      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-slideIn {
        animation: slideIn 0.3s ease-out;
      }
      .animate-slideUp {
        animation: slideUp 0.3s ease-out;
      }
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
      }
    `}</style>
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl flex items-center space-x-2 sm:space-x-3 animate-slideIn border border-gray-300 max-w-[90vw] sm:max-w-md">
          <Icon icon="mdi:check-circle" className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse flex-shrink-0" />
          <span className="font-medium text-sm sm:text-base">{successMessage}</span>
        </div>
      )}
      {/* Mobile: My Account Navigation removed per request */}
      {/* Main Content */}
      <main className="flex-grow py-6 md:py-12 pb-24 lg:pb-12 bg-white">
        <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-0">
          {/* Header Section - Similar to ProductList */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-800 mb-2 mt-0 sm:mt-1 lg:mt-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
              My Addresses
            </h1>
            
            {/* Horizontal line under title */}
            <div className="w-24 h-0.5 bg-gray-800 mx-auto mb-8"></div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 text-sm sm:text-base mb-6 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                Manage your delivery addresses for convenient checkout and shipping.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
            {/* Left Column - Sidebar - Only on large screens */}
            <AccountSidebar 
              userData={userData}
              profileImage={profileImage}
              activePage="addresses"
            />
            
            {/* Right Column - Addresses */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-300">
                <div className="p-4 sm:p-6">
                  {!isAddingNew && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
                      <h3 className="text-base sm:text-lg font-bold flex items-center text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                        <Icon icon="mdi:map-marker" className="mr-2 text-gray-800 w-5 h-5 sm:w-6 sm:h-6" />
                        Delivery Addresses
                      </h3>
                      <button 
                        onClick={handleAddNewAddress}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-2 bg-black hover:bg-gray-800 text-white text-sm sm:text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                        style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                      >
                        <Icon icon="mdi:plus" className="w-4 h-4" />
                        Add New Address
                      </button>
                    </div>
                  )}
                  {isLoading && !isAddingNew && addresses.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-300">
                      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon icon="mdi:loading" className="animate-spin text-white" width="24" height="24" />
                      </div>
                      <p className="text-gray-600 font-medium">Loading your addresses...</p>
                      <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
                    </div>
                  ) : isAddingNew ? (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Add/Edit Mode Header */}
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <button
                          onClick={handleCancel}
                          className="text-gray-600 hover:text-black transition-colors flex-shrink-0"
                        >
                          <Icon icon="mdi:arrow-left" className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon icon={editingAddress ? "mdi:pencil" : "mdi:plus"} className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                            {editingAddress ? 'Update your address information' : 'Add a new delivery address'}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-300">
                      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Full Name */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                              <Icon icon="mdi:account-outline" className="w-4 h-4 mr-2 text-black" />
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                              placeholder="Enter your full name"
                              required
                              style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}
                            />
                          </div>
                          
                          {/* Phone Number */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                              <Icon icon="mdi:phone-outline" className="w-4 h-4 mr-2 text-black" />
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                              placeholder="Enter your phone number"
                              required
                              style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}
                            />
                          </div>
                        </div>
                        
                        {/* Address (Street) */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                            <Icon icon="mdi:home-outline" className="w-4 h-4 mr-2 text-black" />
                            Street / House / Building
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                            placeholder="e.g., 123 Sampaguita St., Brgy. 123"
                            required
                            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}
                          />
                        </div>

                        {/* Province */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                            <Icon icon="mdi:map-outline" className="w-4 h-4 mr-2 text-black" />
                            Province
                          </label>
                          <input
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                            placeholder="Enter your province"
                            required
                            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}
                          />
                        </div>

                        {/* City / Municipality */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                            <Icon icon="mdi:city" className="w-4 h-4 mr-2 text-black" />
                            City / Municipality
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                            placeholder="Enter your city or municipality"
                            required
                            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}
                          />
                        </div>

                        {/* Barangay */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                            <Icon icon="mdi:home-city" className="w-4 h-4 mr-2 text-black" />
                            Barangay
                          </label>
                          <input
                            type="text"
                            name="barangay"
                            value={formData.barangay}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                            placeholder="Enter your barangay"
                            required
                            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:flex-1 px-6 py-3 bg-black hover:bg-gray-800 text-white text-sm sm:text-base font-semibold transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                          >
                            {isLoading ? (
                              <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                            ) : (
                              <Icon icon="mdi:check" className="w-4 h-4" />
                            )}
                            <span>{isLoading ? 'Saving...' : (editingAddress ? 'Save Changes' : 'Save Address')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="w-full sm:flex-1 px-6 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-sm sm:text-base font-semibold transition-all duration-200 rounded-xl flex items-center justify-center space-x-2"
                            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                          >
                            <Icon icon="mdi:close" className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </form>
                      </div>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12 sm:py-20 bg-gray-50 rounded-xl border border-gray-300">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon icon="mdi:map-marker-off-outline" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <p className="text-gray-600 font-medium text-base sm:text-lg" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>No addresses yet</p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Add your first address for convenient delivery</p>
                      <button 
                        onClick={handleAddNewAddress}
                        className="mt-4 px-6 py-2.5 sm:py-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
                        style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                      >
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {addresses.map((address, index) => (
                        <div key={address.id} className="group relative bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                          {/* Default Badge */}
                          {address.is_default && (
                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                              <span className="bg-black text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                                <Icon icon="mdi:star" className="w-3 h-3" />
                                <span>Default</span>
                              </span>
                            </div>
                          )}
                          
                          <div className="p-4 sm:p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                              <div className="flex items-center gap-2 sm:gap-3 pr-12 sm:pr-0">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Icon icon="mdi:map-marker" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800 text-base sm:text-lg" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Delivery Address</h3>
                                  <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Contact & Location</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Address Details */}
                            <div className="space-y-2 sm:space-y-3">
                              <div className="flex items-center gap-2">
                                <Icon icon="mdi:account" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-800 font-medium text-sm sm:text-base break-words" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>{address.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon icon="mdi:phone" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-600 text-sm sm:text-base break-all" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{address.phone}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Icon icon="mdi:map-marker-outline" className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600 leading-relaxed text-sm sm:text-base break-words" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>{address.address}</span>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="flex-1 min-w-[80px] px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1 group"
                                style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}
                              >
                                <Icon icon="mdi:pencil" className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                                <span>Edit</span>
                              </button>
                              {!address.is_default && (
                                <button
                                  onClick={() => handleSetDefault(address.id)}
                                  className="flex-1 min-w-[100px] px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1 group"
                                  style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}
                                >
                                  <Icon icon="mdi:star" className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                                  <span className="hidden sm:inline">Set Default</span>
                                  <span className="sm:hidden">Default</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center group"
                                style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}
                              >
                                <Icon icon="mdi:delete" className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </RequireAuth>
  );
};

export default MyPurchase;