"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../../../context/UserContext';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    confirmPassword: '',
    address: '',
    province: '',
    city: '',
    agreeToPrivacy: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const emailInputRef = useRef<HTMLInputElement>(null);
  
  // PSGC cascading dropdown state
  
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
  
  // Add error handling for UserContext
  let register;
  try {
    const userContext = useUserContext();
    register = userContext.register;
  } catch (error) {
    console.error('UserContext error:', error);
    // Fallback to direct API call if UserContext fails
    register = async (userData: any) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: `${userData.firstName} ${userData.lastName}`.trim(),
          phone: userData.phone,
        }),
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Signup failed');
      }
    };
  }

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };



  // Password validation function
  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const isValid = Object.values(requirements).every(req => req);
    return { requirements, isValid };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName || !formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName || !formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = 'Password does not meet requirements';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      // Prepare address data if address form is filled
      let addressData = undefined;
      if (showAddressForm && formData.address && formData.province && formData.city) {
        const composedAddress = `${formData.address.trim()}, ${formData.city.trim()}, ${formData.province.trim()}`.replace(/,\s*,/g, ', ').trim();
        
        addressData = {
          address: composedAddress,
          province: formData.province.trim(),
          city: formData.city.trim()
        };
      }

      const registerData = {
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phoneNumber.trim() || undefined,
        address: addressData
      };
      
      console.log('📝 Signup Form - Data being sent:', {
        ...registerData,
        password: '***hidden***'
      });
      
      const result = await register(registerData);
      
      // Redirect to login with success message
      router.push('/login?signup=success');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: (error as Error).message || 'Registration failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
     

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Section - Title */}
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-black leading-tight tracking-tight font-poppins">
              Create an IZAJ account
            </h1>
            <p className="text-lg text-gray-600 font-jost">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-black hover:underline font-medium font-jost"
              >
                Log in here
              </button>
            </p>

            {/* Product Showcase */}
            <div className="relative mt-12 overflow-hidden rounded-2xl shadow-2xl group">
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

            {/* Additional Info */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
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

            {/* Stats Counter */}
            <div className="mt-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
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
          <div className="bg-white max-w-lg">
            <p className="text-black text-base mb-8 leading-relaxed font-bold font-jost">
              From your profile, you will find all information connected to your account. And it's free to join!
            </p>

            {errors.general && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg font-jost">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black font-jost">First name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 text-base border-2 bg-white text-black placeholder-gray-400 ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 rounded-none font-jost`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 font-jost">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black font-jost">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 text-base border-2 bg-white text-black placeholder-gray-400 ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 rounded-none font-jost`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 font-jost">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black font-jost">Phone number (optional)</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 text-base border-2 bg-white text-black placeholder-gray-400 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 rounded-none font-jost`}
                    placeholder="9123456789"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base font-jost">+63</span>
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600 font-jost">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black font-jost">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  ref={emailInputRef}
                  className={`w-full px-4 py-4 text-base border-2 bg-white text-black placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 rounded-none font-jost`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 font-jost">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black font-jost">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 pr-12 text-base border-2 bg-white text-black placeholder-gray-400 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 rounded-none font-jost`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center transition-colors duration-200 rounded-none"
                  >
                    <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5 text-gray-600 hover:text-black transition-colors duration-200" />
                  </button>
                </div>
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2 font-jost">Password Requirements:</p>
                    <div className="space-y-1">
                      <div className={`flex items-center text-sm ${validatePassword(formData.password).requirements.minLength ? 'text-green-600' : 'text-gray-500'} font-jost`}>
                        <Icon icon={validatePassword(formData.password).requirements.minLength ? "mdi:check-circle" : "mdi:circle-outline"} className="w-4 h-4 mr-2" />
                        At least 8 characters
                      </div>
                      <div className={`flex items-center text-sm ${validatePassword(formData.password).requirements.hasUppercase ? 'text-green-600' : 'text-gray-500'} font-jost`}>
                        <Icon icon={validatePassword(formData.password).requirements.hasUppercase ? "mdi:check-circle" : "mdi:circle-outline"} className="w-4 h-4 mr-2" />
                        One uppercase letter
                      </div>
                      <div className={`flex items-center text-sm ${validatePassword(formData.password).requirements.hasLowercase ? 'text-green-600' : 'text-gray-500'} font-jost`}>
                        <Icon icon={validatePassword(formData.password).requirements.hasLowercase ? "mdi:check-circle" : "mdi:circle-outline"} className="w-4 h-4 mr-2" />
                        One lowercase letter
                      </div>
                      <div className={`flex items-center text-sm ${validatePassword(formData.password).requirements.hasNumber ? 'text-green-600' : 'text-gray-500'} font-jost`}>
                        <Icon icon={validatePassword(formData.password).requirements.hasNumber ? "mdi:check-circle" : "mdi:circle-outline"} className="w-4 h-4 mr-2" />
                        One number
                      </div>
                      <div className={`flex items-center text-sm ${validatePassword(formData.password).requirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'} font-jost`}>
                        <Icon icon={validatePassword(formData.password).requirements.hasSpecialChar ? "mdi:check-circle" : "mdi:circle-outline"} className="w-4 h-4 mr-2" />
                        One special character
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 font-jost">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black font-jost">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 pr-12 text-base border-2 bg-white text-black placeholder-gray-400 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 rounded-none font-jost`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center transition-colors duration-200 rounded-none"
                  >
                    <Icon icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5 text-gray-600 hover:text-black transition-colors duration-200" />
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2">
                    {formData.password === formData.confirmPassword ? (
                      <div className="flex items-center text-sm text-green-600 font-jost">
                        <Icon icon="mdi:check-circle" className="w-4 h-4 mr-2" />
                        Passwords match
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-red-600 font-jost">
                        <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-2" />
                        Passwords do not match
                      </div>
                    )}
                  </div>
                )}
                
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 font-jost">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Add Home Address Section */}
              <div 
                className="space-y-4 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                <div>
                  <label className="block text-sm font-bold text-black font-jost">Add home address (optional)</label>
                </div>
                
                <p className="text-sm text-gray-600 font-jost">
                  We'll remember your information for a quick and easy checkout experience
                </p>

                {showAddressForm && (
                  <div 
                    className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Province */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-black flex items-center font-jost">
                        <Icon icon="mdi:map-outline" className="w-4 h-4 mr-2 text-black" />
                        Province
                      </label>
                      <input
                        type="text"
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-base border-2 border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 rounded-none font-jost"
                        placeholder="e.g., Laguna"
                      />
                    </div>

                    {/* City / Municipality */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-black flex items-center font-jost">
                        <Icon icon="mdi:city" className="w-4 h-4 mr-2 text-black" />
                        City / Municipality
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-base border-2 border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 rounded-none font-jost"
                        placeholder="e.g., San Pablo City"
                      />
                    </div>

                    {/* Street Address */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-black flex items-center font-jost">
                        <Icon icon="mdi:home-outline" className="w-4 h-4 mr-2 text-black" />
                        Street / House / Building
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-base border-2 border-gray-300 bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 rounded-none font-jost"
                        placeholder="e.g., 123 Sampaguita St."
                      />
                    </div>

                  </div>
                )}
              </div>

              {/* Privacy Policy */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreeToPrivacy"
                  checked={formData.agreeToPrivacy}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeToPrivacy: e.target.checked }))}
                  className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="text-sm text-gray-600 font-jost">
                  By creating an account, you agree to our{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/static/privacypolicy')}
                    className="text-blue-600 hover:underline font-medium font-jost"
                  >
                    Privacy Policy
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-4 px-6 text-base font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center disabled:opacity-50 rounded-none font-poppins"
              >
                {isLoading ? (
                  <>
                    <Icon icon="mdi:loading" className="w-5 h-5 animate-spin mr-3" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
