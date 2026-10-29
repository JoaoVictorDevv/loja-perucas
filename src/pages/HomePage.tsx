import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Award, MessageCircle, Heart, Star, Check, ChevronRight } from 'lucide-react';
import { PRODUCTS_CATALOG, STORE_CONFIG, getUnsplashUrl } from '../data/products';
import { Product, TextureType } from '../types/product';
import { ProductCard } from '../components/catalog/ProductCard';

interface HomePageProps {
  onNavigateToCollection: (texture?: TextureType) => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOpenCapGuide: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToCollection,
  onSelectProduct,
  onQuickView,
  onOpenCapGuide,
}) => {
  const [activeFilter, setActiveFilter] = useState<'todas' | TextureType>('todas');

  const featuredProducts = PRODUCTS_CATALOG.filter((p) => {
    if (activeFilter === 'todas') return true;
    return p.textura === activeFilter;
  }).slice(0, 6);

  const whatsAppHeroUrl = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(
    'Olá Atelier Aurora! Gostaria de uma consultoria especializada para encontrar a peruca ideal para mim.'
  )}`;

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-100/60 via-luxury-cream to-luxury-cream pt-12 pb-20 md:py-24 border-b border-luxury-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-white/90 border border-brand-200 shadow-sm text-xs font-semibold text-brand-800">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Haute Perruquerie &bull; Cabelo 100% Humano Selecionado</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight leading-[1.12]">
                Sua liberdade, sua beleza,{' '}
                <span className="italic font-normal text-brand-700">sua essência revelada.</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Perucas e laces confeccionadas à mão com fios humanos nobres. Naturalidade cirúrgica, caimento com peso real e uma linha frontal imperceptível a qualquer distância.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => onNavigateToCollection()}
                  className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-luxury-cream font-semibold text-sm transition-all shadow-luxury hover:scale-[1.02] flex items-center justify-center gap-2.5"
                >
                  <span>Explorar Coleção de Peças</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={whatsAppHeroUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-sm border border-neutral-300 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Consultoria Visagista Privativa</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-neutral-200/80 text-xs text-neutral-600">
                <div>
                  <strong className="block text-neutral-900 font-bold text-sm">100% Virgem</strong>
                  <span>Cabelo humano real</span>
                </div>
                <div>
                  <strong className="block text-neutral-900 font-bold text-sm">HD Lace</strong>
                  <span>Funde-se à sua pele</span>
                </div>
                <div>
                  <strong className="block text-neutral-900 font-bold text-sm">10x Sem Juros</strong>
                  <span>Ou 5% OFF no Pix</span>
                </div>
                <div>
                  <strong className="block text-neutral-900 font-bold text-sm">Garantia 7 Dias</strong>
                  <span>Troca incondicional</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-100">
                <img
                  src={getUnsplashUrl('1668505543198-4fb0b42808bc', 900)}
                  alt="Peruca de cabelo humano Aurora"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-300">
                    Acabamento Cirúrgico
                  </span>
                  <p className="font-serif text-xl font-bold mt-0.5">
                    Lace Frontal 13x4 com Baby Hairs Naturais
                  </p>
                  <p className="text-xs text-neutral-300 mt-1">
                    Toque de seda, leveza respirável e movimento que acompanha o vento.
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 sm:-left-8 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-luxury-border/60 shadow-luxury hidden sm:flex items-center gap-3 max-w-xs">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-neutral-900 block">4.9 / 5.0 no Pós-Venda</span>
                  <span className="text-neutral-500">Mais de 450 peças entregues em todo o Brasil.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TEXTURE CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
            Três Texturas Nobres
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
            Encontre a curvatura perfeita para o seu estilo
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Cada textura foi selecionada para garantir memória de forma, facilidade no cuidado diário e versatilidade de penteados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lisas */}
          <div
            onClick={() => onNavigateToCollection('lisa')}
            className="group cursor-pointer relative rounded-3xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-luxury-hover border border-luxury-border/60 transition-all duration-300"
          >
            <img
              src={getUnsplashUrl('1663582816158-42354522fe15', 700)}
              alt="Perucas Lisas"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs uppercase font-semibold text-brand-300 tracking-wider">
                Caimento Sedoso
              </span>
              <h3 className="font-serif text-2xl font-bold mt-1">Lisas Virgens</h3>
              <p className="text-xs text-neutral-300 mt-1 font-light">
                Brilho espelhado, pontas encorpadas e fios alinhados. Prontas para prancha ou babyliss.
              </p>
              <div className="flex items-center gap-1 text-xs font-semibold text-luxury-gold mt-3 group-hover:translate-x-1 transition-transform">
                <span>Ver peças lisas</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Onduladas */}
          <div
            onClick={() => onNavigateToCollection('ondulada')}
            className="group cursor-pointer relative rounded-3xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-luxury-hover border border-luxury-border/60 transition-all duration-300"
          >
            <img
              src={getUnsplashUrl('1770576568718-6747e3d85de8', 700)}
              alt="Perucas Onduladas"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs uppercase font-semibold text-brand-300 tracking-wider">
                Volume & Movimento
              </span>
              <h3 className="font-serif text-2xl font-bold mt-1">Onduladas Alta Densidade</h3>
              <p className="text-xs text-neutral-300 mt-1 font-light">
                Ondas abertas e soltas com aspecto praiano sofisticado que não se desfazem facilmente.
              </p>
              <div className="flex items-center gap-1 text-xs font-semibold text-luxury-gold mt-3 group-hover:translate-x-1 transition-transform">
                <span>Ver peças onduladas</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Cacheadas & Afro */}
          <div
            onClick={() => onNavigateToCollection('cacheada')}
            className="group cursor-pointer relative rounded-3xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-luxury-hover border border-luxury-border/60 transition-all duration-300"
          >
            <img
              src={getUnsplashUrl('1641522682419-7e52d83a8ce5', 700)}
              alt="Perucas Cacheadas e Crespas"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs uppercase font-semibold text-brand-300 tracking-wider">
                Ancestralidade & Poder
              </span>
              <h3 className="font-serif text-2xl font-bold mt-1">Cacheadas & Afro</h3>
              <p className="text-xs text-neutral-300 mt-1 font-light">
                Curvaturas 3C, 4A e Black Power exuberante. Cachos definidos com toque hidratado e leveza.
              </p>
              <div className="flex items-center gap-1 text-xs font-semibold text-luxury-gold mt-3 group-hover:translate-x-1 transition-transform">
                <span>Ver peças cacheadas</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
              Curadoria do Atelier
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              Peças Únicas em Destaque
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Prontas para envio imediato com frete seguro e discreto para todo o Brasil.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {(['todas', 'lisa', 'ondulada', 'cacheada'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveFilter(t)}
                className={`py-2 px-4 rounded-xl text-xs font-semibold capitalize transition-all ${
                  activeFilter === t
                    ? 'bg-neutral-900 text-luxury-cream shadow-sm'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {t === 'todas' ? 'Todas' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        <div className="text-center pt-6">
          <button
            onClick={() => onNavigateToCollection()}
            className="py-4 px-8 rounded-2xl bg-white border border-neutral-300 text-neutral-900 font-semibold text-xs hover:bg-neutral-50 transition-all shadow-sm inline-flex items-center gap-2 hover:scale-105"
          >
            <span>Ver Todas as Peças da Coleção Completa</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* WHY HUMAN HAIR? COMPARISON TABLE */}
      <section className="bg-white py-16 border-y border-luxury-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
              Alta Qualidade Comprovada
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
              Por que investir em Cabelo 100% Humano?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto">
              Entenda a diferença real entre uma peça artesanal em cabelo humano versus fibras sintéticas ou orgânicas.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white font-serif">
                  <th className="p-4 sm:p-5 font-bold">Característica</th>
                  <th className="p-4 sm:p-5 font-bold bg-neutral-800 text-luxury-gold">
                    Atelier AURORA (100% Humano)
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-neutral-300">
                    Fibras Sintéticas / Orgânicas
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                <tr>
                  <td className="p-4 font-semibold text-neutral-900">Durabilidade Média</td>
                  <td className="p-4 font-bold text-emerald-800 bg-emerald-50/40">
                    2 a 4 anos (com cuidados básicos)
                  </td>
                  <td className="p-4 text-neutral-500">1 a 3 meses (desgaste rápido)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-neutral-900">Calor & Estilização</td>
                  <td className="p-4 font-bold text-emerald-800 bg-emerald-50/40">
                    Aceita babyliss, prancha e secador até 210°C
                  </td>
                  <td className="p-4 text-neutral-500">Derrete ou embaraça irreversivelmente</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-neutral-900">Brilho e Textura</td>
                  <td className="p-4 font-bold text-emerald-800 bg-emerald-50/40">
                    Toque de seda com brilho biológico real
                  </td>
                  <td className="p-4 text-neutral-500">Brilho plástico artificial sob luz solar</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-neutral-900">Respiração da Touca</td>
                  <td className="p-4 font-bold text-emerald-800 bg-emerald-50/40">
                    Tela HD ultrafina microperfurada e arejada
                  </td>
                  <td className="p-4 text-neutral-500">Toucas fechadas que esquentam a cabeça</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-neutral-900">Coloração & Descoloração</td>
                  <td className="p-4 font-bold text-emerald-800 bg-emerald-50/40">
                    Permite tonalização, matização e mechas
                  </td>
                  <td className="p-4 text-neutral-500">Não absorve tinturas capilares</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ATELIER CONCIERGE WHATSAPP BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-900 text-luxury-cream p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-luxury-gold">
              Atendimento Humanizado & Sigiloso
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Dúvidas sobre o tamanho da cabeça ou qual cor combina mais com seu tom de pele?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Nossas consultoras visagistas atendem individualmente pelo WhatsApp. Enviamos vídeos sem filtro da peça na luz natural antes do envio para sua total tranquilidade.
            </p>
          </div>

          <a
            href={whatsAppHeroUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-4 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg hover:scale-105 flex items-center gap-2 shrink-0"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Falar com Visagista no WhatsApp</span>
          </a>
        </div>
      </section>

    </div>
  );
};
