"use client";

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

interface AccountSidebarProps {
  userData: {
    firstName: string;
    lastName: string;
  };
  profileImage: string;
  activePage: 'profile' | 'orders' | 'payments' | 'addresses' | 'changepassword';
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({ userData, profileImage, activePage }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
    {/* Desktop Sidebar */}
    <div className="hidden lg:block w-full lg:w-80 bg-white rounded-2xl shadow-lg p-6 border border-gray-300 self-start sticky top-6">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-black shadow-lg bg-gray-100 flex items-center justify-center">
          {profileImage ? (
            <img src={profileImage} alt="User" className="w-full h-full object-cover" />
          ) : (
            <Icon icon="lucide:user" className="w-10 h-10 text-gray-500" />
          )}
        </div>
        <div className="font-semibold text-xl mb-6 text-center text-gray-800" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
          {`${userData.firstName} ${userData.lastName}`.trim() || 'User'}
        </div>
        <ul className="w-full space-y-2">
          <li className={`py-2 px-3 rounded-lg transition-all duration-200 ${
            activePage === 'profile' 
              ? 'bg-black' 
              : 'hover:bg-gray-100'
          }`}>
            {activePage === 'profile' ? (
              <span className="text-white font-semibold text-sm block flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                <Icon icon="mdi:account-outline" className="w-4 h-4 mr-2" />
                Profile
              </span>
            ) : (
              <Link href="/account" className="text-gray-600 hover:text-black text-sm block transition-colors flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                <Icon icon="mdi:account-outline" className="w-4 h-4 mr-2" />
                Profile
              </Link>
            )}
          </li>
          <li className={`py-2 px-3 rounded-lg transition-all duration-200 ${
            activePage === 'orders' 
              ? 'bg-black' 
              : 'hover:bg-gray-100'
          }`}>
            {activePage === 'orders' ? (
              <span className="text-white font-semibold text-sm block flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                <Icon icon="mdi:package-variant" className="w-4 h-4 mr-2" />
                My Orders
              </span>
            ) : (
              <Link href="/orders" className="text-gray-600 hover:text-black text-sm block transition-colors flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                <Icon icon="mdi:package-variant" className="w-4 h-4 mr-2" />
                My Orders
              </Link>
            )}
          </li>
          <li className={`py-2 px-3 rounded-lg transition-all duration-200 ${
            activePage === 'payments' 
              ? 'bg-black' 
              : 'hover:bg-gray-100'
          }`}>
            {activePage === 'payments' ? (
              <span className="text-white font-semibold text-sm block flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                <Icon icon="mdi:credit-card-outline" className="w-4 h-4 mr-2" />
                Payment Methods
              </span>
            ) : (
              <Link href="/payments" className="text-gray-600 hover:text-black text-sm block transition-colors flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                <Icon icon="mdi:credit-card-outline" className="w-4 h-4 mr-2" />
                Payment Methods
              </Link>
            )}
          </li>
          <li className={`py-2 px-3 rounded-lg transition-all duration-200 ${
            activePage === 'addresses' 
              ? 'bg-black' 
              : 'hover:bg-gray-100'
          }`}>
            {activePage === 'addresses' ? (
              <span className="text-white font-semibold text-sm block flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                <Icon icon="mdi:map-marker" className="w-4 h-4 mr-2" />
                Addresses
              </span>
            ) : (
              <Link href="/addresses" className="text-gray-600 hover:text-black text-sm block transition-colors flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                <Icon icon="mdi:map-marker" className="w-4 h-4 mr-2" />
                Addresses
              </Link>
            )}
          </li>
          <li className={`py-2 px-3 rounded-lg mb-2 transition-all duration-200 ${
            activePage === 'changepassword' 
              ? 'bg-black' 
              : 'hover:bg-gray-100'
          }`}>
            {activePage === 'changepassword' ? (
              <span className="text-white font-semibold text-sm block flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                <Icon icon="mdi:lock-outline" className="w-4 h-4 mr-2" />
                Change Password
              </span>
            ) : (
              <Link href="/changepassword" className="text-gray-600 hover:text-black text-sm block transition-colors flex items-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400 }}>
                <Icon icon="mdi:lock-outline" className="w-4 h-4 mr-2" />
                Change Password
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>

    {/* Mobile Bottom Bar Trigger */}
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-screen-sm px-4 pb-6 pt-2">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-full inline-flex items-center justify-center px-4 py-3 rounded-md bg-black text-white text-sm font-semibold uppercase active:scale-[0.99] transition hover:bg-gray-800 shadow-lg"
          style={{ fontFamily: 'Jost, sans-serif' }}
          aria-label="Open Account Menu"
        >
          ACCOUNT MENU
        </button>
      </div>
    </div>

    {/* Mobile Bottom Sheet Modal */}
    <>
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
        style={{ background: 'rgba(0,0,0,0.30)' }}
      />
      <div
        className={`fixed left-0 right-0 bottom-0 h-[70vh] w-full bg-white z-50 lg:hidden shadow-2xl flex flex-col transition-all duration-300 ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="px-4 pt-4 pb-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black bg-gray-100 flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} alt="User" className="w-full h-full object-cover" />
              ) : (
                <Icon icon="lucide:user" className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <span className="text-sm text-gray-900" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
              {`${userData.firstName} ${userData.lastName}`.trim() || 'User'}
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-2xl text-gray-500 hover:text-black"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <ul className="space-y-2">
            <li>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border ${activePage === 'profile' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-700 hover:bg-gray-50'} transition-colors`}
                style={{ fontFamily: 'Jost, sans-serif', fontWeight: activePage === 'profile' ? 600 : 400 }}
              >
                <span className="flex items-center"><Icon icon="mdi:account-outline" className="w-5 h-5 mr-3" />Profile</span>
                {activePage === 'profile' ? <Icon icon="mdi:check" className="w-4 h-4" /> : <Icon icon="mdi:chevron-right" className="w-4 h-4" />}
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border ${activePage === 'orders' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-700 hover:bg-gray-50'} transition-colors`}
                style={{ fontFamily: 'Jost, sans-serif', fontWeight: activePage === 'orders' ? 600 : 400 }}
              >
                <span className="flex items-center"><Icon icon="mdi:package-variant" className="w-5 h-5 mr-3" />My Orders</span>
                {activePage === 'orders' ? <Icon icon="mdi:check" className="w-4 h-4" /> : <Icon icon="mdi:chevron-right" className="w-4 h-4" />}
              </Link>
            </li>
            <li>
              <Link
                href="/payments"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border ${activePage === 'payments' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-700 hover:bg-gray-50'} transition-colors`}
                style={{ fontFamily: 'Jost, sans-serif', fontWeight: activePage === 'payments' ? 600 : 400 }}
              >
                <span className="flex items-center"><Icon icon="mdi:credit-card-outline" className="w-5 h-5 mr-3" />Payment Methods</span>
                {activePage === 'payments' ? <Icon icon="mdi:check" className="w-4 h-4" /> : <Icon icon="mdi:chevron-right" className="w-4 h-4" />}
              </Link>
            </li>
            <li>
              <Link
                href="/addresses"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border ${activePage === 'addresses' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-700 hover:bg-gray-50'} transition-colors`}
                style={{ fontFamily: 'Jost, sans-serif', fontWeight: activePage === 'addresses' ? 600 : 400 }}
              >
                <span className="flex items-center"><Icon icon="mdi:map-marker" className="w-5 h-5 mr-3" />Addresses</span>
                {activePage === 'addresses' ? <Icon icon="mdi:check" className="w-4 h-4" /> : <Icon icon="mdi:chevron-right" className="w-4 h-4" />}
              </Link>
            </li>
            <li>
              <Link
                href="/changepassword"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border ${activePage === 'changepassword' ? 'border-black bg-gray-50 text-black' : 'border-gray-200 text-gray-700 hover:bg-gray-50'} transition-colors`}
                style={{ fontFamily: 'Jost, sans-serif', fontWeight: activePage === 'changepassword' ? 600 : 400 }}
              >
                <span className="flex items-center"><Icon icon="mdi:lock-outline" className="w-5 h-5 mr-3" />Change Password</span>
                {activePage === 'changepassword' ? <Icon icon="mdi:check" className="w-4 h-4" /> : <Icon icon="mdi:chevron-right" className="w-4 h-4" />}
              </Link>
            </li>
          </ul>
        </div>

        {/* Sticky Close Button */}
        <div className="absolute bottom-0 left-0 w-full px-4 pb-6 pt-2 bg-transparent flex justify-center">
          <button
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-black text-white text-sm font-semibold uppercase active:scale-[0.99] transition hover:bg-gray-800 shadow-lg"
            style={{ fontFamily: 'Jost, sans-serif' }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close Account Menu"
          >
            CLOSE
          </button>
        </div>
      </div>
    </>
    </>
  );
};

export default AccountSidebar;
