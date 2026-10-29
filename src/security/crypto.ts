import { CartItem } from '../types/cart';
import { Product } from '../types/product';

/**
 * Gera um hash SHA-256 no browser via SubtleCrypto para assinatura de integridade
 */
export async function sha256(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback para ambientes sem SubtleCrypto
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Cria a assinatura digital do estado do carrinho com base no ID e quantidade,
 * referenciando a tabela mestre de produtos.
 */
export async function generateCartSignature(items: CartItem[], catalog: Product[]): Promise<string> {
  const canonicalString = items
    .map((item) => {
      const realProduct = catalog.find((p) => p.id === item.product.id);
      const canonicalPrice = realProduct ? realProduct.preco : 0;
      return `${item.product.id}:${item.quantity}:${canonicalPrice}`;
    })
    .sort()
    .join('|');

  return await sha256(`AURORA_SECRET_SALT_${canonicalString}`);
}

/**
 * Verifica se os itens no carrinho foram adulterados em preço ou identificação
 */
export function verifyCartIntegrity(items: CartItem[], catalog: Product[]): { isTampered: boolean; fixedItems: CartItem[] } {
  let isTampered = false;

  const fixedItems = items.map((item) => {
    const canonical = catalog.find((p) => p.id === item.product.id);
    if (!canonical) {
      isTampered = true;
      return item;
    }

    if (item.unitPrice !== canonical.preco || item.product.preco !== canonical.preco) {
      isTampered = true;
      return {
        ...item,
        unitPrice: canonical.preco,
        product: { ...canonical }
      };
    }

    return item;
  });

  return { isTampered, fixedItems };
}

/**
 * Gera token único de segurança para recibo de compra
 */
export function generateSecurityToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = 'SEC-';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) token += '-';
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
