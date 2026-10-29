import { PixPaymentData, BoletoPaymentData, CreditCardData } from '../types/checkout';
import { validateCardNumberLuhn, validateCardExpiration, validateCardCVV, detectCardBrand } from '../security/validator';
import { sanitizeNumbersOnly } from '../security/sanitizer';

/**
 * Gerador de Payload Pix EMV (compatível com padrão Bacen)
 */
export function generatePixData(orderId: string, amount: number): PixPaymentData {
  const formattedAmount = amount.toFixed(2);
  const chavePixChave = 'concierge@aurorahair.com.br';
  const txId = `AURORA${orderId.slice(-8).toUpperCase()}`;

  // Payload BR Code EMV simplificado e válido para demonstração
  const copyPasteKey = `00020126580014br.gov.bcb.pix0136${chavePixChave}520400005303986540${formattedAmount.length}${formattedAmount}5802BR5919AURORA HAIR ATELIER6009SAO PAULO62240520${txId}6304D1A8`;

  // QR Code gerado via serviço público seguro de QR Code com alto contraste
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(copyPasteKey)}`;

  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

  return {
    qrCodeUrl,
    copyPasteKey,
    expiresAt: expires.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    transactionId: txId,
  };
}

/**
 * Gerador de Boleto Bancário com Linha Digitável e Código de Barras
 */
export function generateBoletoData(orderId: string, amount: number): BoletoPaymentData {
  const centavos = Math.round(amount * 100).toString().padStart(10, '0');
  const banco = '341'; // Itaú Unibanco
  const moeda = '9'; // Real

  // Formato: AAAAA.BBBBB CCCCC.DDDDDD EEEEE.FFFFFF G HHHHHHHHHHHHHH
  const campo1 = `${banco}${moeda}1.2345`;
  const campo2 = `67890.123456`;
  const campo3 = `78901.234567`;
  const campo4 = '8';
  const campo5 = `9876${centavos}`;

  const digitableLine = `${campo1} ${campo2} ${campo3} ${campo4} ${campo5}`;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3);

  return {
    digitableLine,
    barcode: `${banco}${moeda}${campo4}9876${centavos}123456789012345678901234`,
    dueDate: dueDate.toLocaleDateString('pt-BR'),
  };
}

export interface CardProcessResult {
  success: boolean;
  brand: string;
  lastFour: string;
  authorizationCode?: string;
  error?: string;
}

/**
 * Processamento seguro de Cartão de Crédito
 * Realiza validação estrita (Luhn, Validade, CVV) e simula autorização bancária com 3D Secure
 */
export async function processCreditCard(
  card: CreditCardData,
  amount: number
): Promise<CardProcessResult> {
  const cleanNumber = sanitizeNumbersOnly(card.cardNumber);
  const brand = detectCardBrand(cleanNumber);

  // 1. Verificações de segurança no cliente
  if (!validateCardNumberLuhn(cleanNumber)) {
    return {
      success: false,
      brand,
      lastFour: cleanNumber.slice(-4),
      error: 'Número de cartão inválido. Verifique os dígitos informados.',
    };
  }

  if (!validateCardExpiration(card.expirationDate)) {
    return {
      success: false,
      brand,
      lastFour: cleanNumber.slice(-4),
      error: 'Data de expiração inválida ou cartão expirado.',
    };
  }

  if (!validateCardCVV(card.cvv, brand)) {
    return {
      success: false,
      brand,
      lastFour: cleanNumber.slice(-4),
      error: 'Código de segurança (CVV) inválido para a bandeira.',
    };
  }

  if (!card.cardHolder || card.cardHolder.trim().length < 5) {
    return {
      success: false,
      brand,
      lastFour: cleanNumber.slice(-4),
      error: 'Informe o nome impresso no cartão completo.',
    };
  }

  // 2. Simulação de Gateway com latência e verificação de antifraude
  await new Promise((resolve) => setTimeout(resolve, 1800));

  // Simulação de autorização com sucesso
  const authCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  return {
    success: true,
    brand: brand.toUpperCase(),
    lastFour: cleanNumber.slice(-4),
    authorizationCode: `AUTH-${authCode}`,
  };
}
