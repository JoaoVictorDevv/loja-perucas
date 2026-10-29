import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS_CATALOG, STORE_CONFIG, getUnsplashUrl } from '../../data/products';
import { Product } from '../../types/product';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];

    return PRODUCTS_CATALOG.filter((p) => {
      return (
        p.nome.toLowerCase().includes(term) ||
        p.textura.toLowerCase().includes(term) ||
        p.cor.toLowerCase().includes(term) ||
        p.touca.toLowerCase().includes(term) ||
        p.descricao.toLowerCase().includes(term)
      );
    });
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative w-full max-w-2xl bg-luxury-cream rounded-2xl shadow-luxury border border-luxury-border/80 overflow-hidden z-10 transition-all">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-luxury-border/60 bg-white">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, textura (lisa, cacheada), cor, lace 13x4..."
            className="w-full text-base sm:text-lg bg-transparent text-neutral-900 placeholder-neutral-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full"
              aria-label="Limpar termo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 px-2 py-1 rounded transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Tag Pills */}
        <div className="px-5 py-3 bg-luxury-surface border-b border-luxury-border/40 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Sugestões:
          </span>
          {['Lisa', 'Ondulada', 'Cacheada', 'Full lace', 'Loiro', '70 cm'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag.toLowerCase())}
              className="px-2.5 py-1 rounded-full bg-white border border-luxury-border/60 text-neutral-700 hover:border-brand-500 hover:text-brand-800 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {searchTerm && results.length === 0 && (
            <div className="text-center py-12 text-neutral-500">
              <p className="text-sm font-medium">Nenhuma peruca encontrada para &ldquo;{searchTerm}&rdquo;</p>
              <p className="text-xs mt-1 text-neutral-400">
                Tente buscar por termos mais genéricos como &ldquo;lisa&rdquo;, &ldquo;ondulada&rdquo; ou &ldquo;castanho&rdquo;.
              </p>
            </div>
          )}

          {!searchTerm && (
            <div className="text-center py-8 text-neutral-400 text-xs">
              Digite ao menos 2 letras para pesquisar em todo o catálogo do Atelier.
            </div>
          )}

          {results.map((product) => {
            const precoPix = Math.round(product.preco * (1 - STORE_CONFIG.descontoPix));
            return (
              <button
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="w-full text-left flex items-center gap-4 p-3 rounded-xl hover:bg-white border border-transparent hover:border-luxury-border/60 transition-all group"
              >
                <img
                  src={getUnsplashUrl(product.fotos[0], 200)}
                  alt={product.nome}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg shrink-0 border border-neutral-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm sm:text-base font-bold text-neutral-900 truncate group-hover:text-brand-700 transition-colors">
                      {product.nome}
                    </span>
                    {product.badge && (
                      <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-brand-100 text-brand-900 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 truncate">
                    {product.cor} &bull; {product.comprimento} &bull; {product.touca}
                  </p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-sm font-semibold text-neutral-900">
                      R$ {product.preco.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-xs text-emerald-700 font-medium">
                      R$ {precoPix.toLocaleString('pt-BR')} no Pix
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
