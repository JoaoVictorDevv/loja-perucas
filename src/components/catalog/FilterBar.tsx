import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FilterState, TextureType } from '../../types/product';

interface FilterBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  totalCount,
}) => {
  const textures: { label: string; value: 'todas' | TextureType }[] = [
    { label: 'Todas as Peças', value: 'todas' },
    { label: 'Lisas Virgens', value: 'lisa' },
    { label: 'Onduladas', value: 'ondulada' },
    { label: 'Cacheadas & Afro', value: 'cacheada' },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-luxury-border/60 shadow-sm space-y-4">
      {/* Top Row: Texture Tabs & Results Counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div className="flex flex-wrap items-center gap-2">
          {textures.map((t) => {
            const isActive = filters.textura === t.value;
            return (
              <button
                key={t.value}
                onClick={() => onChange({ ...filters, textura: t.value })}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-luxury-cream shadow-sm scale-100'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200/60'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-neutral-500 font-medium">
          <span>
            {totalCount === 1 ? '1 peça única disponível' : `${totalCount} peças únicas disponíveis`}
          </span>
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-neutral-600 hover:text-brand-800 transition-colors p-1"
            title="Limpar todos os filtros"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Detailed Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Comprimento */}
        <div>
          <label className="block text-neutral-500 font-medium mb-1">Comprimento</label>
          <select
            value={filters.comprimento}
            onChange={(e) =>
              onChange({ ...filters, comprimento: e.target.value as FilterState['comprimento'] })
            }
            className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:border-brand-500"
          >
            <option value="todos">Todos os tamanhos</option>
            <option value="curto">Curtos (até 45 cm)</option>
            <option value="medio">Médios (46 a 60 cm)</option>
            <option value="longo">Longos (acima de 60 cm)</option>
          </select>
        </div>

        {/* Faixa de Preço */}
        <div>
          <label className="block text-neutral-500 font-medium mb-1">Investimento</label>
          <select
            value={filters.preco}
            onChange={(e) =>
              onChange({ ...filters, preco: e.target.value as FilterState['preco'] })
            }
            className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:border-brand-500"
          >
            <option value="todos">Qualquer valor</option>
            <option value="ate3500">Até R$ 3.500</option>
            <option value="3500a4500">R$ 3.500 a R$ 4.500</option>
            <option value="acima4500">Acima de R$ 4.500</option>
          </select>
        </div>

        {/* Tipo de Touca */}
        <div>
          <label className="block text-neutral-500 font-medium mb-1">Modelo de Touca</label>
          <select
            value={filters.touca}
            onChange={(e) =>
              onChange({ ...filters, touca: e.target.value as FilterState['touca'] })
            }
            className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:border-brand-500"
          >
            <option value="todas">Todos os modelos</option>
            <option value="Lace frontal 13x4">Lace Frontal 13x4</option>
            <option value="Lace frontal 13x6">Lace Frontal 13x6</option>
            <option value="Full lace">Full Lace 360°</option>
          </select>
        </div>

        {/* Ordenação */}
        <div>
          <label className="block text-neutral-500 font-medium mb-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-brand-600" />
            <span>Ordenar Por</span>
          </label>
          <select
            value={filters.ordem}
            onChange={(e) =>
              onChange({ ...filters, ordem: e.target.value as FilterState['ordem'] })
            }
            className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:border-brand-500 font-semibold"
          >
            <option value="destaques">Curadoria do Atelier</option>
            <option value="menor">Menor Investimento</option>
            <option value="maior">Maior Investimento</option>
            <option value="comprimento">Mais Longos Primeiro</option>
            <option value="avaliacao">Mais Bem Avaliadas</option>
          </select>
        </div>
      </div>
    </div>
  );
};
