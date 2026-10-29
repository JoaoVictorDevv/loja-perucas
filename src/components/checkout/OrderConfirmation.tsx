import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShieldCheck, Printer, MessageCircle, ArrowRight, PackageCheck, Copy } from 'lucide-react';
import { Order } from '../../types/checkout';
import { STORE_CONFIG, getUnsplashUrl } from '../../data/products';
import { useToast } from '../../context/ToastContext';

interface OrderConfirmationProps {
  order: Order;
  onContinueShopping: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onContinueShopping,
}) => {
  const { success } = useToast();

  useEffect(() => {
    // Dispara confetes comemorativos
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C5A880', '#D4AF37', '#141414', '#10B981'],
      });
    } catch {
      // Ignora erro se confetti falhar
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const whatsAppTrackingText = `Olá Atelier Aurora! Gostaria de acompanhar o meu pedido #${order.orderNumber} em nome de ${order.customer.nomeCompleto}.`;
  const whatsAppTrackingUrl = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(whatsAppTrackingText)}`;

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-300">
      
      {/* Header Banner */}
      <div className="text-center space-y-2 py-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs uppercase font-bold tracking-widest text-brand-700 block">
          Pedido Confirmado com Sucesso
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
          Obrigada por escolher o Atelier AURORA
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
          Um e-mail de confirmação foi enviado para <strong>{order.customer.email}</strong> com todas as instruções e código de rastreamento sigiloso.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="p-6 bg-white rounded-2xl border border-luxury-border/60 shadow-sm space-y-6">
        
        {/* Order Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100 text-xs">
          <div>
            <span className="text-neutral-400 block uppercase text-[10px] tracking-wider font-semibold">
              Número do Pedido:
            </span>
            <span className="font-mono text-base font-bold text-neutral-900">
              #{order.orderNumber}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block uppercase text-[10px] tracking-wider font-semibold">
              Data e Hora:
            </span>
            <span className="font-medium text-neutral-700">
              {new Date(order.createdAt).toLocaleDateString('pt-BR')} às{' '}
              {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block uppercase text-[10px] tracking-wider font-semibold">
              Método de Pagamento:
            </span>
            <span className="font-semibold text-neutral-900 capitalize">
              {order.paymentMethod === 'pix' && 'PIX (5% OFF Aplicado)'}
              {order.paymentMethod === 'credit_card' && `Cartão final ${order.cardLastFour || '••••'}`}
              {order.paymentMethod === 'boleto' && 'Boleto Bancário'}
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Peças Selecionadas:
          </h4>
          {order.items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200/60"
            >
              <img
                src={getUnsplashUrl(item.product.fotos[0], 150)}
                alt={item.product.nome}
                className="w-14 h-14 object-cover rounded-lg border border-neutral-200"
              />
              <div className="flex-1 min-w-0 text-xs">
                <span className="font-serif font-bold text-neutral-900 block truncate">
                  {item.product.nome}
                </span>
                <span className="text-neutral-500 block text-[11px]">
                  {item.product.cor} &bull; {item.product.comprimento}
                </span>
                {item.selectedCapSize && (
                  <span className="text-[10px] font-semibold text-brand-800">
                    Touca: {item.selectedCapSize}
                  </span>
                )}
              </div>
              <div className="text-right text-xs">
                <span className="font-bold text-neutral-900 block">
                  R$ {(item.unitPrice * item.quantity).toLocaleString('pt-BR')}
                </span>
                <span className="text-neutral-400 text-[11px]">Qtd: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Address and Shipping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-luxury-surface text-xs border border-luxury-border/40">
          <div>
            <span className="font-bold uppercase tracking-wider text-[10px] text-neutral-500 block mb-1">
              Endereço de Entrega Sigiloso:
            </span>
            <p className="font-semibold text-neutral-900">{order.customer.nomeCompleto}</p>
            <p className="text-neutral-600">
              {order.address.logradouro}, {order.address.numero}
              {order.address.complemento ? ` - ${order.address.complemento}` : ''}
            </p>
            <p className="text-neutral-600">
              {order.address.bairro} &bull; {order.address.cidade}/{order.address.uf}
            </p>
            <p className="text-neutral-500 font-mono mt-0.5">CEP: {order.address.cep}</p>
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-[10px] text-neutral-500 block mb-1">
              Modalidade de Frete:
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
              <PackageCheck className="w-4 h-4 text-brand-600" />
              <span>{order.shipping.name}</span>
            </div>
            <p className="text-neutral-500 mt-1">{order.shipping.days}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              {order.shippingCost === 0 ? 'Frete Grátis Cortesia Atelier' : `Valor: R$ ${order.shippingCost.toFixed(2).replace('.', ',')}`}
            </p>
          </div>
        </div>

        {/* Security Checksum Protocol (SDD) */}
        <div className="p-3 bg-neutral-900 text-neutral-300 rounded-xl flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Protocolo SDD: {order.securityChecksum}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider hidden sm:inline">
            Autenticado
          </span>
        </div>

        {/* Totals Breakdown */}
        <div className="space-y-1.5 text-xs pt-2 border-t border-neutral-100">
          <div className="flex justify-between text-neutral-500">
            <span>Subtotal das Peças:</span>
            <span>R$ {order.subtotal.toLocaleString('pt-BR')}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Desconto Aplicado:</span>
              <span>- R$ {order.discount.toLocaleString('pt-BR')}</span>
            </div>
          )}
          <div className="flex justify-between text-neutral-500">
            <span>Frete:</span>
            <span>{order.shippingCost === 0 ? 'Grátis' : `R$ ${order.shippingCost.toFixed(2).replace('.', ',')}`}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-neutral-200">
            <span>Total Pago:</span>
            <span className="font-serif text-lg">R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={whatsAppTrackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Acompanhar com Concierge no WhatsApp</span>
        </a>

        <button
          onClick={handlePrint}
          className="py-3.5 px-4 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Recibo</span>
        </button>

        <button
          onClick={onContinueShopping}
          className="flex-1 py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Continuar no Atelier</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
