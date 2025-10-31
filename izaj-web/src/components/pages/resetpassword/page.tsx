'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Password validation
  const passwordValidation: PasswordValidation = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  // Check if token is present on mount
  useEffect(() => {
    if (!token) {
      console.warn('⚠️ No reset token found in URL');
    } else {
      console.log('✅ Reset token found:', token.substring(0, 10) + '...');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isPasswordValid) {
      setError('Password does not meet all requirements');
      return;
    }
    
    if (!doPasswordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token || undefined,
          password: password,
          confirmPassword: confirmPassword
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to reset password. Please try again.');
        return;
      }

      setResetSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login?reset=success');
      }, 3000);
      
    } catch (error) {
      console.error('Reset password error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show error if no token
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8" style={{ fontFamily: "'Jost', sans-serif" }}>
        <div className="max-w-md w-full space-y-6 sm:space-y-8 text-center px-3 sm:px-4">
          <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16">
            <Icon icon="mdi:alert-circle" className="w-12 h-12 sm:w-16 sm:h-16 text-red-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Jost', sans-serif" }}>Invalid Reset Link</h2>
          <p className="text-sm sm:text-base text-gray-600 px-2" style={{ fontFamily: "'Jost', sans-serif" }}>
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/forgot-password')}
              className="w-full bg-black text-white px-6 py-3 sm:py-3 rounded-md hover:bg-gray-800 active:bg-gray-900 transition-colors font-medium text-sm sm:text-base min-h-[44px] sm:min-h-[48px]"
              style={{ fontFamily: "'Jost', sans-serif", touchAction: 'manipulation' }}
            >
              Request New Reset Link
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 sm:py-3 rounded-md hover:bg-gray-300 active:bg-gray-400 transition-colors font-medium text-sm sm:text-base min-h-[44px] sm:min-h-[48px]"
              style={{ fontFamily: "'Jost', sans-serif", touchAction: 'manipulation' }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8" style={{ fontFamily: "'Jost', sans-serif" }}>
        <div className="max-w-md w-full space-y-6 sm:space-y-8 text-center px-3 sm:px-4">
          <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16">
            <Icon icon="mdi:check-circle" className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Jost', sans-serif" }}>Password Reset Successful!</h2>
          <p className="text-sm sm:text-base text-gray-600 px-2" style={{ fontFamily: "'Jost', sans-serif" }}>
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 active:bg-gray-900 transition-colors font-medium text-sm sm:text-base min-h-[44px] sm:min-h-[48px]"
            style={{ fontFamily: "'Jost', sans-serif", touchAction: 'manipulation' }}
          >
            Go to Login
          </button>
          <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: "'Jost', sans-serif" }}>
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-6 sm:py-12 px-3 sm:px-4" style={{ fontFamily: "'Jost', sans-serif" }}>
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Jost', sans-serif" }}>
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-600" style={{ fontFamily: "'Jost', sans-serif" }}>
            Enter your new password below
          </p>
        </div>
        
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm" style={{ fontFamily: "'Jost', sans-serif" }}>
              {error}
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-0" style={{ fontFamily: "'Jost', sans-serif" }}>
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2.5 sm:py-3 pr-10 border border-gray-300 placeholder-gray-400 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter new password"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center min-h-[44px] sm:min-h-[48px]"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ touchAction: 'manipulation' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon 
                    icon={showPassword ? "mdi:eye-off" : "mdi:eye"} 
                    className="h-5 w-5 text-gray-400 hover:text-gray-600 active:text-gray-800" 
                  />
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Jost', sans-serif" }}>Password Requirements:</p>
                <div className="space-y-1 sm:space-y-1.5">
                  {[
                    { key: 'length', text: 'At least 8 characters' },
                    { key: 'uppercase', text: 'One uppercase letter' },
                    { key: 'lowercase', text: 'One lowercase letter' },
                    { key: 'number', text: 'One number' },
                    { key: 'special', text: 'One special character' },
                  ].map(({ key, text }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Icon 
                        icon={passwordValidation[key as keyof PasswordValidation] ? "mdi:check-circle" : "mdi:circle-outline"}
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${passwordValidation[key as keyof PasswordValidation] ? 'text-green-600' : 'text-gray-400'}`}
                      />
                      <span className={`text-xs sm:text-sm ${
                        passwordValidation[key as keyof PasswordValidation] 
                          ? 'text-green-600' 
                          : 'text-gray-600'
                      }`} style={{ fontFamily: "'Jost', sans-serif" }}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-0" style={{ fontFamily: "'Jost', sans-serif" }}>
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2.5 sm:py-3 pr-10 border border-gray-300 placeholder-gray-400 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Confirm new password"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center min-h-[44px] sm:min-h-[48px]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ touchAction: 'manipulation' }}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <Icon 
                    icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"} 
                    className="h-5 w-5 text-gray-400 hover:text-gray-600 active:text-gray-800" 
                  />
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`mt-1 text-xs sm:text-sm ${doPasswordsMatch ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: "'Jost', sans-serif" }}>
                  <Icon icon={doPasswordsMatch ? "mdi:check-circle" : "mdi:alert-circle"} className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                  {doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
            className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors min-h-[44px] sm:min-h-[48px]"
            style={{ fontFamily: "'Jost', sans-serif", touchAction: 'manipulation' }}
          >
            {isLoading ? (
              <div className="flex items-center" style={{ fontFamily: "'Jost', sans-serif" }}>
                <Icon icon="mdi:loading" className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="text-xs sm:text-base">Resetting Password...</span>
              </div>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-xs sm:text-sm text-gray-600 hover:text-black active:text-gray-800 transition-colors min-h-[44px] sm:min-h-[32px] flex items-center justify-center mx-auto"
              style={{ fontFamily: "'Jost', sans-serif", touchAction: 'manipulation' }}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
