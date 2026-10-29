import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ShieldCheck, Tag, ArrowRight, Truck, Sparkles, AlertTriangle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { STORE_CONFIG, getUnsplashUrl } from '../../data/products';
import { lookupCep } from '../../services/cepService';

interface CartDrawerProps {
  onOpenCheckout: () => void;
  onNavigateToCollection: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onOpenCheckout,
  onNavigateToCollection,
}) => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    summary,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    selectedShipping,
    setSelectedShipping,
    isCartOpen,
    setIsCartOpen,
    isTamperedAlert,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [cepInput, setCepInput] = useState('');
  const [isCalculatingCep, setIsCalculatingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const ok = applyCoupon(couponCode);
    if (ok) setCouponCode('');
  };

  const handleCalculateCep = async (e: React.FormEvent) => {
    e.preventDefault();
    setCepError('');
    setIsCalculatingCep(true);

    const result = await lookupCep(cepInput, summary.subtotal);
    setIsCalculatingCep(false);

    if (!result.success && result.error) {
      setCepError(result.error);
    } else {
      setShippingOptions(result.shippingOptions);
      if (result.shippingOptions.length > 0) {
        setSelectedShipping(result.shippingOptions[0]);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-luxury-cream border-l border-luxury-border/60 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-luxury-border/40 flex items-center justify-between bg-white/70 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                Sua Sacola Atelier
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-900 font-semibold">
                {summary.itemsCount} {summary.itemsCount === 1 ? 'peça' : 'peças'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Fechar sacola"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tamper Alert */}
          {isTamperedAlert && (
            <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Valores reconciliados com a tabela oficial de preços do Atelier.</span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    Sua sacola está vazia
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                    Conheça nossa seleção exclusiva de perucas 100% cabelo humano virgem e laces imperceptíveis.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToCollection();
                  }}
                  className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-sm"
                >
                  <span>Explorar Coleção</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3.5 bg-white rounded-xl border border-luxury-border/60 shadow-sm relative group"
                >
                  <img
                    src={getUnsplashUrl(item.product.fotos[0], 250)}
                    alt={item.product.nome}
                    className="w-20 h-24 object-cover rounded-lg shrink-0 border border-neutral-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-bold text-neutral-900 line-clamp-1">
                          {item.product.nome}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remover peça"
                          aria-label={`Remover ${item.product.nome}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.product.comprimento} &bull; {item.product.touca}
                      </p>
                      {item.selectedCapSize && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-50 text-brand-800 border border-brand-200/50">
                          Touca: {item.selectedCapSize}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 text-xs font-medium">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-200"
                          aria-label="Diminuir quantidade"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 text-neutral-900 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-200"
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-serif text-sm font-bold text-neutral-900">
                        R$ {(item.unitPrice * item.quantity).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {items.length > 0 && (
              <>
                {/* Coupon Box */}
                <div className="pt-2">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-bold text-emerald-900">Cupom {appliedCoupon.code}</span>
                          <span className="text-emerald-700 block text-[11px]">
                            {appliedCoupon.discountPercentage}% de desconto aplicado (-R$ {summary.discountValue.toLocaleString('pt-BR')})
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-emerald-800 hover:text-emerald-950 font-semibold text-xs underline"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Cupom de desconto (ex: AURORA10)"
                        className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500 uppercase font-medium"
                      />
                      <button
                        type="submit"
                        className="py-2.5 px-4 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
                      >
                        Aplicar
                      </button>
                    </form>
                  )}
                </div>

                {/* Quick Shipping Estimator */}
                <div className="p-3.5 bg-white rounded-xl border border-luxury-border/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-brand-600" />
                      <span>Calcular Frete & Prazo</span>
                    </span>
                    {summary.subtotal >= 3000 && (
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Frete Grátis Disponível
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleCalculateCep} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={9}
                      value={cepInput}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/g, '').slice(0, 8);
                        setCepInput(clean.length > 5 ? `${clean.slice(0, 5)}-${clean.slice(5)}` : clean);
                      }}
                      placeholder="00000-000"
                      className="flex-1 text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="submit"
                      disabled={isCalculatingCep}
                      className="py-2 px-3 bg-neutral-800 text-white text-xs font-semibold rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
                    >
                      {isCalculatingCep ? 'Calculando...' : 'Calcular'}
                    </button>
                  </form>

                  {cepError && (
                    <p className="text-[11px] text-rose-600 font-medium">{cepError}</p>
                  )}

                  {shippingOptions.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {shippingOptions.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            selectedShipping?.id === opt.id
                              ? 'border-brand-500 bg-brand-50/50'
                              : 'border-neutral-200 hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="drawer_shipping"
                              checked={selectedShipping?.id === opt.id}
                              onChange={() => setSelectedShipping(opt)}
                              className="text-brand-600 focus:ring-brand-500"
                            />
                            <div>
                              <span className="font-semibold text-neutral-800 block">{opt.name}</span>
                              <span className="text-[11px] text-neutral-500">{opt.days}</span>
                            </div>
                          </div>
                          <span className="font-bold text-neutral-900">
                            {opt.price === 0 ? 'Grátis' : `R$ ${opt.price.toFixed(2).replace('.', ',')}`}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-6 border-t border-luxury-border/60 bg-white space-y-4">
              {/* Financial Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span>R$ {summary.subtotal.toLocaleString('pt-BR')}</span>
                </div>

                {summary.discountValue > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Desconto ({appliedCoupon?.code}):</span>
                    <span>- R$ {summary.discountValue.toLocaleString('pt-BR')}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Frete estimado:</span>
                  <span>
                    {selectedShipping
                      ? selectedShipping.price === 0
                        ? 'Grátis'
                        : `R$ ${selectedShipping.price.toFixed(2).replace('.', ',')}`
                      : 'A calcular'}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-neutral-100 text-sm">
                  <span className="font-bold text-neutral-900">Total:</span>
                  <span className="font-serif text-lg font-bold text-neutral-900">
                    R$ {summary.total.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Pix Highlight */}
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>À vista no Pix:</span>
                  </div>
                  <span className="font-bold text-emerald-800 text-sm">
                    R$ {summary.pixTotal.toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 text-center">
                  ou até {summary.installmentsCount}x de R$ {summary.installmentValue.toLocaleString('pt-BR')} sem juros no cartão
                </p>
              </div>

              {/* Security Pill */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>Transação 100% Criptografada e Segura</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-4 px-6 rounded-xl bg-neutral-900 text-luxury-cream hover:bg-neutral-800 font-semibold text-sm transition-all shadow-luxury hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <span>Finalizar Compra Segura</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
