import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, MessageCircle, Sparkles } from 'lucide-react';
import { STORE_CONFIG } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenCapGuide: () => void;
  currentPage: 'home' | 'collection' | 'product';
  onNavigate: (page: 'home' | 'collection', filter?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenCapGuide,
  currentPage,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { summary, setIsCartOpen } = useCart();
  const { totalWishlist } = useWishlist();

  const handleLinkClick = (page: 'home' | 'collection', filter?: string) => {
    onNavigate(page, filter);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsAppLink = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(
    'Olá! Gostaria de uma consultoria personalizada para escolher minha peruca de cabelo humano.'
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-luxury-cream/90 backdrop-blur-md border-b border-luxury-border/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Abrir menu principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLinkClick('home')}
              className="text-left group flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-full bg-neutral-900 text-luxury-gold flex items-center justify-center font-serif text-lg font-bold shadow-sm group-hover:scale-105 transition-transform">
                A
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider text-neutral-900 block group-hover:text-brand-700 transition-colors">
                  AURORA
                </span>
                <span className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase font-medium block -mt-1">
                  Hair Atelier
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-700">
            <button
              onClick={() => handleLinkClick('home')}
              className={`hover:text-neutral-900 transition-colors ${
                currentPage === 'home' ? 'text-neutral-900 font-semibold' : ''
              }`}
            >
              Início
            </button>
            <button
              onClick={() => handleLinkClick('collection')}
              className={`hover:text-neutral-900 transition-colors ${
                currentPage === 'collection' ? 'text-neutral-900 font-semibold' : ''
              }`}
            >
              Coleção Completa
            </button>
            <button
              onClick={() => handleLinkClick('collection', 'lisa')}
              className="hover:text-neutral-900 transition-colors"
            >
              Lisas
            </button>
            <button
              onClick={() => handleLinkClick('collection', 'ondulada')}
              className="hover:text-neutral-900 transition-colors"
            >
              Onduladas
            </button>
            <button
              onClick={() => handleLinkClick('collection', 'cacheada')}
              className="hover:text-neutral-900 transition-colors"
            >
              Cacheadas
            </button>
            <button
              onClick={onOpenCapGuide}
              className="flex items-center gap-1.5 text-brand-700 hover:text-brand-900 transition-colors py-1 px-2.5 rounded-full bg-brand-50 border border-brand-200/50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Guia de Toucas</span>
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors relative"
              aria-label="Buscar perucas"
              title="Buscar (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleLinkClick('collection')}
              className="p-2.5 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors relative"
              aria-label="Ver favoritos"
              title="Favoritos"
            >
              <Heart className="w-5 h-5" />
              {totalWishlist > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in-75">
                  {totalWishlist}
                </span>
              )}
            </button>

            {/* WhatsApp Concierge */}
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 py-2 px-3.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              title="Falar com consultora visagista"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Atelier WhatsApp</span>
            </a>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 bg-neutral-900 text-luxury-cream hover:bg-neutral-800 rounded-full transition-all flex items-center gap-2.5 pl-3.5 pr-4 shadow-sm hover:scale-[1.02]"
              aria-label="Abrir sacola de compras"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {summary.itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {summary.itemsCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium hidden md:inline">
                {summary.itemsCount > 0
                  ? `R$ ${summary.total.toLocaleString('pt-BR')}`
                  : 'Sacola'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-luxury-border/60 bg-luxury-cream/98 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-2">
            <button
              onClick={() => handleLinkClick('home')}
              className="w-full text-left py-2.5 text-base font-medium text-neutral-800 hover:text-brand-700"
            >
              Início
            </button>
            <button
              onClick={() => handleLinkClick('collection')}
              className="w-full text-left py-2.5 text-base font-medium text-neutral-800 hover:text-brand-700"
            >
              Todas as Perucas
            </button>
            <button
              onClick={() => handleLinkClick('collection', 'lisa')}
              className="w-full text-left py-2.5 text-sm text-neutral-600 pl-4 hover:text-brand-700"
            >
              • Lisas Naturais
            </button>
            <button
              onClick={() => handleLinkClick('collection', 'ondulada')}
              className="w-full text-left py-2.5 text-sm text-neutral-600 pl-4 hover:text-brand-700"
            >
              • Onduladas de Alta Densidade
            </button>
            <button
              onClick={() => handleLinkClick('collection', 'cacheada')}
              className="w-full text-left py-2.5 text-sm text-neutral-600 pl-4 hover:text-brand-700"
            >
              • Cacheadas & Afro
            </button>
            <button
              onClick={() => {
                onOpenCapGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 py-3 text-sm font-semibold text-brand-700 bg-brand-50 rounded-xl px-4 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Guia de Medidas & Tipos de Lace</span>
            </button>
          </div>

          <div className="pt-4 border-t border-luxury-border/60">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-medium text-sm shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consultoria no WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
