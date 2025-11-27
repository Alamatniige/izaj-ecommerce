"use client";

import { useState, useEffect, useRef } from 'react';
import { CartItem, Cart } from '../types';

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({
    id: '',
    items: [],
    totalItems: 0,
    totalPrice: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    isLoading: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const hasHydratedRef = useRef(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Cart>;
        const items = Array.isArray(parsed.items) ? parsed.items : [];
        // Calculate totalItems as count of unique items (not sum of quantities)
        const totalItems = items.length;
        const totalPrice = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
        
        // Ensure dates are properly handled
        const createdAt = parsed.createdAt 
          ? (typeof parsed.createdAt === 'string' ? new Date(parsed.createdAt) : new Date(parsed.createdAt as any))
          : new Date();
        
        setCart({
          id: parsed.id || '',
          items,
          totalItems,
          totalPrice,
          createdAt,
          updatedAt: new Date(),
          isLoading: false,
        });
        console.log('✅ Cart loaded from localStorage:', { items: items.length, totalItems, totalPrice });
      } else {
        // nothing saved; ensure empty, non-loading cart
        setCart(prev => ({ ...prev, isLoading: false }));
        console.log('ℹ️ No cart found in localStorage');
      }
    } catch (error) {
      console.error('❌ Error parsing cart from localStorage:', error);
      // Clear corrupted data
      try {
        localStorage.removeItem('cart');
      } catch (e) {
        // ignore
      }
      setCart(prev => ({ ...prev, isLoading: false }));
    } finally {
      hasHydratedRef.current = true;
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes (after initial hydration)
  useEffect(() => {
    if (!hasHydratedRef.current) return;
    try {
      // Create a serializable version of cart (convert Date objects to ISO strings)
      const cartToSave = {
        ...cart,
        createdAt: cart.createdAt instanceof Date ? cart.createdAt.toISOString() : cart.createdAt,
        updatedAt: cart.updatedAt instanceof Date ? cart.updatedAt.toISOString() : cart.updatedAt,
        // Remove isLoading from saved data
        isLoading: undefined,
      };
      delete (cartToSave as any).isLoading;
      localStorage.setItem('cart', JSON.stringify(cartToSave));
      console.log('💾 Cart saved to localStorage:', { items: cart.items.length, totalItems: cart.totalItems, totalPrice: cart.totalPrice });
    } catch (e) {
      console.error('❌ Error saving cart to localStorage:', e);
      // If storage is full, try to clear old data
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        console.warn('⚠️ localStorage quota exceeded, clearing old cart data');
        try {
          localStorage.removeItem('cart');
        } catch (clearError) {
          // ignore
        }
      }
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setIsLoading(true);
    
    const existingItem = cart.items.find(
      cartItem => 
        cartItem.productId === item.productId && 
        cartItem.size === item.size && 
        cartItem.color === item.color
    );

    let updatedItems: CartItem[];
    
    if (existingItem) {
      updatedItems = cart.items.map(cartItem =>
        cartItem.id === existingItem.id
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );
    } else {
      const newItem: CartItem = {
        ...item,
        id: Date.now().toString(),
      };
      updatedItems = [...cart.items, newItem];
    }

    // Calculate totalItems as count of unique items (not sum of quantities)
    const totalItems = updatedItems.length;
    const totalPrice = updatedItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

    setCart({
      ...cart,
      items: updatedItems,
      totalItems,
      totalPrice,
      updatedAt: new Date(),
    });

    setIsLoading(false);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedItems = cart.items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );

    // Calculate totalItems as count of unique items (not sum of quantities)
    const totalItems = updatedItems.length;
    const totalPrice = updatedItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

    setCart({
      ...cart,
      items: updatedItems,
      totalItems,
      totalPrice,
      updatedAt: new Date(),
    });
  };

  const removeFromCart = (itemId: string) => {
    const updatedItems = cart.items.filter(item => item.id !== itemId);
    // Calculate totalItems as count of unique items (not sum of quantities)
    const totalItems = updatedItems.length;
    const totalPrice = updatedItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

    setCart({
      ...cart,
      items: updatedItems,
      totalItems,
      totalPrice,
      updatedAt: new Date(),
    });
  };

  const clearCart = () => {
    setCart({
      id: '',
      items: [],
      totalItems: 0,
      totalPrice: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
};
