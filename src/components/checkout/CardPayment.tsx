import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { CreditCardData } from '../../types/checkout';
import { CardBrand } from '../../types/security';
import { detectCardBrand, validateCardNumberLuhn, validateCardExpiration, validateCardCVV } from '../../security/validator';
import { processCreditCard } from '../../services/paymentService';
import { STORE_CONFIG } from '../../data/products';

interface CardPaymentProps {
  amount: number;
  onPaymentSuccess: (details: { brand: string; lastFour: string }) => void;
}

export const CardPayment: React.FC<CardPaymentProps> = ({
  amount,
  onPaymentSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [installments, setInstallments] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const brand: CardBrand = detectCardBrand(cardNumber);

  const formatCardNumber = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 16);
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExp = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 4);
    if (clean.length > 2) {
      return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    }
    return clean;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanNum = cardNumber.replace(/\D/g, '');
    if (!validateCardNumberLuhn(cleanNum)) {
      setErrorMsg('Número de cartão de crédito inválido pelo algoritmo de verificação.');
      return;
    }

    if (!cardHolder.trim() || cardHolder.trim().length < 4) {
      setErrorMsg('Informe o nome completo impresso no cartão.');
      return;
    }

    if (!validateCardExpiration(expirationDate)) {
      setErrorMsg('Data de validade inválida ou cartão vencido.');
      return;
    }

    if (!validateCardCVV(cvv, brand)) {
      setErrorMsg(`Código de segurança (CVV) inválido para a bandeira ${brand.toUpperCase()}.`);
      return;
    }

    setIsProcessing(true);
    const result = await processCreditCard(
      {
        cardNumber: cleanNum,
        cardHolder,
        expirationDate,
        cvv,
        installments,
      },
      amount
    );
    setIsProcessing(false);

    if (result.success) {
      onPaymentSuccess({
        brand: result.brand,
        lastFour: result.lastFour,
      });
    } else {
      setErrorMsg(result.error || 'Não foi possível autorizar o cartão.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 3D Visual Credit Card Preview */}
      <div className="perspective-1000 max-w-sm mx-auto h-48 w-full cursor-pointer select-none">
        <div
          className={`relative w-full h-full rounded-2xl transition-transform duration-700 transform-style-3d shadow-xl ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Card Front */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-tr from-neutral-900 via-neutral-800 to-brand-800 p-6 text-white backface-hidden flex flex-col justify-between border border-neutral-700/60 shadow-luxury">
            <div className="flex items-center justify-between">
              <div className="w-10 h-7 rounded bg-amber-400/90 flex items-center justify-center shadow-inner">
                <div className="w-6 h-4 border border-amber-800/40 rounded-sm" />
              </div>
              <span className="font-serif text-sm tracking-widest uppercase font-bold text-luxury-gold">
                {brand !== 'unknown' ? brand.toUpperCase() : 'AURORA VIP'}
              </span>
            </div>

            <div className="font-mono text-lg tracking-widest text-center text-neutral-100">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>

            <div className="flex items-end justify-between text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">Titular</span>
                <span className="font-medium tracking-wide uppercase truncate max-w-[170px] block">
                  {cardHolder || 'NOME COMPLETO'}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">Validade</span>
                <span className="font-mono font-medium">{expirationDate || 'MM/AA'}</span>
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-tr from-neutral-900 to-neutral-800 text-white backface-hidden rotate-y-180 flex flex-col justify-between border border-neutral-700/60 shadow-luxury pt-4 pb-6">
            <div className="w-full h-10 bg-neutral-950" />
            <div className="px-6 flex items-center justify-end">
              <div className="bg-white text-neutral-900 font-mono text-sm px-3 py-1 rounded w-20 text-right font-bold">
                {cvv || '•••'}
              </div>
            </div>
            <div className="px-6 text-[9px] text-neutral-400 flex items-center justify-between">
              <span>Criptografia Bancária 3D Secure</span>
              <Lock className="w-3 h-3 text-neutral-400" />
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-neutral-400 text-center">
        Dica: O cartão vira automaticamente ao preencher o campo CVV.
      </p>

      {/* Card Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-800 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Card Number */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Número do Cartão:
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className="w-full py-3 px-4 bg-white border border-neutral-200 rounded-xl text-sm font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-500 shadow-sm"
            />
            <CreditCard className="w-5 h-5 text-neutral-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Card Holder Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Nome Completo no Cartão:
          </label>
          <input
            type="text"
            required
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
            placeholder="COMO IMPRESSO NO CARTÃO"
            className="w-full py-3 px-4 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-500 shadow-sm uppercase"
          />
        </div>

        {/* Exp Date & CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Validade (MM/AA):
            </label>
            <input
              type="text"
              required
              value={expirationDate}
              onChange={(e) => setExpirationDate(formatExp(e.target.value))}
              placeholder="12/28"
              maxLength={5}
              className="w-full py-3 px-4 bg-white border border-neutral-200 rounded-xl text-sm font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              CVV (Código):
            </label>
            <input
              type="password"
              required
              value={cvv}
              onFocus={() => setIsFlipped(true)}
              onBlur={() => setIsFlipped(false)}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="123"
              maxLength={4}
              className="w-full py-3 px-4 bg-white border border-neutral-200 rounded-xl text-sm font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-500 shadow-sm"
            />
          </div>
        </div>

        {/* Installments Options */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Opções de Parcelamento:
          </label>
          <select
            value={installments}
            onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
            className="w-full py-3 px-4 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 font-semibold focus:outline-none focus:border-brand-500 shadow-sm"
          >
            {Array.from({ length: STORE_CONFIG.parcelasSemJuros }, (_, i) => i + 1).map((n) => {
              const val = Math.round((amount / n) * 100) / 100;
              return (
                <option key={n} value={n}>
                  {n}x de R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros (Total: R$ {amount.toLocaleString('pt-BR')})
                </option>
              );
            })}
          </select>
        </div>

        {/* Security badges & Submit */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dados protegidos por Tokenização PCI-DSS Nível 1</span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-xl bg-neutral-900 text-luxury-cream hover:bg-neutral-800 font-semibold text-sm transition-all shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando autorização segura com 3D Secure...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pagar R$ {amount.toLocaleString('pt-BR')} com Cartão</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
