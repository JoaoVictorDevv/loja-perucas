import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  MessageCircle,
  Check,
  Ruler,
  ChevronDown,
  Lock,
  RotateCcw,
  Package
} from 'lucide-react';
import { Product } from '../../types/product';
import { STORE_CONFIG, getUnsplashUrl } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { CustomerReviews } from './CustomerReviews';
import { lookupCep } from '../../services/cepService';

interface ProductDetailViewProps {
  product: Product;
  onOpenCapGuide: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenCheckoutDirect: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onOpenCapGuide,
  onSelectProduct,
  onOpenCheckoutDirect,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [selectedSize, setSelectedSize] = useState<'P (52-54cm)' | 'M (55-57cm)' | 'G (58-60cm)'>('M (55-57cm)');
  const [cepInput, setCepInput] = useState('');
  const [isCalculatingCep, setIsCalculatingCep] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [cepError, setCepError] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string | null>('cuidados');

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFav = isInWishlist(product.id);

  const precoPix = Math.round(product.preco * (1 - STORE_CONFIG.descontoPix));
  const parcela = Math.round((product.preco / STORE_CONFIG.parcelasSemJuros) * 100) / 100;

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setCepError('');
    setIsCalculatingCep(true);
    const result = await lookupCep(cepInput, product.preco);
    setIsCalculatingCep(false);

    if (!result.success && result.error) {
      setCepError(result.error);
    } else {
      setShippingOptions(result.shippingOptions);
    }
  };

  const handleBuyNow = () => {
    addItem(product, 1, selectedSize);
    onOpenCheckoutDirect();
  };

  const whatsAppDirectText = `Olá Atelier Aurora! Gostaria de mais detalhes sobre a peruca "${product.nome}" (R$ ${product.preco.toLocaleString('pt-BR')}). Ela ainda está reservável?`;
  const whatsAppDirectUrl = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(whatsAppDirectText)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-in fade-in duration-300">
      
      {/* Main Grid: Gallery & Buying Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Gallery Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Big Photo */}
          <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-100 border border-luxury-border/60 shadow-luxury group">
            <img
              src={getUnsplashUrl(product.fotos[selectedPhoto] || product.fotos[0], 1200)}
              alt={product.nome}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
              <span className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold bg-neutral-950/85 text-luxury-cream backdrop-blur-md">
                Peça Única Artesanal
              </span>
              {product.badge && (
                <span className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold bg-brand-500/90 text-white backdrop-blur-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {product.badge}
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id, product.nome)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md backdrop-blur-md transition-all hover:scale-110"
              aria-label="Salvar nos favoritos"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFav ? 'fill-rose-600 text-rose-600' : 'text-neutral-700'
                }`}
              />
            </button>
          </div>

          {/* Thumbnail Selector Strip */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {product.fotos.map((photoId, idx) => (
              <button
                key={photoId}
                onClick={() => setSelectedPhoto(idx)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedPhoto === idx
                    ? 'border-brand-500 scale-105 shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={getUnsplashUrl(photoId, 300)}
                  alt={`${product.nome} ângulo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Buying & Details Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 uppercase tracking-widest mb-1.5">
              <span>{product.textura}</span>
              <span>&bull;</span>
              <span>{product.comprimento}</span>
              <span>&bull;</span>
              <span>Densidade {product.densidade}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
              {product.nome}
            </h1>

            <p className="text-sm text-neutral-500 mt-2">
              Tom: <strong className="text-neutral-800 font-semibold">{product.cor}</strong> &bull; Touca: <strong className="text-neutral-800 font-semibold">{product.touca}</strong>
            </p>
          </div>

          {/* Price Container */}
          <div className="p-6 rounded-2xl bg-luxury-surface border border-luxury-border/60 shadow-sm space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
                R$ {product.preco.toLocaleString('pt-BR')}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                5% OFF no Pix
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-700 font-bold">
                R$ {precoPix.toLocaleString('pt-BR')} no Pix à vista
              </span>
              <span className="text-xs text-neutral-500">
                Economia de R$ {(product.preco - precoPix).toLocaleString('pt-BR')}
              </span>
            </div>

            <p className="text-xs text-neutral-500 pt-1">
              ou em até <strong>{STORE_CONFIG.parcelasSemJuros}x de R$ {parcela.toLocaleString('pt-BR')} sem juros</strong> em todos os cartões
            </p>
          </div>

          {/* Cap Size Choice */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-neutral-800">
                Tamanho da Touca Anatômica:
              </span>
              <button
                onClick={onOpenCapGuide}
                className="text-brand-700 hover:text-brand-900 font-semibold underline flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Como medir sua cabeça</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {(['P (52-54cm)', 'M (55-57cm)', 'G (58-60cm)'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
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

          {/* Call to Actions */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleBuyNow}
              className="w-full py-4 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-luxury-cream font-semibold text-sm transition-all shadow-luxury hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Comprar Agora &bull; R$ {product.preco.toLocaleString('pt-BR')}</span>
            </button>

            <button
              onClick={() => addItem(product, 1, selectedSize)}
              className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-900 font-semibold text-xs border border-neutral-300 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Adicionar à Sacola de Compras</span>
            </button>

            <a
              href={whatsAppDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Tirar Dúvidas com Visagista no WhatsApp</span>
            </a>
          </div>

          {/* Shipping Calculator in Product View */}
          <div className="p-4 rounded-2xl bg-white border border-luxury-border/60 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
              <Truck className="w-4 h-4 text-brand-600" />
              <span>Simular Prazo e Frete Sigiloso:</span>
            </div>

            <form onSubmit={handleCalculateShipping} className="flex gap-2">
              <input
                type="text"
                maxLength={9}
                value={cepInput}
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, '').slice(0, 8);
                  setCepInput(d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d);
                }}
                placeholder="00000-000"
                className="flex-1 text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500 font-mono"
              />
              <button
                type="submit"
                disabled={isCalculatingCep}
                className="py-2.5 px-4 bg-neutral-900 text-white font-semibold text-xs rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {isCalculatingCep ? 'Calculando...' : 'Calcular'}
              </button>
            </form>

            {cepError && <p className="text-xs text-rose-600 font-medium">{cepError}</p>}

            {shippingOptions.length > 0 && (
              <div className="space-y-1.5 pt-1 text-xs">
                {shippingOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-200"
                  >
                    <div>
                      <span className="font-semibold text-neutral-900 block">{opt.name}</span>
                      <span className="text-[11px] text-neutral-500">{opt.days}</span>
                    </div>
                    <span className="font-bold text-neutral-900">
                      {opt.price === 0 ? 'Grátis' : `R$ ${opt.price.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Confidence Pillars */}
          <div className="grid grid-cols-2 gap-3 text-xs text-neutral-600 pt-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50">
              <RotateCcw className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Troca grátis em até 7 dias</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50">
              <Package className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Embalagem 100% neutra</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hair Technical Specifications Sheet */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-luxury-border/60 shadow-sm space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-brand-700 block">
            Ficha Técnica da Alta Perucaria
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            Especificações Artesanais da Peça
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">Origem dos Fios</span>
            <span className="font-bold text-neutral-900 text-sm mt-0.5 block">{product.detalhesCabelo.origem}</span>
            <p className="text-neutral-500 mt-1">Cabelo virgem e selecionado manualmente, sem mistura com sintéticos ou fibras químicas.</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">Cutículas do Cabelo</span>
            <span className="font-bold text-neutral-900 text-sm mt-0.5 block">{product.detalhesCabelo.cuticulas}</span>
            <p className="text-neutral-500 mt-1">Alinhamento unidirecional que impede o embaraço e garante brilho luminoso.</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">Área de Repartição</span>
            <span className="font-bold text-neutral-900 text-sm mt-0.5 block">{product.detalhesCabelo.reparticao}</span>
            <p className="text-neutral-500 mt-1">Tela suíça HD respirável com fios atados um a um para simular o couro cabeludo.</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">Resistência Térmica</span>
            <span className="font-bold text-neutral-900 text-sm mt-0.5 block">{product.detalhesCabelo.resistenciaCalor}</span>
            <p className="text-neutral-500 mt-1">Pode ser estilizada livremente com babyliss, chapinha e secador morno.</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">Penteados Homologados</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {product.detalhesCabelo.penteadosPermitidos.map((p) => (
                <span key={p} className="px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-700 font-medium">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">Certificação Atelier</span>
            <span className="font-bold text-emerald-800 text-sm mt-0.5 block">100% Cabelo Humano Testado</span>
            <p className="text-neutral-500 mt-1">Acompanha Certificado de Autenticidade e Lacre de Garantia de 3 meses.</p>
          </div>
        </div>
      </div>

      {/* Accordions: Care, Exchanges, Privacy */}
      <div className="space-y-3">
        {[
          {
            id: 'cuidados',
            title: 'Como lavar e cuidar da sua peruca de cabelo humano?',
            content: 'Lave a cada 10 a 15 dias de uso. Utilize água morna ou fria, xampu sem sal e máscara de hidratação de nutrição profunda. Penteie sempre das pontas para a raiz usando escova polvo ou pente de dentes largos. Deixe secar naturalmente sobre o suporte de peruca ou utilize secador com protetor térmico.'
          },
          {
            id: 'trocas',
            title: 'Garantia Incondicional de 7 Dias e Política de Troca',
            content: 'Você tem 7 dias corridos após o recebimento para experimentar a peça no conforto da sua casa. Caso deseje trocar de textura, cor ou modelo, o frete reverso é 100% por nossa conta, desde que a renda da lace frontal não tenha sido cortada e o lacre de segurança esteja preservado.'
          },
          {
            id: 'sigilo',
            title: 'Embalagem Neutra e Sigilo na Fatura',
            content: 'Prezamos 100% pela sua privacidade. A caixa de envio não possui logotipos ou menções a perucas. Na fatura do cartão ou Pix, a razão social aparece de forma discreta como "AURORA ATELIER DE BELEZA".'
          }
        ].map((acc) => {
          const isOpen = openAccordion === acc.id;
          return (
            <div
              key={acc.id}
              className="bg-white rounded-2xl border border-luxury-border/60 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenAccordion(isOpen ? null : acc.id)}
                className="w-full p-5 text-left flex items-center justify-between font-serif text-base sm:text-lg font-bold text-neutral-900 hover:text-brand-700 transition-colors"
              >
                <span>{acc.title}</span>
                <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                  {acc.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Customer Reviews */}
      <CustomerReviews
        reviews={product.reviews}
        averageRating={product.rating}
        totalReviews={product.reviewsCount}
      />

    </div>
  );
};
