import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  isNew: boolean;
}

interface CartContextType {
  cart: Product[];
  favorites: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  toggleFavorite: (product: Product) => void;
  isInCart: (productId: number) => boolean;
  isFavorite: (productId: number) => boolean;
  cartCount: number;
  favoritesCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('tocimi_cart');
    const savedFavorites = localStorage.getItem('tocimi_favorites');

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save to localStorage whenever cart or favorites change
  useEffect(() => {
    localStorage.setItem('tocimi_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tocimi_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      // Check if product is already in cart
      if (prevCart.find(item => item.id === product.id)) {
        return prevCart; // Don't add duplicates
      }
      return [...prevCart, product];
    });
  };

  const removeFromCart = (product: Product) => {
    setCart(prevCart => prevCart.filter(item => item.id !== product.id));
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.find(item => item.id === product.id);
      if (isAlreadyFavorite) {
        return prevFavorites.filter(item => item.id !== product.id);
      } else {
        return [...prevFavorites, product];
      }
    });
  };

  const isInCart = (productId: number) => {
    return cart.some(item => item.id === productId);
  };

  const isFavorite = (productId: number) => {
    return favorites.some(item => item.id === productId);
  };

  const cartCount = cart.length;
  const favoritesCount = favorites.length;

  const value: CartContextType = {
    cart,
    favorites,
    addToCart,
    removeFromCart,
    toggleFavorite,
    isInCart,
    isFavorite,
    cartCount,
    favoritesCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
