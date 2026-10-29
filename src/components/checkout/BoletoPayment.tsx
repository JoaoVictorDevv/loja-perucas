import React, { useState } from 'react';
import { Copy, Check, Barcode, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { BoletoPaymentData } from '../../types/checkout';
import { useToast } from '../../context/ToastContext';

interface BoletoPaymentProps {
  boletoData: BoletoPaymentData;
  amount: number;
  onBoletoConfirmed: () => void;
}

export const BoletoPayment: React.FC<BoletoPaymentProps> = ({
  boletoData,
  amount,
  onBoletoConfirmed,
}) => {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(boletoData.digitableLine);
    setCopied(true);
    success('Linha digitável do boleto copiada com sucesso!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Info */}
      <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="text-xs text-neutral-500 uppercase tracking-wider block font-medium">
            Valor do Boleto:
          </span>
          <span className="font-serif text-2xl font-bold text-neutral-900">
            R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 shadow-sm">
          <Calendar className="w-4 h-4 text-brand-600" />
          <span>Vencimento: {boletoData.dueDate}</span>
        </div>
      </div>

      {/* Digitable Line */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
          Linha Digitável para Pagamento:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={boletoData.digitableLine}
            className="flex-1 text-xs px-3.5 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-neutral-800 truncate focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="py-3 px-4 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Linha</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Barcode Illustration */}
      <div className="p-6 bg-white rounded-2xl border border-neutral-200 flex flex-col items-center justify-center space-y-3 shadow-sm">
        <div className="w-full max-w-sm h-16 flex items-center justify-between px-4 bg-neutral-50 rounded-lg border border-neutral-200/80 overflow-hidden">
          {/* Simulated Barcode vertical bars */}
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className={`h-12 bg-neutral-900 ${
                i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-1.5' : 'w-0.5'
              }`}
            />
          ))}
        </div>
        <span className="font-mono text-[11px] text-neutral-400">
          34191.23456 78901.234567 89012.345678 9 98760000000000
        </span>
      </div>

      {/* Instructions */}
      <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-200/60 text-xs text-neutral-600 space-y-1 leading-relaxed">
        <p className="font-semibold text-neutral-800">Orientações de Compensação:</p>
        <p>&bull; O boleto pode ser pago em qualquer agência bancária ou internet banking até o vencimento.</p>
        <p>&bull; A compensação bancária ocorre em até 48 horas úteis após o pagamento.</p>
        <p>&bull; Sua peça única fica reservada durante o prazo de vencimento do boleto.</p>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onBoletoConfirmed}
        className="w-full py-4 px-6 rounded-xl bg-neutral-900 text-luxury-cream hover:bg-neutral-800 font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Concluir e Emitir Pedido com Boleto</span>
      </button>
    </div>
  );
};
