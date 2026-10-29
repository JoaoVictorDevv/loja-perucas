import React from 'react';
import { ShieldCheck, Truck, Sparkles, CreditCard } from 'lucide-react';

export const SecurityBanner: React.FC = () => {
  return (
    <div className="bg-neutral-900 text-luxury-cream text-xs py-2 px-4 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-y-1 gap-x-6">
        <div className="flex items-center gap-1.5 text-neutral-300">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
          <span>Checkout Criptografado &bull; <strong>100% Seguro</strong></span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-neutral-300">
          <Truck className="w-3.5 h-3.5 text-brand-400" />
          <span>Envio com <strong>Embalagem 100% Discreta</strong> e Seguro Total</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-300">
          <CreditCard className="w-3.5 h-3.5 text-brand-400" />
          <span>Até <strong>10x Sem Juros</strong> ou <strong>5% OFF no Pix</strong></span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 text-neutral-300">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Cabelo Humano Selecionado com <strong>Garantia de 7 Dias</strong></span>
        </div>
      </div>
    </div>
  );
};
