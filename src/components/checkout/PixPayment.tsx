import React, { useState, useEffect } from 'react';
import { Copy, Check, QrCode, Clock, ShieldCheck, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { PixPaymentData } from '../../types/checkout';
import { useToast } from '../../context/ToastContext';

interface PixPaymentProps {
  pixData: PixPaymentData;
  amount: number;
  onPaymentConfirmed: () => void;
}

export const PixPayment: React.FC<PixPaymentProps> = ({
  pixData,
  amount,
  onPaymentConfirmed,
}) => {
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos em segundos
  const { success } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pixData.copyPasteKey);
    setCopied(true);
    success('Código Pix Copia e Cola copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulatePayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onPaymentConfirmed();
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Value and Countdown Ticker */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="text-xs text-emerald-800 font-semibold block uppercase tracking-wider">
            Total com 5% de desconto Atelier:
          </span>
          <span className="font-serif text-2xl font-bold text-emerald-950">
            R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-sm">
          <Clock className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Expira em: {formattedTime}</span>
        </div>
      </div>

      {/* QR Code Presentation */}
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-luxury-border/60 shadow-sm space-y-4">
        <div className="p-3 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <img
            src={pixData.qrCodeUrl}
            alt="QR Code Pix"
            className="w-52 h-52 object-contain"
          />
        </div>
        <div className="text-center max-w-xs space-y-1">
          <p className="text-xs font-bold text-neutral-800">
            Abra o app do seu banco e escaneie o código
          </p>
          <p className="text-[11px] text-neutral-500">
            A aprovação é instantânea pelo Banco Central do Brasil.
          </p>
        </div>
      </div>

      {/* Pix Copia e Cola */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
          Ou pague com o Pix Copia e Cola:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={pixData.copyPasteKey}
            className="flex-1 text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-neutral-600 truncate focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="py-2.5 px-4 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification / Simulation Button */}
      <div className="pt-2 space-y-2">
        <button
          onClick={handleSimulatePayment}
          disabled={isVerifying}
          className="w-full py-4 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verificando conciliação bancária Pix...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Já fiz o Pix &bull; Confirmar Pagamento</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-neutral-400 text-center">
          * Em ambiente de demonstração, este botão simula o webhook bancário em tempo real.
        </p>
      </div>
    </div>
  );
};
