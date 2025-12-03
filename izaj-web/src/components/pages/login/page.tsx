"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../../../context/UserContext';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  
  const { login } = useUserContext();
  const router = useRouter();

  // Product showcase data
  const featuredProducts = [
    {
      name: "Elegant Chandeliers",
      image: "/chadelier.jpg",
      description: "Transform your space with luxury"
    },
    {
      name: "Modern Pendant Lights",
      image: "/pendant.jpg",
      description: "Contemporary style for any room"
    },
    {
      name: "Ceiling Fixtures",
      image: "/ceiling.jpg",
      description: "Bright and beautiful illumination"
    },
    {
      name: "Floor Lamps",
      image: "/floor.jpg",
      description: "Perfect ambient lighting"
    },
    {
      name: "Cluster Lights",
      image: "/cluster.jpg",
      description: "Creative lighting solutions"
    }
  ];

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
    
    // Check for success messages
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('signup') === 'success' || urlParams.get('confirmed') === 'true' || urlParams.get('reset') === 'success') {
      setShowSuccessMessage(true);
      
      // Auto-hide message after 8 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 8000);
      
      // Clean up URL without reloading
      window.history.replaceState({}, '', '/login');
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-rotate product showcase
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductIndex((prevIndex) => 
        (prevIndex + 1) % featuredProducts.length
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const isPhoneLike = (raw: string) => {
    if (!raw) return false;
    const v = raw.trim();
    // Only digits and common phone symbols => treat as phone-like
    return /^[+\d\s\-()]+$/.test(v);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    // Live auto-format for phone when logging in (identifier field)
    if (name === 'email' && isPhoneLike(value)) {
      const formatted = formatAsPhoneDigitsLive(value);
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Live formatter: keep only local PH mobile digits (no +63 in value)
  const formatAsPhoneDigitsLive = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    const digits = trimmed.replace(/\D/g, '');
    if (!digits) return '';
    let local = digits;
    // If starts with country code 63 and has at least 12 chars (63 + 10 digits)
    if (digits.startsWith('63') && digits.length >= 12) {
      local = digits.slice(2);
    } else if (digits.startsWith('0') && digits.length >= 11) {
      // Only strip leading 0 when there are 11 digits (0 + 10 digits)
      local = digits.slice(1);
    } else {
      local = digits;
    }
    // Ensure starts with 9 if possible
    if (local.startsWith('9')) {
      return local.slice(0, 10);
    }
    // If user typing partial, just cap length to 10
    return local.slice(0, 10);
  };

  const isPhoneMode = isPhoneLike(formData.email);

  const handleIdentifierBlur = () => {
    const value = (formData.email || '').trim();
    if (!value || !isPhoneLike(value)) return; // treat as email if not phone-like
    const normalized = formatAsPhoneDigitsLive(value);
    if (normalized !== value) {
      setFormData(prev => ({ ...prev, email: normalized }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email or phone is required';
    } else {
      const emailOk = /\S+@\S+\.\S+/.test(formData.email);
      const digits = formData.email.replace(/\D/g, '');
      const phoneOk = /^\d{10,15}$/.test(digits);
      if (!emailOk && !phoneOk) {
        newErrors.email = 'Enter a valid email or phone';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      router.push('/');
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ general: (error as Error).message || 'Authentication failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:gap-12 lg:gap-16 items-start">
          {/* Left Section - Title */}
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-tight font-poppins">
              Log in to your account
            </h1>
            <p className="text-base md:text-lg text-gray-600 font-jost">
              New at IZAJ?{' '}
              <button
                onClick={() => router.push('/signup')}
                className="text-black hover:underline font-medium font-jost"
              >
                Create an account here
              </button>
            </p>

            {/* Product Showcase - hidden on mobile */}
            <div className="relative mt-12 overflow-hidden rounded-2xl shadow-2xl group hidden md:block">
              {/* Background Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 z-10 pointer-events-none" />
              
              {/* Product Images with Transition */}
              <div className="relative h-[400px] w-full">
                {featuredProducts.map((product, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      index === currentProductIndex 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-105'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Product Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                <div className="transform transition-all duration-700">
                  <h3 className="text-2xl font-bold text-white mb-2 font-poppins">
                    {featuredProducts[currentProductIndex].name}
                  </h3>
                  <p className="text-gray-200 text-base font-jost">
                    {featuredProducts[currentProductIndex].description}
                  </p>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="absolute bottom-6 right-6 flex space-x-2 z-30">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProductIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentProductIndex
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`View product ${index + 1}`}
                  />
                ))}
              </div>

              {/* Decorative Corner Elements */}
              <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-white/30 z-20" />
              <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-white/30 z-20" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-white/30 z-20" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-white/30 z-20" />
            </div>

            {/* Additional Info - hidden on mobile */}
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-600" />
                  <span className="font-jost">Premium Quality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon icon="mdi:truck-fast" className="w-5 h-5 text-blue-600" />
                  <span className="font-jost">Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon icon="mdi:shield-check" className="w-5 h-5 text-purple-600" />
                  <span className="font-jost">Secure Shopping</span>
                </div>
              </div>

            {/* Stats Counter - hidden on mobile */}
            <div className="hidden md:block mt-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="grid grid-cols-3 gap-6">
                {/* Happy Customers */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon icon="mdi:account-group" className="w-6 h-6 text-blue-600 mr-2" />
                  </div>
                  <div className="text-3xl font-bold text-black mb-1 font-poppins">10,000+</div>
                  <div className="text-sm text-gray-600 font-medium font-jost">Happy Customers</div>
                </div>

                {/* Products */}
                <div className="text-center border-x border-gray-300">
                  <div className="flex items-center justify-center mb-2">
                    <Icon icon="mdi:lightbulb-on" className="w-6 h-6 text-yellow-500 mr-2" />
                  </div>
                  <div className="text-3xl font-bold text-black mb-1 font-poppins">500+</div>
                  <div className="text-sm text-gray-600 font-medium font-jost">Quality Products</div>
                </div>

                {/* Rating */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon icon="mdi:star" className="w-6 h-6 text-yellow-400 mr-2" />
                  </div>
                  <div className="text-3xl font-bold text-black mb-1 font-poppins">5.0★</div>
                  <div className="text-sm text-gray-600 font-medium font-jost">Customer Rating</div>
                </div>
              </div>

              {/* Bottom tagline */}
              <div className="mt-6 pt-6 border-t border-gray-300 text-center">
                <p className="text-sm text-gray-700 font-medium font-jost">
                  Join thousands of Filipinos lighting up their homes with IZAJ
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="bg-white w-full lg:max-w-lg">
            <p className="hidden md:block text-black text-sm md:text-base mb-0 md:mb-8 leading-relaxed font-bold font-jost">
              Get a more personalized experience where you don't need to fill in your information every time.
            </p>

            {showSuccessMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    {(() => {
                      const urlParams = new URLSearchParams(window.location.search);
                      if (urlParams.get('confirmed') === 'true') {
                        return (
                          <>
                            <p className="text-sm font-semibold text-green-800 mb-1 font-jost">
                              Email confirmed successfully!
                            </p>
                            <p className="text-sm text-green-700 font-jost">
                              You can now log in to your account.
                            </p>
                          </>
                        );
                      } else if (urlParams.get('reset') === 'success') {
                        return (
                          <>
                            <p className="text-sm font-semibold text-green-800 mb-1 font-jost">
                              Password reset successfully!
                            </p>
                            <p className="text-sm text-green-700 font-jost">
                              You can now log in with your new password.
                            </p>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <p className="text-sm font-semibold text-green-800 mb-1 font-jost">
                              Account created successfully!
                            </p>
                            <p className="text-sm text-green-700 font-jost">
                              Please check your email to confirm your account before logging in.
                            </p>
                          </>
                        );
                      }
                    })()}
                  </div>
                  <button
                    onClick={() => setShowSuccessMessage(false)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <Icon icon="mdi:close" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {errors.general && (
              <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-200 font-jost">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-black font-jost">Email or Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                    {isPhoneMode ? (
                      <span className="text-gray-600 text-sm font-medium font-jost">+63</span>
                    ) : (
                      <Icon icon="mdi:email" className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleIdentifierBlur}
                    ref={emailInputRef}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-help' : undefined}
                    className={`w-full ${isPhoneMode ? 'pl-14 md:pl-16' : 'pl-10 md:pl-12'} pr-3 md:pr-4 py-3 md:py-4 text-sm md:text-base border-2 bg-white text-black placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 rounded-none font-jost`}
                    placeholder={isPhoneMode ? '9XXXXXXXXXX' : 'Enter your email or phone'}
                  />
                  {errors.email && (
                    <p id="email-help" className="mt-1 text-sm text-red-600 font-jost">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-black font-jost">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                    <Icon icon="mdi:lock" className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 md:pl-12 py-3 md:py-4 pr-10 md:pr-12 text-sm md:text-base border-2 bg-white text-black placeholder-gray-400 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 rounded-none font-jost`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center transition-colors duration-200 rounded-none"
                  >
                    <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5 md:w-5 md:h-5 text-gray-600 hover:text-black transition-colors duration-200" />
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 font-jost">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 font-jost">
                    Remember me
                  </label>
                </div>
                <button 
                  type="button" 
                  onClick={() => router.push('/forgot-password')} 
                  className="text-sm text-black hover:underline font-medium font-jost"
                >
                  Forgot your password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 md:py-4 px-5 md:px-6 text-sm md:text-base font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center disabled:opacity-50 rounded-none font-poppins"
              >
                {isLoading ? (
                  <>
                    <Icon icon="mdi:loading" className="w-5 h-5 animate-spin mr-3" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Log in</span>
                )}
              </button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-sm md:text-base text-gray-600 font-jost">New at IZAJ?</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/signup')}
                  className="w-full bg-white text-black py-3 md:py-4 px-5 md:px-6 text-sm md:text-base border-2 border-gray-300 font-medium hover:bg-gray-50 transition-all duration-300 rounded-none mt-4 font-poppins"
                >
                  Create account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
