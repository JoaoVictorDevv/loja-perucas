/**
 * Sanitizador de entradas e escape de strings para prevenir Cross-Site Scripting (XSS).
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';
  // Remove caracteres de controle invisíveis e espaços duplicados
  return input
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .trim();
}

export function sanitizeNumbersOnly(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/\D/g, '');
}
