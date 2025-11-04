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
        const totalItems = items.length;
        const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCart({
          id: parsed.id || '',
          items,
          totalItems,
          totalPrice,
          createdAt: parsed.createdAt ? new Date(parsed.createdAt as unknown as string) : new Date(),
          updatedAt: new Date(),
          isLoading: false,
        });
      } else {
        // nothing saved; ensure empty, non-loading cart
        setCart(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
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
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      // ignore storage failures
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

    const totalItems = updatedItems.length; // Count of unique products, not sum of quantities
    const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

    const totalItems = updatedItems.length; // Count of unique products, not sum of quantities
    const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
    const totalItems = updatedItems.length; // Count of unique products, not sum of quantities
    const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
