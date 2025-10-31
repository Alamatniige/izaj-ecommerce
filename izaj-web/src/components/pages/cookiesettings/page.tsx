"use client";

import React from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface CookieSettingsModalProps {
  showModal: boolean;
  onClose: () => void;
}

const CookieSettingsModal: React.FC<Partial<CookieSettingsModalProps>> = ({ showModal = true, onClose }) => {
  const router = useRouter();
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };
  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600/20 backdrop-blur-[1px] z-50 flex items-start justify-start" onClick={handleClose} style={{ fontFamily: 'Jost, sans-serif' }}>
      <div className="relative w-full sm:w-[360px] md:w-[400px] lg:w-[420px] bg-white h-screen shadow-xl rounded-none overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 z-10">
          <Icon icon="mdi:close" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>

        <div className="p-4 sm:p-6 mt-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>Cookie Preferences</h2>
          <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
            When you visit any website, it may store or retrieve information
            on your browser, mostly in the form of cookies. This information
            might be about you, your preferences or your device and is
            mostly used to make the site work as you expect it to. The
            information does not usually directly identify you, but it can give
            you a more personalised web experience. Because we respect
            your right to privacy, you can choose not to allow some types of
            cookies. Click on the different category headings to find out
            more and change our default settings. However, blocking some
            types of cookies may impact your experience of the site and the
            services we are able to offer.
          </p>
          <a href="#" className="text-blue-600 hover:underline text-xs sm:text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>More information</a>

          <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 mt-6 sm:mt-8" style={{ fontFamily: 'Jost, sans-serif' }}>Manage Cookie Settings</h3>

          {/* Cookie Categories */}
          <div className="border-t border-gray-200 py-3 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Icon icon="mdi:plus" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 flex-shrink-0" />
              <span className="font-semibold text-sm sm:text-base truncate" style={{ fontFamily: 'Jost, sans-serif' }}>Strictly Necessary Cookies</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-blue-600 font-semibold text-xs sm:text-sm flex-shrink-0">
              <Icon icon="mdi:check-circle" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span style={{ fontFamily: 'Jost, sans-serif' }}>Always Active</span>
            </div>
          </div>

          <div className="border-t border-gray-200 py-3 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Icon icon="mdi:plus" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 flex-shrink-0" />
              <span className="font-semibold text-sm sm:text-base truncate" style={{ fontFamily: 'Jost, sans-serif' }}>Performance Cookies</span>
            </div>
            {/* Toggle Placeholder */}
            <Icon icon="mdi:toggle-right" className="w-8 h-5 sm:w-10 sm:h-6 text-blue-600 flex-shrink-0" />
          </div>

          <div className="border-t border-gray-200 py-3 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Icon icon="mdi:plus" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 flex-shrink-0" />
              <span className="font-semibold text-sm sm:text-base truncate" style={{ fontFamily: 'Jost, sans-serif' }}>Functional Cookies</span>
            </div>
            {/* Toggle Placeholder */}
             <Icon icon="mdi:toggle-right" className="w-8 h-5 sm:w-10 sm:h-6 text-blue-600 flex-shrink-0" />
          </div>

          <div className="border-t border-b border-gray-200 py-3 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Icon icon="mdi:plus" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 flex-shrink-0" />
              <span className="font-semibold text-sm sm:text-base truncate" style={{ fontFamily: 'Jost, sans-serif' }}>Targeting Cookies</span>
            </div>
            {/* Toggle Placeholder */}
             <Icon icon="mdi:toggle-right" className="w-8 h-5 sm:w-10 sm:h-6 text-blue-600 flex-shrink-0" />
          </div>

          {/* Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4">
            <button className="bg-black text-white font-semibold rounded-md px-4 py-2.5 sm:py-3 text-sm sm:text-base hover:bg-gray-800 transition-colors w-full sm:w-auto" style={{ fontFamily: 'Jost, sans-serif' }}>
              Only Necessary Cookies
            </button>
            <button className="bg-white text-black font-semibold rounded-md px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 hover:bg-gray-100 transition-colors w-full sm:w-auto" style={{ fontFamily: 'Jost, sans-serif' }}>
              Confirm My Choices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieSettingsModal;


