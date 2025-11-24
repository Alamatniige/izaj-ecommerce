"use client";

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

interface CookieConsentProps {
  forceShow?: boolean; // Force show the banner regardless of localStorage
}

const CookieConsent: React.FC<CookieConsentProps> = ({ forceShow = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    // Show banner if forced or if user hasn't accepted yet
    if (forceShow || !cookieConsent) {
      setIsVisible(true);
    }
  }, [forceShow]);

  // Listen for when user confirms choices in settings modal
  useEffect(() => {
    const handleCookieSettingsConfirmed = () => {
      // Check if consent was saved after settings were confirmed
      const cookieConsent = localStorage.getItem('cookieConsent');
      if (cookieConsent) {
        setIsVisible(false);
      }
    };

    window.addEventListener('cookieSettingsConfirmed', handleCookieSettingsConfirmed);
    
    return () => {
      window.removeEventListener('cookieSettingsConfirmed', handleCookieSettingsConfirmed);
    };
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      performance: true,
      functional: true,
      targeting: true
    }));
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      performance: false,
      functional: false,
      targeting: false
    }));
    setIsVisible(false);
  };

  const handleCustomize = () => {
    // Open cookie settings modal (you can trigger the Footer's modal here)
    // Don't hide the banner yet - wait for user to confirm in settings
    // Dispatch custom event to open settings
    window.dispatchEvent(new CustomEvent('openCookieSettings'));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          {/* Cookie Icon and Text */}
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <Icon 
                icon="mdi:cookie" 
                width="24" 
                height="24" 
                className="text-gray-700 mt-1 flex-shrink-0" 
              />
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  We use cookies
                </h3>
                <p className="text-sm md:text-base text-gray-700 mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.
                </p>
                <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                  <Link 
                    href="/static/cookiepolicy" 
                    className="text-blue-600 hover:underline"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    Cookie Policy
                  </Link>
                  <span className="text-gray-400">•</span>
                  <Link 
                    href="/static/privacypolicy" 
                    className="text-blue-600 hover:underline"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <button
              onClick={handleAcceptNecessary}
              className="px-4 py-2 text-sm md:text-base font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              Accept Necessary
            </button>
            <button
              onClick={handleCustomize}
              className="px-4 py-2 text-sm md:text-base font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              Customize
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm md:text-base font-semibold text-white bg-black rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

