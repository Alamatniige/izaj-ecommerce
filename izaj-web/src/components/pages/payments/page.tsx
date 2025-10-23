"use client";


import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import RequireAuth from '@/components/common/RequireAuth';
import { ewalletService, EWallet } from '@/services/ewalletService';
import AccountSidebar from '../../common/AccountSidebar';

const BankandCard: React.FC = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    id: '',
  });
  const [profileImage, setProfileImage] = useState<string>('');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'add'>('list');
  const [eWallets, setEWallets] = useState<EWallet[]>([]);
  const [newWallet, setNewWallet] = useState({
    type: 'GCash',
    accountName: '',
    accountNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const walletTypes = [
    { name: 'GCash', icon: 'mdi:cellphone', color: 'bg-blue-500', logo: '/gcash.png' },
    { name: 'PayMaya', icon: 'mdi:wallet', color: 'bg-green-500', logo: '/maya.png' },
    { name: 'PayPal', icon: 'mdi:paypal', color: 'bg-blue-600', logo: '/paypal.png' },
    { name: 'GrabPay', icon: 'mdi:car', color: 'bg-emerald-600', logo: '/grab.png' },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          id: user.id || '',
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

  // Load e-wallets from API
  useEffect(() => {
    const loadEWallets = async () => {
      try {
        setIsLoading(true);
        const wallets = await ewalletService.getEWallets();
        setEWallets(wallets);
      } catch (error) {
        console.error('Failed to load e-wallets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEWallets();
  }, []);

  const handleAddWallet = async () => {
    if (!newWallet.accountName.trim() || !newWallet.accountNumber.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const walletType = walletTypes.find(w => w.name === newWallet.type);
      
      const newEWallet = await ewalletService.createEWallet({
        type: newWallet.type,
        account_name: newWallet.accountName,
        account_number: newWallet.accountNumber,
        icon: walletType?.icon || 'mdi:wallet',
        color: walletType?.color || 'bg-gray-500',
      });

      setEWallets([newEWallet, ...eWallets]);
      
      // Reset form and go back to list view
      setNewWallet({ type: 'GCash', accountName: '', accountNumber: '' });
      setViewMode('list');
    } catch (error) {
      console.error('Failed to add e-wallet:', error);
      alert('Failed to add e-wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWallet = async (id: string) => {
    if (confirm('Are you sure you want to remove this e-wallet?')) {
      try {
        setIsLoading(true);
        await ewalletService.deleteEWallet(id);
        setEWallets(eWallets.filter(w => w.id !== id));
      } catch (error) {
        console.error('Failed to delete e-wallet:', error);
        alert('Failed to delete e-wallet. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
 
  return (
    <RequireAuth>
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Mobile: My Account Navigation */}
      <div className="lg:hidden bg-white px-4 pt-4 shadow-sm">
        <div
          className="w-full flex items-center justify-between p-0 text-black font-semibold text-lg cursor-pointer mt-4 border-b border-gray-200 pb-3 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
          onClick={() => setIsAccountModalOpen(true)}
          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
        >
          <div className="flex items-center space-x-2">
            <Icon icon="mdi:credit-card-outline" className="text-black w-5 h-5" />
            <span>Payment Methods</span>
          </div>
          <Icon icon="mdi:chevron-down" className="text-gray-400 w-6 h-6 ml-1" />
        </div>
      </div>
      {/* My Account Modal for Mobile */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items:end lg:hidden bg-black bg-opacity-40 overflow-y-auto" onClick={() => setIsAccountModalOpen(false)}>
          <div
            className="w-full bg-white animate-slideUp  relative shadow-lg max-h-screen overflow-y-auto"
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
              <li className="pl-8 py-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                <Link href="/orders" className="text-black hover:text-gray-900 text-base block transition-colors" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>My Orders</Link>
              </li>
              <li className="pl-8 py-3 bg-gray-100 rounded-lg transition-colors duration-300">
                <span className="text-black font-semibold text-base block" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>Payment Methods</span>
              </li>
              <li className="pl-8 py-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                <Link href="/addresses" className="text-black hover:text-gray-900 text-base block transition-colors" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>Addresses</Link>
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
              Payment Methods
            </h1>
            
            {/* Horizontal line under title */}
            <div className="w-24 h-0.5 bg-gray-800 mx-auto mb-8"></div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 text-sm sm:text-base mb-6 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                Manage your e-wallets and payment methods for convenient checkout.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
            {/* Left Column - Sidebar - Only on large screens */}
            <AccountSidebar 
              userData={userData}
              profileImage={profileImage}
              activePage="payments"
            />
            {/* Right Column - Payment Methods */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-300">
                <div className="p-4 sm:p-6">
                  {viewMode === 'list' ? (
                    // LIST VIEW
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
                        <h3 className="text-base sm:text-lg font-bold flex items-center text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                          <Icon icon="mdi:wallet-outline" className="mr-2 text-gray-800" width="24" height="24" />
                          E-Wallet
                        </h3>
                        <button 
                          onClick={() => setViewMode('add')}
                          className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl mt-2 sm:mt-0"
                          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                        >
                          <Icon icon="mdi:plus" className="w-4 h-4" />
                          Add New E-Wallet
                        </button>
                      </div>
                      {isLoading && eWallets.length === 0 ? (
                        <div className="text-center py-10 sm:py-16 bg-gray-50 rounded-xl border border-gray-300">
                          <Icon icon="mdi:loading" className="mx-auto mb-4 text-gray-400 animate-spin" width="40" height="40" />
                          <p className="text-gray-500 text-sm sm:text-base">Loading e-wallets...</p>
                        </div>
                      ) : eWallets.length === 0 ? (
                        <div className="text-center py-10 sm:py-16 bg-gray-50 rounded-xl border border-gray-300">
                          <Icon icon="mdi:wallet-off-outline" className="mx-auto mb-4 text-gray-400" width="40" height="40" />
                          <p className="text-gray-500 text-sm sm:text-base">You don't have any e-wallets yet.</p>
                          <p className="text-gray-400 text-xs sm:text-sm mt-2">Add an e-wallet for convenient payments</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {eWallets.map((wallet) => (
                            <div
                              key={wallet.id}
                              className="relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-xl p-5 hover:shadow-lg transition-all duration-200"
                            >
                              <button
                                onClick={() => handleDeleteWallet(wallet.id)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove wallet"
                                disabled={isLoading}
                              >
                                <Icon icon="mdi:delete-outline" className="w-5 h-5" />
                              </button>
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white border border-gray-300">
                                  {walletTypes.find(w => w.name === wallet.type)?.logo ? (
                                    <img 
                                      src={walletTypes.find(w => w.name === wallet.type)?.logo || ''} 
                                      alt={wallet.type} 
                                      className="w-10 h-10 object-contain"
                                    />
                                  ) : (
                                    <Icon icon={wallet.icon} className="text-gray-700 w-6 h-6" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-base font-bold text-gray-800 mb-1">{wallet.type}</h4>
                                  <p className="text-sm text-gray-600 truncate">{wallet.account_name}</p>
                                  <p className="text-xs text-gray-500 mt-1">{wallet.account_number}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // ADD VIEW
                    <div className="space-y-6">
                      {/* Add Mode Header */}
                      <div className="flex items-center space-x-3 mb-6">
                        <button
                          onClick={() => {
                            setViewMode('list');
                            setNewWallet({ type: 'GCash', accountName: '', accountNumber: '' });
                          }}
                          className="text-gray-600 hover:text-black transition-colors mr-2"
                        >
                          <Icon icon="mdi:arrow-left" className="w-6 h-6" />
                        </button>
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                          <Icon icon="mdi:wallet-plus" className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                            Add E-Wallet
                          </h3>
                          <p className="text-sm text-gray-500" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                            Add a new e-wallet to your account
                          </p>
                        </div>
                      </div>
                        {/* E-Wallet Type Selection */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                            E-Wallet Type
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {walletTypes.map((type) => (
                              <button
                                key={type.name}
                                onClick={() => setNewWallet({ ...newWallet, type: type.name })}
                                className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                                  newWallet.type === type.name
                                    ? 'border-black bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200">
                                  {type.logo ? (
                                    <img 
                                      src={type.logo} 
                                      alt={type.name} 
                                      className="w-8 h-8 object-contain"
                                    />
                                  ) : (
                                    <Icon icon={type.icon} className="text-gray-700 w-5 h-5" />
                                  )}
                                </div>
                                <span className="text-sm font-medium text-gray-800">{type.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Account Name */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                            Account Name
                          </label>
                          <input
                            type="text"
                            value={newWallet.accountName}
                            onChange={(e) => setNewWallet({ ...newWallet, accountName: e.target.value })}
                            placeholder="Enter account name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          />
                        </div>

                        {/* Account Number */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                            Account Number / Mobile Number
                          </label>
                          <input
                            type="text"
                            value={newWallet.accountNumber}
                            onChange={(e) => setNewWallet({ ...newWallet, accountNumber: e.target.value })}
                            placeholder="Enter account or mobile number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => {
                              setViewMode('list');
                              setNewWallet({ type: 'GCash', accountName: '', accountNumber: '' });
                            }}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddWallet}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
                          >
                            {isLoading ? (
                              <>
                                <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              'Add E-Wallet'
                            )}
                          </button>
                      </div>
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

export default BankandCard;

