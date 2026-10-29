import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { Product } from '../types/product';
import { CartItem, Coupon, ShippingOption, CartSummary } from '../types/cart';
import { PRODUCTS_CATALOG, STORE_CONFIG, AVAILABLE_COUPONS } from '../data/products';
import { SecureStorage } from '../security/storage';
import { verifyCartIntegrity, generateCartSignature } from '../security/crypto';
import { useToast } from './ToastContext';

interface CartContextData {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, capSize?: 'P (52-54cm)' | 'M (55-57cm)' | 'G (58-60cm)') => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  summary: CartSummary;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  selectedShipping: ShippingOption | null;
  setSelectedShipping: (option: ShippingOption | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isTamperedAlert: boolean;
  resetTamperAlert: () => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const raw = SecureStorage.getItem<CartItem[]>('cart_items', []);
    // Verificação de integridade no carregamento inicial
    const { fixedItems } = verifyCartIntegrity(raw, PRODUCTS_CATALOG);
    return fixedItems;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    return SecureStorage.getItem<Coupon | null>('cart_coupon', null);
  });

  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTamperedAlert, setIsTamperedAlert] = useState(false);
  const [integrityHash, setIntegrityHash] = useState('');

  const { success, warning, error } = useToast();

  // Salva no storage seguro e valida integridade sempre que o carrinho muda
  useEffect(() => {
    const { isTampered, fixedItems } = verifyCartIntegrity(items, PRODUCTS_CATALOG);
    if (isTampered) {
      setIsTamperedAlert(true);
      warning('Preços do carrinho reconciliados com a tabela oficial de produtos.');
      setItems(fixedItems);
      return;
    }

    SecureStorage.setItem('cart_items', items);
    generateCartSignature(items, PRODUCTS_CATALOG).then(setIntegrityHash);
  }, [items, warning]);

  useEffect(() => {
    SecureStorage.setItem('cart_coupon', appliedCoupon);
  }, [appliedCoupon]);

  const addItem = useCallback((product: Product, quantity = 1, capSize: 'P (52-54cm)' | 'M (55-57cm)' | 'G (58-60cm)' = 'M (55-57cm)') => {
    // Busca o produto canônico para assegurar preço verificado
    const canonical = PRODUCTS_CATALOG.find((p) => p.id === product.id) || product;

    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === canonical.id);
      if (existing) {
        success(`Quantidade da peça "${canonical.nome}" atualizada!`);
        return prev.map((i) =>
          i.product.id === canonical.id
            ? { ...i, quantity: i.quantity + quantity, selectedCapSize: capSize }
            : i
        );
      }
      success(`"${canonical.nome}" adicionada à sua sacola.`);
      return [
        ...prev,
        {
          product: canonical,
          quantity,
          selectedCapSize: capSize,
          unitPrice: canonical.preco,
          addedAt: Date.now(),
        },
      ];
    });
    setIsCartOpen(true);
  }, [success]);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item) {
        warning(`"${item.product.nome}" removida da sacola.`);
      }
      return prev.filter((i) => i.product.id !== productId);
    });
  }, [warning]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    setSelectedShipping(null);
    SecureStorage.removeItem('cart_items');
    SecureStorage.removeItem('cart_coupon');
  }, []);

  const applyCoupon = useCallback((codeRaw: string): boolean => {
    const code = codeRaw.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find((c) => c.code === code);

    if (!coupon) {
      error('Cupom inválido ou expirado.');
      return false;
    }

    const currentSubtotal = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
    if (coupon.minOrderValue && currentSubtotal < coupon.minOrderValue) {
      const faltam = coupon.minOrderValue - currentSubtotal;
      error(`Cupom válido apenas para pedidos a partir de R$ ${coupon.minOrderValue.toLocaleString('pt-BR')} (faltam R$ ${faltam.toLocaleString('pt-BR')}).`);
      return false;
    }

    setAppliedCoupon(coupon);
    success(`Cupom ${coupon.code} aplicado com sucesso!`);
    return true;
  }, [items, success, error]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    warning('Cupom de desconto removido.');
  }, [warning]);

  const summary = useMemo<CartSummary>(() => {
    const itemsCount = items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

    const discountValue = appliedCoupon
      ? (subtotal * appliedCoupon.discountPercentage) / 100
      : 0;

    const shippingValue = selectedShipping ? selectedShipping.price : 0;
    const total = Math.max(0, subtotal - discountValue + shippingValue);

    const pixTotal = Math.round(total * (1 - STORE_CONFIG.descontoPix) * 100) / 100;
    const installmentsCount = STORE_CONFIG.parcelasSemJuros;
    const installmentValue = Math.round((total / installmentsCount) * 100) / 100;

    return {
      itemsCount,
      subtotal,
      discountValue,
      shippingValue,
      pixTotal,
      installmentValue,
      installmentsCount,
      total,
      integrityHash,
    };
  }, [items, appliedCoupon, selectedShipping, integrityHash]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        summary,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        selectedShipping,
        setSelectedShipping,
        isCartOpen,
        setIsCartOpen,
        isTamperedAlert,
        resetTamperAlert: () => setIsTamperedAlert(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextData {
  return useContext(CartContext);
}
