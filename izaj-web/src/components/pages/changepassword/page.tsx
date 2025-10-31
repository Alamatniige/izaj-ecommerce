"use client";

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import RequireAuth from '../../common/RequireAuth';
import AccountSidebar from '../../common/AccountSidebar';

const ChangePass: React.FC = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
  });
  const [profileImage, setProfileImage] = useState<string>('');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    general: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

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
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
  }, []);

  // Password strength validation
  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: '', general: '' }));
    setSuccessMessage('');
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ currentPassword: '', newPassword: '', confirmPassword: '', general: '' });
    setSuccessMessage('');

    // Validate form
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      general: '',
    };

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordValidation = validatePassword(formData.newPassword);
      if (!passwordValidation.isValid) {
        newErrors.newPassword = passwordValidation.errors[0];
      }
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('You are not logged in. Please log in again.');
        } else if (response.status === 400) {
          throw new Error(result?.error || 'Invalid password or request data');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(result?.error || 'Failed to change password');
        }
      }

      setSuccessMessage('Password has been changed successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // Clear any existing errors
      setErrors({ currentPassword: '', newPassword: '', confirmPassword: '', general: '' });
    } catch (error) {
      console.error('Change password error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      setErrors(prev => ({ ...prev, general: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RequireAuth>
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Mobile: My Account Navigation removed per request */}
      {/* Main Content */}
      <main className="flex-grow py-6 md:py-12 pb-24 lg:pb-12 bg-white">
        <div className="w-full max-w-screen-xl mx-auto px-4 lg:px-0">
          {/* Header Section - Similar to ProductList */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-800 mb-2 mt-0 sm:mt-1 lg:mt-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
              Change Password
            </h1>
            
            {/* Horizontal line under title */}
            <div className="w-24 h-0.5 bg-gray-800 mx-auto mb-8"></div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 text-sm sm:text-base mb-6 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                Update your password to keep your account secure and protected.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
            {/* Left Column - Sidebar - Only on large screens */}
            <AccountSidebar 
              userData={userData}
              profileImage={profileImage}
              activePage="changepassword"
            />
            {/* Right Column - Change Password Section */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-300">
                <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
              {/* Success Message */}
              {successMessage && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm sm:text-base">
                  {successMessage}
                </div>
              )}

              {/* General Error Message */}
              {errors.general && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:text-base">
                  {errors.general}
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium mb-2 text-black" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Current Password</label>
                <div className="relative">
                  <input 
                    type={showPasswords.currentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className={`w-full p-3 pr-12 text-sm sm:text-base border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-colors`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('currentPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black focus:outline-none transition-colors duration-200"
                  >
                    <Icon 
                      icon={showPasswords.currentPassword ? "mdi:eye-off" : "mdi:eye"} 
                      className="w-5 h-5" 
                    />
                  </button>
                </div>
                {errors.currentPassword && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.currentPassword}</p>}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium mb-2 text-black" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>New Password</label>
                <div className="relative">
                  <input 
                    type={showPasswords.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={`w-full p-3 pr-12 text-sm sm:text-base border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-colors`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('newPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black focus:outline-none transition-colors duration-200"
                  >
                    <Icon 
                      icon={showPasswords.newPassword ? "mdi:eye-off" : "mdi:eye"} 
                      className="w-5 h-5" 
                    />
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.newPassword}</p>}
                <p className="text-gray-500 text-[11px] sm:text-xs mt-1">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2 text-black" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full p-3 pr-12 text-sm sm:text-base border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-colors`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black focus:outline-none transition-colors duration-200"
                  >
                    <Icon 
                      icon={showPasswords.confirmPassword ? "mdi:eye-off" : "mdi:eye"} 
                      className="w-5 h-5" 
                    />
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Save Button */}
              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`w-full sm:w-auto px-6 py-3 bg-black hover:bg-gray-800 text-white text-sm sm:text-base font-semibold transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                >
                  {isLoading ? (
                    <>
                      <Icon icon="mdi:loading" className="animate-spin mr-2 inline" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
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

export default ChangePass;