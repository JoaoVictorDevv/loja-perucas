export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface SecurityEvent {
  timestamp: number;
  type: 'PRICE_TAMPER_DETECTED' | 'INVALID_INPUT_DETECTED' | 'STORAGE_TAMPER_DETECTED';
  details: string;
}

export type CardBrand = 'visa' | 'mastercard' | 'elo' | 'amex' | 'hipercard' | 'unknown';
