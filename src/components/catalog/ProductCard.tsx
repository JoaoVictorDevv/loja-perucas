import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { Product } from '../../types/product';
import { STORE_CONFIG, getUnsplashUrl } from '../../data/products';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isFav = isInWishlist(product.id);
  const precoPix = Math.round(product.preco * (1 - STORE_CONFIG.descontoPix));
  const parcela = Math.round((product.preco / STORE_CONFIG.parcelasSemJuros) * 100) / 100;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1, 'M (55-57cm)');
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id, product.nome);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-luxury-border/60 shadow-sm hover:shadow-luxury-hover hover:border-brand-300/80 transition-all duration-300 flex flex-col relative"
    >
      {/* Media Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        {/* Main Photo */}
        <img
          src={getUnsplashUrl(product.fotos[0], 750)}
          alt={product.nome}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isHovered && product.fotos[1] ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Alternate Angle on Hover */}
        {product.fotos[1] && (
          <img
            src={getUnsplashUrl(product.fotos[1], 750)}
            alt={`${product.nome} outro ângulo`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-neutral-900/80 text-luxury-cream backdrop-blur-md">
            Peça Única
          </span>
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-brand-500/90 text-white backdrop-blur-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-neutral-700 hover:text-rose-600 shadow-sm backdrop-blur-md transition-all hover:scale-110"
          aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-rose-600 text-rose-600' : 'text-neutral-700'
            }`}
          />
        </button>

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 py-2.5 px-3 bg-white/95 hover:bg-white text-neutral-900 text-xs font-semibold rounded-xl shadow-md backdrop-blur-md flex items-center justify-center gap-1.5 hover:text-brand-700 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Espiar</span>
          </button>
          <button
            onClick={handleQuickAdd}
            className="py-2.5 px-3.5 bg-neutral-900/95 hover:bg-neutral-900 text-white text-xs font-semibold rounded-xl shadow-md backdrop-blur-md flex items-center justify-center gap-1.5 transition-all hover:scale-105"
            title="Adicionar direto à sacola"
          >
            {justAdded ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Specs Subtitle */}
          <div className="flex items-center gap-1 text-[11px] text-neutral-500 uppercase tracking-wider font-medium mb-1 truncate">
            <span>{product.textura}</span>
            <span>&bull;</span>
            <span>{product.comprimento}</span>
            <span>&bull;</span>
            <span>{product.densidade}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 group-hover:text-brand-700 transition-colors line-clamp-1">
            {product.nome}
          </h3>

          <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
            {product.cor} &bull; {product.touca}
          </p>
        </div>

        {/* Price Box */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-col gap-0.5">
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-lg sm:text-xl font-bold text-neutral-900">
              R$ {product.preco.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Pix R$ {precoPix.toLocaleString('pt-BR')}
            </span>
          </div>
          <span className="text-[11px] text-neutral-500">
            ou {STORE_CONFIG.parcelasSemJuros}x de R$ {parcela.toLocaleString('pt-BR')} sem juros
          </span>
        </div>
      </div>
    </div>
  );
};
