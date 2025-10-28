"use client";

import React from 'react';
import { CartProvider, UserProvider, CartIconProvider, FavoritesProvider, NotificationsProvider } from '../../context';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <UserProvider>
      <NotificationsProvider>
        <CartProvider>
          <CartIconProvider>
            <FavoritesProvider>
              {children}
            </FavoritesProvider>
          </CartIconProvider>
        </CartProvider>
      </NotificationsProvider>
    </UserProvider>
  );
}

