"use client";

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';


const Footer: React.FC = () => {
  const [showCookieModal, setShowCookieModal] = useState(false);

  // State for mobile dropdowns
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);

  // State for cookie category expansion
  const [isPerformanceExpanded, setIsPerformanceExpanded] = useState(false);
  const [isFunctionalExpanded, setIsFunctionalExpanded] = useState(false);
  const [isTargetingExpanded, setIsTargetingExpanded] = useState(false);

  // State for cookie toggle status
  const [isPerformanceEnabled, setIsPerformanceEnabled] = useState(true); // Assuming enabled by default based on image
  const [isFunctionalEnabled, setIsFunctionalEnabled] = useState(true); // Assuming enabled by default
  const [isTargetingEnabled, setIsTargetingEnabled] = useState(true); // Assuming enabled by default

  

  const handleCookieSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowCookieModal(true);
  };

  const handleCloseCookieModal = () => {
    setShowCookieModal(false);
  };

  // Handlers for expanding/collapsing cookie categories
  const togglePerformanceExpanded = () => setIsPerformanceExpanded(!isPerformanceExpanded);
  const toggleFunctionalExpanded = () => setIsFunctionalExpanded(!isFunctionalExpanded);
  const toggleTargetingExpanded = () => setIsTargetingExpanded(!isTargetingExpanded);

  // Handlers for toggling cookie status
  const togglePerformanceEnabled = () => setIsPerformanceEnabled(!isPerformanceEnabled);
  const toggleFunctionalEnabled = () => setIsFunctionalEnabled(!isFunctionalEnabled);
  const toggleTargetingEnabled = () => setIsTargetingEnabled(!isTargetingEnabled);

  const handleOnlyNecessaryClick = () => {
    // Save only necessary cookies preference
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      performance: false,
      functional: false,
      targeting: false
    }));
    console.log('Only Necessary Cookies clicked');
    handleCloseCookieModal();
    // Notify cookie consent banner to hide
    window.dispatchEvent(new CustomEvent('cookieSettingsConfirmed'));
  };

  const handleConfirmChoicesClick = () => {
    // Save user's cookie preferences
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      performance: isPerformanceEnabled,
      functional: isFunctionalEnabled,
      targeting: isTargetingEnabled
    }));
    console.log('Confirm My Choices clicked');
    console.log('Performance Cookies Enabled:', isPerformanceEnabled);
    console.log('Functional Cookies Enabled:', isFunctionalEnabled);
    console.log('Targeting Cookies Enabled:', isTargetingEnabled);
    handleCloseCookieModal();
    // Notify cookie consent banner to hide
    window.dispatchEvent(new CustomEvent('cookieSettingsConfirmed'));
  };

  // Listen for custom event to open cookie settings from consent banner
  useEffect(() => {
    const handleOpenCookieSettings = () => {
      setShowCookieModal(true);
    };

    window.addEventListener('openCookieSettings', handleOpenCookieSettings);
    
    return () => {
      window.removeEventListener('openCookieSettings', handleOpenCookieSettings);
    };
  }, []);

  return (
    <>
      {/* Get Socials Section */}
      <div className="bg-gray-50 pt-6 md:pt-12 pb-2 md:pb-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>Get Socials</h2>
            <p className="text-gray-600 text-sm md:text-base mb-2 md:mb-4 max-w-2xl mx-auto" style={{ fontFamily: 'Jost, sans-serif' }}>
              Follow us on social media for the latest updates, lighting inspiration, and exclusive offers!
            </p>
            
            {/* Social Media Icons */}
            <div className="flex justify-center gap-3 md:gap-6">
              <a href="https://facebook.com/izajlighting" target="_blank" rel="noopener noreferrer" 
                 className="bg-[#1877F3] text-white rounded-full w-10 h-10 md:w-14 md:h-14 flex items-center justify-center hover:bg-[#166FE5] transition-colors">
                <Icon icon="mdi:facebook" width="20" height="20" className="md:w-7 md:h-7" />
              </a>
              <a href="https://www.instagram.com/izajlightingcentre/" target="_blank" rel="noopener noreferrer" 
                 className="bg-[#E4405F] text-white rounded-full w-10 h-10 md:w-14 md:h-14 flex items-center justify-center hover:bg-[#D62976] transition-colors">
                <Icon icon="mdi:instagram" width="20" height="20" className="md:w-7 md:h-7" />
              </a>
              <a href="https://www.tiktok.com/@izaj.lighting.cen" target="_blank" rel="noopener noreferrer" 
                 className="bg-black text-white rounded-full w-10 h-10 md:w-14 md:h-14 flex items-center justify-center hover:bg-gray-800 transition-colors">
                <Icon icon="ri:tiktok-fill" width="20" height="20" className="md:w-7 md:h-7" />
              </a>
            </div>
            
            {/* Call to Action */}
            <div className="mt-3 md:mt-4">
              <p className="text-gray-700 text-sm md:text-base mb-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                Tag us in your lighting photos for a chance to be featured!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <span className="text-gray-600 text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>Use hashtag:</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium" style={{ fontFamily: 'Jost, sans-serif' }}>
                  #IzajLighting
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      {/* Footer */}
      <footer className="bg-gray-50 text-black py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-24">
            {/* IZAJ Family */}
            <div className="lg:col-span-1">
              <h3 className="text-xl md:text-2xl mb-3 md:mb-4 font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>IZAJ Family</h3>
              <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 max-w-xs" style={{ fontFamily: 'Jost, sans-serif' }}>Unlock exclusive deals and special offers just for you! Subscribe now and be the first to know about flash sales, discounts, and new arrivals!</p>
              <Link href="/subscribe" className="bg-black text-white text-sm md:text-base font-semibold rounded-full px-5 md:px-8 py-2 md:py-3 hover:bg-gray-800 transition-colors inline-block" style={{ fontFamily: 'Jost, sans-serif' }}>Join for free</Link>
            </div>

            {/* Our Company - Mobile Dropdown */}
            <div>
              <button 
                onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                className="flex items-center justify-between w-full md:hidden"
              >
                <h3 className="text-lg md:text-xl tracking-tight font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>OUR COMPANY</h3>
                <Icon 
                  icon={isCompanyOpen ? "mdi:chevron-up" : "mdi:chevron-down"} 
                  width="24" 
                  height="24" 
                  className="text-gray-700"
                />
              </button>
              <h3 className="text-lg md:text-xl mb-3 md:mb-4 tracking-tight hidden md:block font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>OUR COMPANY</h3>
              <ul className={`space-y-2 md:space-y-3 ${isCompanyOpen ? 'block' : 'hidden'} md:block`}>
                <li><Link href="/" className="hover:underline transition-colors text-sm md:text-base text-gray-700" style={{ fontFamily: 'Jost, sans-serif' }}>Home</Link></li>
                <li><Link href="/static/aboutus" className="hover:underline transition-colors text-sm md:text-base text-gray-700" style={{ fontFamily: 'Jost, sans-serif' }}>About Us</Link></li>
                <li><Link href="/static/contactus" className="hover:underline transition-colors text-sm md:text-base text-gray-700" style={{ fontFamily: 'Jost, sans-serif' }}>Contact Us</Link></li>
              </ul>
            </div>

            {/* More Info - Mobile Dropdown */}
            <div>
              <button 
                onClick={() => setIsMoreInfoOpen(!isMoreInfoOpen)}
                className="flex items-center justify-between w-full md:hidden"
              >
                <h3 className="text-lg md:text-xl tracking-tight font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>MORE INFO</h3>
                <Icon 
                  icon={isMoreInfoOpen ? "mdi:chevron-up" : "mdi:chevron-down"} 
                  width="24" 
                  height="24" 
                  className="text-gray-700"
                />
              </button>
              <h3 className="text-lg md:text-xl mb-3 md:mb-4 tracking-tight hidden md:block font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>MORE INFO</h3>
              <ul className={`space-y-2 md:space-y-3 ${isMoreInfoOpen ? 'block' : 'hidden'} md:block`}>
                <li><Link href="/delivery" className="hover:underline transition-colors text-sm md:text-base text-gray-700" style={{ fontFamily: 'Jost, sans-serif' }}>Delivery & Installation</Link></li>
                <li><Link href="/static/privacypolicy" className="hover:underline transition-colors text-sm md:text-base text-gray-700" style={{ fontFamily: 'Jost, sans-serif' }}>Privacy Policy</Link></li>
                <li><Link href="/static/return" className="hover:underline transition-colors text-sm md:text-base text-gray-700" style={{ fontFamily: 'Jost, sans-serif' }}>Returns & Refunds</Link></li>
                <li><Link href="/static/help" className="hover:underline transition-colors text-sm md:text-base text-gray-700" style={{ fontFamily: 'Jost, sans-serif' }}>Help & FAQs</Link></li>
                <li><Link href="/static/terms" className="hover:underline transition-colors text-sm md:text-base text-gray-700" style={{ fontFamily: 'Jost, sans-serif' }}>Terms & Conditions</Link></li>
                <li><Link href="/static/warranty" className="hover:underline transition-colors text-sm md:text-base text-gray-700" style={{ fontFamily: 'Jost, sans-serif' }}>Warranty Terms</Link></li>
                <li><Link href="/static/careers" className="hover:underline transition-colors text-sm md:text-base text-gray-700" style={{ fontFamily: 'Jost, sans-serif' }}>Careers</Link></li>
              </ul>
            </div>

            {/* Connect With Us - Mobile Dropdown */}
            <div>
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center justify-between w-full md:hidden"
              >
                <span className="text-lg md:text-xl tracking-tight whitespace-nowrap font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>CONNECT WITH US</span>
                <Icon 
                  icon={isLocationOpen ? "mdi:chevron-up" : "mdi:chevron-down"} 
                  width="24" 
                  height="24" 
                  className="text-gray-700"
                />
              </button>
                <span className="text-lg md:text-xl mb-3 md:mb-4 tracking-tight hidden md:block whitespace-nowrap font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>CONNECT WITH US</span>
                <ul className={`space-y-2 md:space-y-3 ${isLocationOpen ? 'block' : 'hidden'} md:block`}>
                <li>
              <a href="mailto:izajtrading@gmail.com" className="hover:underline transition-colors text-sm md:text-base text-gray-700 flex items-center gap-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  <span className="flex items-center">
                    <Icon icon="mdi:email-outline" width={18} height={18} className="inline-block align-middle !text-gray-700" />
                    <span className="inline-block align-middle ml-1">izajtrading@gmail.com</span>
                  </span>
                  </a>
                </li>
                <li>
                  <a href="tel:+639123456789" className="hover:underline transition-colors text-sm md:text-base text-gray-700 flex items-center gap-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  <Icon icon="mdi:cellphone" width="18" height="18" /> +63 9423633442
                  </a>
                </li>
                <li>
                  <a href="tel:+63491234567" className="hover:underline transition-colors text-sm md:text-base text-gray-700 flex items-center gap-2" style={{ fontFamily: 'Jost, sans-serif' }}>
                  <Icon icon="mdi:phone" width="18" height="18" /> (049) 123 4567
                  </a>
                </li>
                </ul>
            </div>

            {/* Our Branches - Mobile Dropdown */}
            <div>
              <button 
                onClick={() => setIsBranchesOpen(!isBranchesOpen)}
                className="flex items-center justify-between w-full md:hidden"
              >
                <h3 className="text-lg md:text-xl tracking-tight font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>OUR BRANCHES</h3>
                <Icon 
                  icon={isBranchesOpen ? "mdi:chevron-up" : "mdi:chevron-down"} 
                  width="24" 
                  height="24" 
                  className="text-gray-700"
                />
              </button>
              <h3 className="text-lg md:text-xl mb-3 md:mb-4 tracking-tight hidden md:block font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>OUR BRANCHES</h3>
              <ul className={`space-y-1 md:space-y-2 text-gray-500 text-sm md:text-base ${isBranchesOpen ? 'block' : 'hidden'} md:block`}>
                <li>
                  <a 
                    href="https://www.google.com/maps/place/Izaj+Lighting+Centre+-+San+Pablo/@14.0680728,121.3103475,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd5ddbc696a00d:0x65bad29909e92f04!8m2!3d14.0680728!4d121.3152184!16s%2Fg%2F11h22htb19?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-2 py-1 hover:underline transition-colors"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    San Pablo City
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.google.com/maps/place/Izaj+Trading+-+Isabang/@13.9554531,121.5698904,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd4d36ed45d383:0xb5d4f1d657fd5710!8m2!3d13.9554531!4d121.5724653!16s%2Fg%2F11fss_vt86?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-2 py-1 hover:underline transition-colors"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    Quezon
                  </a>
                </li>
                <li>
                  <span className="block px-2 py-1" style={{ fontFamily: 'Jost, sans-serif' }}>Laguna</span>
                </li>
                <li>
                  <a 
                    href="https://www.google.com/maps/place/Izaj+Lighting+Centre+-+Silang,+Cavite/@14.222957,121.0352701,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd7deb0241cebf:0x6c3fb95ff88ea9e5!8m2!3d14.222957!4d121.037845!16s%2Fg%2F11r7l9rwh6?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-2 py-1 hover:underline transition-colors"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    Cavite
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.google.com/maps/place/Izaj+Lighting+Centre+-+The+Outlets/@14.0089879,121.1659881,17z/data=!4m14!1m7!3m6!1s0x33bd6f3d390306bd:0xa232bac2f4c93d56!2sIzaj+Lighting+Centre+-+The+Outlets!8m2!3d14.0089879!4d121.168563!16s%2Fg%2F11lrykbd20!3m5!1s0x33bd6f3d390306bd:0xa232bac2f4c93d56!8m2!3d14.0089879!4d121.168563!16s%2Fg%2F11lrykbd20?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-2 py-1 hover:underline transition-colors"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    Batangas
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.google.com/maps/place/Izaj+Lighting+Centre/@13.7618155,122.5099722,10z/data=!4m6!3m5!1s0x33a18cb9111c5bd7:0x6d4dbcb899ac7b91!8m2!3d13.6162057!4d123.1876693!16s%2Fg%2F11yb7pz8gs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-2 py-1 hover:underline transition-colors"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    Camarines Sur
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.google.com/maps/place/Izaj+Lighting+Centre+-+Sorsogon/@12.9840183,123.98977,17z/data=!3m1!4b1!4m6!3m5!1s0x33a0ef7263c12b3d:0x578b0d91a824001!8m2!3d12.9840183!4d123.9923449!16s%2Fg%2F11s4wh01xb?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-2 py-1 hover:underline transition-colors"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    Sorsogon
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.google.com/maps/place/Izaj+Lighting+Centre+-+La+Union/@16.5429009,120.3206011,17z/data=!3m1!4b1!4m6!3m5!1s0x3391850088aacc93:0xc5080291f2de408!8m2!3d16.542901!4d120.325472!16s%2Fg%2F11tfg8zwwm?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-2 py-1 hover:underline transition-colors"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    La Union
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social and Payment Icons Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 mt-12 md:mt-16">
            <div className="flex flex-col md:flex-row items-center gap-6">
              

              {/* Payment Icons */}
              <div className="flex gap-3 md:gap-4">
                <div className="rounded-lg border border-gray-200 bg-white w-14 h-10 md:w-16 md:h-12 flex items-center justify-center">
                  <img src="/gcash2.png" alt="GCash" className="h-5 md:h-6" />
                </div>
                <div className="rounded-lg border border-gray-200 bg-white w-14 h-10 md:w-16 md:h-12 flex items-center justify-center">
                  <img src="/maya2.png" alt="Maya" className="h-6 md:h-8 w-auto object-contain" />
                </div>
              </div>
            </div>

            
          </div>

          {/* Divider Line */}
          <hr className="my-6 border-gray-200" />

          {/* Bottom Footer Info */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-3 md:gap-4 pb-2">
            <div className="text-gray-700 text-[11px] sm:text-xs md:text-sm text-center md:text-left leading-snug" style={{ fontFamily: 'Jost, sans-serif' }}>
              © Izaj Lighting Centre 2024
              <br className="hidden md:block" />
              <span className="block md:inline">IZAJ (PHILIPPINES), INC. (Registration No. 123456789)</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-6 text-gray-700 text-xs sm:text-sm md:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>
              <Link href="/static/cookiepolicy" className="hover:underline">Cookie policy</Link>
              <button onClick={handleCookieSettingsClick} className="hover:underline">Cookie settings</button>
              <Link href="/static/termofuse" className="hover:underline">Terms of use</Link>
              <Link href="/static/termofpurchase" className="hover:underline">Terms of purchase</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Settings Modal */}
      {showCookieModal && (
        <div className="fixed inset-0 bg-gray-600/20 backdrop-blur-[1px] z-50 flex items-start justify-start" onClick={handleCloseCookieModal}>
          <div className={`relative w-[360px] sm:w-[400px] md:w-[420px] bg-white h-screen shadow-xl rounded-none transform transition-transform ease-in-out duration-300 ${showCookieModal ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button onClick={handleCloseCookieModal} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100">
              <Icon icon="mdi:close" width="24" height="24" className="text-gray-700" />
            </button>

            <div className="p-4 md:p-6 mt-6">
              <h2 className="text-xl md:text-2xl mb-3 md:mb-4 font-semibold" style={{ fontFamily: 'Jost, sans-serif' }}>Cookie Preferences</h2>
              <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
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
              <a href="#" className="text-blue-600 hover:underline text-xs md:text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>More information</a>

              <h3 className="text-lg md:text-xl mb-3 md:mb-4 mt-6 md:mt-8 font-semibold">Manage Cookie Settings</h3>

              {/* Cookie Categories */}
              <div className="space-y-2 md:space-y-4">
                {/* Strictly Necessary Cookies */}
                <div className="border-t border-gray-200 py-3 md:py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Icon icon="mdi:plus" width="18" height="18" className="md:w-5 md:h-5 text-gray-700" />
                    <span className="font-semibold text-sm md:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>Strictly Necessary Cookies</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs md:text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
                    <Icon icon="mdi:check-circle" width="18" height="18" className="md:w-5 md:h-5 text-blue-600" />
                    Always Active
                  </div>
                </div>

                {/* Performance Cookies */}
                <div className="border-t border-gray-200">
                  <div className="py-3 md:py-4 flex items-center justify-between cursor-pointer" onClick={togglePerformanceExpanded}>
                    <div className="flex items-center gap-2">
                      <Icon icon={isPerformanceExpanded ? "mdi:minus" : "mdi:plus"} width="18" height="18" className="md:w-5 md:h-5 text-gray-700" />
                      <span className="font-semibold text-sm md:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>Performance Cookies</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); togglePerformanceEnabled(); }}>
                      <Icon icon={isPerformanceEnabled ? "mdi:toggle-right" : "mdi:toggle-left"} width="36" height="20" className={isPerformanceEnabled ? "text-blue-600" : "text-gray-400"} />
                    </button>
                  </div>
                    {isPerformanceExpanded && (
                    <div className="pb-3 md:pb-4 text-gray-600 text-xs md:text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
                      <p>Performance cookies are used to collect information about how visitors use the website.</p>
                    </div>
                  )}
                </div>

                {/* Functional Cookies */}
                <div className="border-t border-gray-200">
                  <div className="py-3 md:py-4 flex items-center justify-between cursor-pointer" onClick={toggleFunctionalExpanded}>
                    <div className="flex items-center gap-2">
                      <Icon icon={isFunctionalExpanded ? "mdi:minus" : "mdi:plus"} width="18" height="18" className="md:w-5 md:h-5 text-gray-700" />
                      <span className="font-semibold text-sm md:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>Functional Cookies</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleFunctionalEnabled(); }}>
                      <Icon icon={isFunctionalEnabled ? "mdi:toggle-right" : "mdi:toggle-left"} width="36" height="20" className={isFunctionalEnabled ? "text-blue-600" : "text-gray-400"} />
                    </button>
                  </div>
                  {isFunctionalExpanded && (
                    <div className="pb-3 md:pb-4 text-gray-600 text-xs md:text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
                      <p>Functional cookies allow the website to remember choices you make and provide enhanced, more personal features.</p>
                    </div>
                  )}
                </div>

                {/* Targeting Cookies */}
                <div className="border-t border-b border-gray-200">
                  <div className="py-3 md:py-4 flex items-center justify-between cursor-pointer" onClick={toggleTargetingExpanded}>
                    <div className="flex items-center gap-2">
                      <Icon icon={isTargetingExpanded ? "mdi:minus" : "mdi:plus"} width="18" height="18" className="md:w-5 md:h-5 text-gray-700" />
                      <span className="font-semibold text-sm md:text-base" style={{ fontFamily: 'Jost, sans-serif' }}>Targeting Cookies</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleTargetingEnabled(); }}>
                      <Icon icon={isTargetingEnabled ? "mdi:toggle-right" : "mdi:toggle-left"} width="36" height="20" className={isTargetingEnabled ? "text-blue-600" : "text-gray-400"} />
                    </button>
                  </div>
                  {isTargetingExpanded && (
                    <div className="pb-3 md:pb-4 text-gray-600 text-xs md:text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
                      <p>Targeting cookies are used to deliver advertisements more relevant to you and your interests.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
                <button 
                  className="bg-black text-white text-sm md:text-base font-semibold rounded-md px-4 py-2 md:py-3 hover:bg-gray-800 transition-colors flex-1"
                  style={{ fontFamily: 'Jost, sans-serif' }}
                  onClick={handleOnlyNecessaryClick}
                >
                  Only Necessary Cookies
                </button>
                <button 
                  className="bg-white text-black text-sm md:text-base font-semibold rounded-md px-4 py-2 md:py-3 border border-gray-300 hover:bg-gray-100 transition-colors flex-1"
                  style={{ fontFamily: 'Jost, sans-serif' }}
                  onClick={handleConfirmChoicesClick}
                >
                  Confirm My Choices
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;