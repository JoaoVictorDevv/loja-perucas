import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SecureStorage } from '../security/storage';
import { useToast } from './ToastContext';

interface WishlistContextData {
  wishlistIds: string[];
  toggleWishlist: (productId: string, productName?: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalWishlist: number;
}

const WishlistContext = createContext<WishlistContextData>({} as WishlistContextData);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    return SecureStorage.getItem<string[]>('wishlist', []);
  });
  const { success, info } = useToast();

  useEffect(() => {
    SecureStorage.setItem('wishlist', wishlistIds);
  }, [wishlistIds]);

  const toggleWishlist = (productId: string, productName = 'Peça') => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        info(`"${productName}" removida dos seus favoritos.`);
        return prev.filter((id) => id !== productId);
      } else {
        success(`"${productName}" salva nos seus favoritos!`);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        totalWishlist: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist(): WishlistContextData {
  return useContext(WishlistContext);
}
