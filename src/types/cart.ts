import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedCapSize?: 'P (52-54cm)' | 'M (55-57cm)' | 'G (58-60cm)';
  unitPrice: number; // Stored price
  addedAt: number;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minOrderValue?: number;
  description: string;
}

export interface ShippingOption {
  id: 'pac' | 'sedex' | 'express';
  name: string;
  price: number;
  days: string;
  description: string;
}

export interface CartSummary {
  itemsCount: number;
  subtotal: number;
  discountValue: number;
  shippingValue: number;
  pixTotal: number;
  installmentValue: number;
  installmentsCount: number;
  total: number;
  integrityHash: string; // Anti-tampering signature
}
