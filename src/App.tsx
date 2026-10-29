import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { SecurityBanner } from './components/common/SecurityBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/search/SearchModal';
import { QuickViewModal } from './components/catalog/QuickViewModal';
import { CapSizeGuideModal } from './components/catalog/CapSizeGuideModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductDetailView } from './components/product/ProductDetailView';
import { PRODUCTS_CATALOG } from './data/products';
import { Product, TextureType } from './types/product';

export const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'collection' | 'product'>('home');
  const [collectionInitialTexture, setCollectionInitialTexture] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCapGuideOpen, setIsCapGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Check URL query on initial mount (e.g. ?p=lisa-castanho or ?textura=lisa)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('p');
    const textureParam = params.get('textura');

    if (prodId) {
      const found = PRODUCTS_CATALOG.find((p) => p.id === prodId);
      if (found) {
        setSelectedProduct(found);
        setCurrentPage('product');
        return;
      }
    }

    if (textureParam) {
      setCollectionInitialTexture(textureParam);
      setCurrentPage('collection');
    }
  }, []);

  const handleNavigate = (page: 'home' | 'collection', filter?: string) => {
    setCurrentPage(page);
    if (page === 'collection') {
      setCollectionInitialTexture(filter);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-luxury-cream text-neutral-900">
      {/* Top Trust & Security Announcement */}
      <SecurityBanner />

      {/* Main Luxury Sticky Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCapGuide={() => setIsCapGuideOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigateToCollection={(texture) => handleNavigate('collection', texture)}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onOpenCapGuide={() => setIsCapGuideOpen(true)}
          />
        )}

        {currentPage === 'collection' && (
          <CollectionPage
            initialTexture={collectionInitialTexture}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'product' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            onOpenCapGuide={() => setIsCapGuideOpen(true)}
            onSelectProduct={handleSelectProduct}
            onOpenCheckoutDirect={() => setIsCheckoutOpen(true)}
          />
        )}
      </main>

      {/* Luxury Footer with Security Badges */}
      <Footer />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onNavigateToCollection={() => handleNavigate('collection')}
      />

      {/* Instant Search Modal (with debounce & filters) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={handleSelectProduct}
      />

      {/* Anatomical Cap Sizing & Lace Guide Modal */}
      <CapSizeGuideModal
        isOpen={isCapGuideOpen}
        onClose={() => setIsCapGuideOpen(false)}
      />

      {/* Multi-step Realistic Checkout Modal (Pix / Card 3D / Boleto / SDD Security) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onResetToHome={() => handleNavigate('home')}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
};

export default App;
