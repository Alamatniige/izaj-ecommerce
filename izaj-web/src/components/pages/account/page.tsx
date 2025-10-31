"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import RequireAuth from '../../common/RequireAuth';
import { useUserContext } from '../../../context/UserContext';
import AccountSidebar from '../../common/AccountSidebar';

const MyProfile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, uploadProfilePicture, removeProfilePicture } = useUserContext();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // Load user data on component mount and hydrate from server
  useEffect(() => {
    const hydrate = async () => {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || ''
          });
          // Get profile image using user ID for proper isolation
          const storedProfileImage = localStorage.getItem(`profileImage_${userData.id}`);
          console.log(`🔍 Loading profile image for user ${userData.id}:`, storedProfileImage ? 'Found' : 'Not found');
          if (storedProfileImage) setProfileImage(storedProfileImage);
        } catch {}
      } else {
        window.location.href = '/';
        return;
      }
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        const name = (data?.user?.user_metadata?.name || '').toString();
        const [firstName, ...rest] = name.trim().split(' ');
        const lastName = rest.join(' ');
        const phone = (data?.user?.user_metadata?.phone || '').toString();
        setFormData(prev => ({
          ...prev,
          firstName: firstName || prev.firstName,
          lastName: lastName || prev.lastName,
          phone: phone || prev.phone,
        }));
        const merged = {
          ...(storedUser ? JSON.parse(storedUser) : {}),
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          phone: phone || undefined,
        };
        localStorage.setItem('user', JSON.stringify(merged));
        sessionStorage.setItem('user', JSON.stringify(merged));
      } catch {}
    };
    hydrate();
  }, []);

  const validatePhone = (phone: string) => {
    const digits = (phone || '').replace(/\D/g, '');
    return /^(\d{11}|63\d{10})$/.test(digits);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    const newErrors = {
      firstName: formData.firstName.trim() === '' ? 'First name is required' : '',
      lastName: formData.lastName.trim() === '' ? 'Last name is required' : '',
      phone: !validatePhone(formData.phone) ? 'Please enter a valid 11-digit phone number' : '',
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        const msg = result?.error || 'Failed to update profile';
        setErrors(prev => ({ ...prev, phone: msg.includes('Phone') ? msg : prev.phone }));
        throw new Error(msg);
      }

      // Persist updated data locally for immediate UI reflect
      const updatedUserLocal = {
        id: result.user?.id || '',
        email: result.user?.email || formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      } as any;
      const existing = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (existing) {
        const prev = JSON.parse(existing);
        const merged = { ...prev, ...updatedUserLocal };
        localStorage.setItem('user', JSON.stringify(merged));
        sessionStorage.setItem('user', JSON.stringify(merged));
      }

      setIsLoading(false);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB = 5242880 bytes)
      if (file.size > 5242880) {
        alert('File size should be less than 5MB');
        return;
      }

      // Check file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Only JPEG, PNG, and WebP files are allowed');
        return;
      }

      setUploading(true);
      try {
        // Upload to backend
        const profilePictureUrl = await uploadProfilePicture(file);
        console.log('📸 Uploaded profile picture URL:', profilePictureUrl);
        setProfileImage(profilePictureUrl);
        setSuccessMessage('Profile picture updated successfully!');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload profile picture. Please try again.');
      } finally {
        setUploading(false);
        // Clear the input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleRemoveImage = () => {
    setShowRemoveModal(true);
  };

  const handleChangePhotoClick = () => {
    console.log('📸 Change Photo clicked');
    if (!uploading && fileInputRef.current) {
      console.log('📸 Attempting to open file dialog...');
      fileInputRef.current.click();
      console.log('📸 File input click() called');
    } else if (uploading) {
      console.log('📸 Upload in progress, ignoring click');
    } else {
      console.error('📸 File input ref is null');
    }
  };

  const confirmRemoveImage = async () => {
    setUploading(true);
    setShowRemoveModal(false);
    try {
      await removeProfilePicture();
      setProfileImage('');
      setSuccessMessage('Profile picture removed successfully!');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Remove error:', error);
      alert('Failed to remove profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const cancelRemoveImage = () => {
    setShowRemoveModal(false);
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    // Reset form data to original values
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || ''
      });
    }
    setIsEditMode(false);
    setErrors({
      firstName: '',
      lastName: '',
      phone: '',
    });
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const handleAccountDeletion = async () => {
    if (deleteConfirmationText !== 'Delete') {
      alert('Please type "Delete" to confirm account deletion.');
      return;
    }

    setIsDeletingAccount(true);
    try {
      const response = await fetch('/api/auth/request-deletion', {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to request account deletion');
      }

      setShowDeleteModal(false);
      setDeleteConfirmationText('');
      setSuccessMessage('Deletion confirmation email sent! Please check your inbox.');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);

    } catch (error) {
      console.error('Account deletion error:', error);
      alert((error as Error).message || 'Failed to process deletion request. Please try again.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <RequireAuth>
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Success Message Popup */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <Icon icon="lucide:check-circle" className="w-5 h-5" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Remove Profile Picture Confirmation Modal */}
      {showRemoveModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={cancelRemoveImage}
        >
          <div 
            className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Content */}
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Remove Profile Picture?
              </h3>
              <p className="text-gray-600 mb-6 text-sm">
                This action cannot be undone.
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelRemoveImage}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveImage}
                  className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
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
              My Profile
            </h1>
            
            {/* Horizontal line under title */}
            <div className="w-24 h-0.5 bg-gray-800 mx-auto mb-8"></div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 text-sm sm:text-base mb-6 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                Manage your account information, profile picture, and personal details.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
            {/* Left Column - Sidebar - Only on large screens */}
            <AccountSidebar 
              userData={formData}
              profileImage={profileImage}
              activePage="profile"
            />
            
            {/* Right Column - Profile Content */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-300">
                <div className="p-4 sm:p-6">
                  {/* Profile Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                      {/* Form Fields - Now on top */}
                      <div className="flex-1">
                        {/* First Name Field */}
                        <div className="grid md:grid-cols-2 gap-4">
                        <div className="mb-4 sm:mb-5">
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Icon icon="mdi:account-outline" className="w-4 h-4 mr-2 text-black" />
                            First Name
                          </label>
                          <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 ${isEditMode ? 'focus:ring-black' : 'focus:ring-gray-200'} focus:border-transparent transition-all duration-200 ${!isEditMode ? 'bg-gray-50' : 'bg-white'} shadow-sm text-gray-900`}
                            placeholder="Enter your first name"
                          />
                          {errors.firstName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.firstName}</p>}
                        </div>

                        {/* Last Name Field */}
                        <div className="mb-4 sm:mb-5">
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Icon icon="mdi:account-outline" className="w-4 h-4 mr-2 text-black" />
                            Last Name
                          </label>
                          <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 ${isEditMode ? 'focus:ring-black' : 'focus:ring-gray-200'} focus:border-transparent transition-all duration-200 ${!isEditMode ? 'bg-gray-50' : 'bg-white'} shadow-sm text-gray-900`}
                            placeholder="Enter your last name"
                          />
                          {errors.lastName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.lastName}</p>}
                        </div>
                        </div>

                        {/* Email and Phone */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Email Field (always disabled) */}
                          <div className="mb-4 sm:mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <Icon icon="mdi:email-outline" className="w-4 h-4 mr-2 text-black" />
                              Email
                            </label>
                            <input 
                              type="email" 
                              value={formData.email} 
                              disabled
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700"
                            />
                          </div>

                          {/* Phone Number Field */}
                          <div className="mb-4 sm:mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <Icon icon="mdi:phone-outline" className="w-4 h-4 mr-2 text-black" />
                              Phone Number
                            </label>
                            <input 
                              type="tel" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              disabled={!isEditMode}
                              className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 ${isEditMode ? 'focus:ring-black' : 'focus:ring-gray-200'} focus:border-transparent transition-all duration-200 ${!isEditMode ? 'bg-gray-50' : 'bg-white'} shadow-sm text-gray-900`}
                              placeholder="Enter your phone number"
                            />
                            {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>}
                          </div>
                        </div>

                        {/* Save and Edit Buttons - moved here */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4 sm:mt-4 mb-2">
                          {isEditMode ? (
                            <>
                              <button 
                                type="button"
                                onClick={handleCancelEdit}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-2 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all duration-200 text-sm sm:text-base"
                              >
                                Cancel
                              </button>
                              <button 
                                type="submit"
                                disabled={isLoading}
                                className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                              >
                                {isLoading ? (
                                  <>
                                    <Icon icon="mdi:loading" className="animate-spin mr-2" />
                                    Saving...
                                  </>
                                ) : (
                                  'Save'
                                )}
                              </button>
                            </>
                          ) : (
                            <button 
                              type="button"
                              onClick={handleEditClick}
                              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                            >
                              Edit
                            </button>
                          )}
                        </div>

                        {/* Image Upload Section */}
                        <div className="border-t border-gray-100 my-4 sm:my-6" />
                        <div className="mb-4 font-jost">
                          <h4 className="text-gray-900 font-jost font-semibold">Profile Picture</h4>
                          <p className="text-gray-500 text-xs font-jost">Update your profile picture</p>
                        </div>
                        <div className="flex flex-col items-center mb-2">
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-gray-200 mb-3 sm:mb-4 shadow-sm transition-transform duration-300 hover:scale-105 relative bg-gray-200 flex items-center justify-center">
                            {profileImage ? (
                              <img 
                                src={profileImage} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                onLoad={() => console.log('✅ Profile image loaded successfully')}
                                onError={() => console.log('❌ Profile image failed to load:', profileImage)}
                              />
                            ) : (
                              <Icon icon="lucide:user" className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400" />
                            )}
                            {uploading && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <Icon icon="mdi:loading" className="w-6 h-6 text-white animate-spin" />
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <label 
                              className={`text-indigo-600 text-xs sm:text-sm font-medium hover:text-gray-700 mb-2 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} font-jost`}
                            >
                              {uploading ? 'Uploading...' : 'Change Photo'}
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                disabled={uploading}
                              />
                            </label>
                            {profileImage && (
                              <button 
                                type="button"
                                onClick={handleRemoveImage}
                                disabled={uploading}
                                className="text-red-600 text-xs sm:text-sm font-medium hover:text-red-700 mb-2 transition-colors disabled:opacity-50 font-jost"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <p className="text-gray-500 text-[10px] sm:text-xs text-center font-jost">
                            File size: maximum 5 MB<br/>
                            File extension: JPEG, PNG, WebP
                          </p>
                        </div>

                        {/* Account Deletion Section - Moved to bottom */}
                        <div className="border-t border-gray-200 my-6 sm:my-8" />
                        <div className="mb-4 font-jost">
                          <h4 className="text-red-600 font-jost font-semibold text-sm sm:text-base">Danger Zone</h4>
                          <p className="text-gray-500 text-xs font-jost mb-3 sm:mb-0">Permanently delete your account and all associated data</p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                          <button 
                            type="button"
                            className="text-red-500 text-sm sm:text-sm font-medium hover:text-red-600 transition-colors text-left font-jost sm:flex-1"
                            onClick={() => setShowDeleteModal(true)}
                          >
                            Account Deletion
                          </button>
                          <button 
                            type="button"
                            className="w-full sm:w-auto px-6 sm:px-5 py-3 sm:py-2 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-jost"
                            onClick={() => setShowDeleteModal(true)}
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full relative max-h-screen overflow-y-auto mx-4">
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmationText('');
              }}
              aria-label="Close"
            >
              <Icon icon="mdi:close" />
            </button>
            
            <div className="text-xl font-bold text-gray-900 mb-4">⚠️ Confirm Account Deletion</div>
            
            <div className="text-gray-700 text-sm mb-6">
              <p className="mb-3">
                <strong>This action cannot be undone!</strong> Deleting your account will permanently remove:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1 text-xs">
                <li>Your personal profile information</li>
                <li>Your order history</li>
                <li>Your saved addresses</li>
                <li>Your wishlist and favorites</li>
                <li>Your payment methods</li>
              </ul>
              <p className="mb-3">
                A confirmation link will be sent to your email <span className="font-semibold">{formData.email}</span>.
              </p>
              <p className="text-red-600 font-semibold">
                To confirm, please type <span className="bg-red-100 px-2 py-1 rounded">Delete</span> in the box below:
              </p>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="Type 'Delete' to confirm"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationText('');
                }}
              >
                Cancel
              </button>
              <button
                className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleAccountDeletion}
                disabled={isDeletingAccount || deleteConfirmationText !== 'Delete'}
              >
                {isDeletingAccount ? (
                  <>
                    <Icon icon="mdi:loading" className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Delete Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </RequireAuth>
  );
};

export default MyProfile;