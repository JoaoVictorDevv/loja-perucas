import { CartItem, ShippingOption } from './cart';

export type PaymentMethodType = 'pix' | 'credit_card' | 'boleto';

export interface CustomerData {
  nomeCompleto: string;
  email: string;
  cpf: string;
  telefone: string;
}

export interface AddressData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface CreditCardData {
  cardNumber: string;
  cardHolder: string;
  expirationDate: string; // MM/AA
  cvv: string;
  installments: number;
}

export interface PixPaymentData {
  qrCodeUrl: string;
  copyPasteKey: string;
  expiresAt: string;
  transactionId: string;
}

export interface BoletoPaymentData {
  digitableLine: string;
  barcode: string;
  dueDate: string;
  pdfUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerData;
  address: AddressData;
  items: CartItem[];
  shipping: ShippingOption;
  paymentMethod: PaymentMethodType;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'processing' | 'paid' | 'shipped';
  cardLastFour?: string;
  cardBrand?: string;
  pixData?: PixPaymentData;
  boletoData?: BoletoPaymentData;
  securityChecksum: string;
}
