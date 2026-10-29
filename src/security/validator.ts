import { CardBrand } from '../types/security';
import { sanitizeNumbersOnly } from './sanitizer';

/**
 * Validação rigorosa de CPF pelo algoritmo dos dígitos verificadores
 */
export function validateCPF(cpfRaw: string): boolean {
  const cpf = sanitizeNumbersOnly(cpfRaw);
  if (cpf.length !== 11) return false;

  // Rejeita padrões conhecidos com todos os dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i), 10) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  const digito1 = resto >= 10 ? 0 : resto;
  if (digito1 !== parseInt(cpf.charAt(9), 10)) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i), 10) * (11 - i);
  }
  resto = 11 - (soma % 11);
  const digito2 = resto >= 10 ? 0 : resto;

  return digito2 === parseInt(cpf.charAt(10), 10);
}

/**
 * Algoritmo de Luhn (MOD 10) para validação do número do cartão de crédito
 */
export function validateCardNumberLuhn(cardNumberRaw: string): boolean {
  const num = sanitizeNumbersOnly(cardNumberRaw);
  if (num.length < 13 || num.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

/**
 * Detecção de Bandeira do Cartão de Crédito por RegEx
 */
export function detectCardBrand(cardNumberRaw: string): CardBrand {
  const clean = sanitizeNumbersOnly(cardNumberRaw);
  if (/^4[0-9]{6,}$/.test(clean)) return 'visa';
  if (/^(5[1-5][0-9]{4}|2(22[1-9][0-9]{2}|2[3-9][0-9]{3}|[3-6][0-9]{4}|7[0-1][0-9]{3}|720[0-9]{2}))/.test(clean)) return 'mastercard';
  if (/^(4011|438935|451416|4576|504175|5067|5090|627780|636297|636368)/.test(clean)) return 'elo';
  if (/^3[47][0-9]{5,}$/.test(clean)) return 'amex';
  if (/^(606282|3841)/.test(clean)) return 'hipercard';
  return 'unknown';
}

/**
 * Validação de data de expiração MM/AA
 */
export function validateCardExpiration(exp: string): boolean {
  const match = exp.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt('20' + match[2], 10);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  if (year > currentYear + 20) return false;

  return true;
}

/**
 * Validação de CVV
 */
export function validateCardCVV(cvv: string, brand: CardBrand = 'unknown'): boolean {
  const clean = sanitizeNumbersOnly(cvv);
  if (brand === 'amex') {
    return clean.length === 4;
  }
  return clean.length === 3;
}

/**
 * Validação de e-mail RFC 5322 simplificada
 */
export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim());
}

/**
 * Validação de CEP
 */
export function validateCEP(cepRaw: string): boolean {
  const clean = sanitizeNumbersOnly(cepRaw);
  return clean.length === 8;
}

/**
 * Validação de Telefone / Celular Brasileiro (10 ou 11 dígitos)
 */
export function validatePhone(phoneRaw: string): boolean {
  const clean = sanitizeNumbersOnly(phoneRaw);
  return clean.length === 10 || clean.length === 11;
}
