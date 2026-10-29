import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { PRODUCTS_CATALOG } from '../data/products';
import { Product, FilterState, TextureType } from '../types/product';
import { ProductCard } from '../components/catalog/ProductCard';
import { FilterBar } from '../components/catalog/FilterBar';

interface CollectionPageProps {
  initialTexture?: string;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  initialTexture,
  onSelectProduct,
  onQuickView,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    textura: (initialTexture as TextureType) || 'todas',
    comprimento: 'todos',
    preco: 'todos',
    touca: 'todas',
    densidade: 'todas',
    ordem: 'destaques',
  });

  useEffect(() => {
    if (initialTexture) {
      setFilters((prev) => ({ ...prev, textura: initialTexture as TextureType }));
    }
  }, [initialTexture]);

  const resetFilters = () => {
    setFilters({
      textura: 'todas',
      comprimento: 'todos',
      preco: 'todos',
      touca: 'todas',
      densidade: 'todas',
      ordem: 'destaques',
    });
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS_CATALOG.filter((p) => {
      // Filtro de Textura
      if (filters.textura !== 'todas' && p.textura !== filters.textura) return false;

      // Filtro de Comprimento
      if (filters.comprimento === 'curto' && p.comprimentoCm > 45) return false;
      if (filters.comprimento === 'medio' && (p.comprimentoCm <= 45 || p.comprimentoCm > 60)) return false;
      if (filters.comprimento === 'longo' && p.comprimentoCm <= 60) return false;

      // Filtro de Preço
      if (filters.preco === 'ate3500' && p.preco > 3500) return false;
      if (filters.preco === '3500a4500' && (p.preco <= 3500 || p.preco > 4500)) return false;
      if (filters.preco === 'acima4500' && p.preco <= 4500) return false;

      // Filtro de Touca
      if (filters.touca !== 'todas' && p.touca !== filters.touca) return false;

      return true;
    }).sort((a, b) => {
      if (filters.ordem === 'menor') return a.preco - b.preco;
      if (filters.ordem === 'maior') return b.preco - a.preco;
      if (filters.ordem === 'comprimento') return b.comprimentoCm - a.comprimentoCm;
      if (filters.ordem === 'avaliacao') return b.rating - a.rating;
      return (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0);
    });
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
          Catálogo Exclusivo Atelier
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900">
          Coleção de Alta Perucaria
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
          Peças únicas em cabelo 100% humano selecionado. Todas as fotos são fiéis ao caimento, densidade e acabamento real das peças.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        totalCount={filteredProducts.length}
      />

      {/* Grid of Results */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-300 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-neutral-900">
            Nenhuma peça encontrada com essa combinação de filtros
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Como trabalhamos com peças únicas confeccionadas artesanalmente, experimente ajustar os filtros ou redefinir a busca.
          </p>
          <button
            onClick={resetFilters}
            className="py-3 px-6 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Todos os Filtros</span>
          </button>
        </div>
      )}

    </div>
  );
};
