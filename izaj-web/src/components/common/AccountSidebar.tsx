"use client";

import React from 'react';
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
  return (
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
  );
};

export default AccountSidebar;
