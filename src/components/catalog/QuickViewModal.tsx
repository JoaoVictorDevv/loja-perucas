import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Check, Sparkles, Star } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Product } from '../../types/product';
import { STORE_CONFIG, getUnsplashUrl } from '../../data/products';
import { useCart } from '../../context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetails: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onViewFullDetails,
}) => {
  const [selectedSize, setSelectedSize] = useState<'P (52-54cm)' | 'M (55-57cm)' | 'G (58-60cm)'>('M (55-57cm)');
  const [activePhoto, setActivePhoto] = useState(0);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const precoPix = Math.round(product.preco * (1 - STORE_CONFIG.descontoPix));
  const parcela = Math.round((product.preco / STORE_CONFIG.parcelasSemJuros) * 100) / 100;

  const handleAddToCart = () => {
    addItem(product, 1, selectedSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal isOpen={!!product} onClose={onClose} maxWidth="2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Gallery Preview */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
            <img
              src={getUnsplashUrl(product.fotos[activePhoto] || product.fotos[0], 800)}
              alt={product.nome}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-neutral-900/85 text-luxury-cream backdrop-blur-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbs */}
          <div className="flex gap-2">
            {product.fotos.map((f, i) => (
              <button
                key={f}
                onClick={() => setActivePhoto(i)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  activePhoto === i ? 'border-brand-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={getUnsplashUrl(f, 150)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Brief & Add to Bag */}
        <div className="flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-neutral-400">({product.reviewsCount} avaliações verificadas)</span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-neutral-900 leading-tight">
              {product.nome}
            </h2>

            <p className="text-xs text-neutral-500 mt-1">
              {product.cor} &bull; {product.comprimento} &bull; {product.touca}
            </p>

            {/* Price section */}
            <div className="mt-4 p-4 rounded-xl bg-luxury-surface border border-luxury-border/60">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-2xl font-bold text-neutral-900">
                  R$ {product.preco.toLocaleString('pt-BR')}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  5% OFF no Pix
                </span>
              </div>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                R$ {precoPix.toLocaleString('pt-BR')} à vista no Pix
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                ou até {STORE_CONFIG.parcelasSemJuros}x de R$ {parcela.toLocaleString('pt-BR')} sem juros no cartão
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-600 mt-4 leading-relaxed line-clamp-3">
              {product.descricao}
            </p>

            {/* Cap Size Selector */}
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                Circunferência da Cabeça:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['P (52-54cm)', 'M (55-57cm)', 'G (58-60cm)'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-semibold border transition-all ${
                      selectedSize === size
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-neutral-100">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Adicionada à Sacola!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adicionar à Sacola</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onClose();
                onViewFullDetails(product);
              }}
              className="w-full py-2.5 px-4 rounded-xl text-neutral-700 hover:text-neutral-900 text-xs font-semibold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Ver ficha técnica completa e fotos ampliadas</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
