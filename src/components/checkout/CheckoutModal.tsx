import React, { useState } from 'react';
import { ShieldCheck, Lock, User, MapPin, Truck, CreditCard, ChevronRight, AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { PixPayment } from './PixPayment';
import { CardPayment } from './CardPayment';
import { BoletoPayment } from './BoletoPayment';
import { OrderConfirmation } from './OrderConfirmation';
import { useCart } from '../../context/CartContext';
import { CustomerData, AddressData, PaymentMethodType, Order } from '../../types/checkout';
import { ShippingOption } from '../../types/cart';
import { validateCPF, validateEmail, validatePhone, validateCEP } from '../../security/validator';
import { sanitizeText, sanitizeNumbersOnly } from '../../security/sanitizer';
import { lookupCep } from '../../services/cepService';
import { generatePixData, generateBoletoData } from '../../services/paymentService';
import { generateSecurityToken } from '../../security/crypto';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetToHome: () => void;
}

type CheckoutStep = 'customer_address' | 'shipping' | 'payment' | 'confirmation';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onResetToHome,
}) => {
  const { items, summary, selectedShipping, setSelectedShipping, clearCart } = useCart();

  const [step, setStep] = useState<CheckoutStep>('customer_address');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [shippingList, setShippingList] = useState<ShippingOption[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('pix');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [customer, setCustomer] = useState<CustomerData>({
    nomeCompleto: '',
    email: '',
    cpf: '',
    telefone: '',
  });

  const [address, setAddress] = useState<AddressData>({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
  });

  if (!isOpen) return null;

  // Mask Formatters
  const formatCPF = (val: string) => {
    const d = sanitizeNumbersOnly(val).slice(0, 11);
    return d
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatPhone = (val: string) => {
    const d = sanitizeNumbersOnly(val).slice(0, 11);
    if (d.length > 10) return d.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (d.length > 5) return d.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    if (d.length > 2) return d.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    return d;
  };

  const formatCEP = (val: string) => {
    const d = sanitizeNumbersOnly(val).slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  };

  // CEP Lookup Auto Fill
  const handleCepBlur = async () => {
    const clean = sanitizeNumbersOnly(address.cep);
    if (clean.length === 8) {
      setIsSearchingCep(true);
      const res = await lookupCep(clean, summary.subtotal);
      setIsSearchingCep(false);
      if (res.success) {
        setAddress((prev) => ({
          ...prev,
          logradouro: res.logradouro || prev.logradouro,
          bairro: res.bairro || prev.bairro,
          cidade: res.cidade || prev.cidade,
          uf: res.uf || prev.uf,
        }));
        setShippingList(res.shippingOptions);
        if (!selectedShipping && res.shippingOptions.length > 0) {
          setSelectedShipping(res.shippingOptions[0]);
        }
      }
    }
  };

  // Step 1: Validate Customer and Address
  const handleProceedToShipping = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!customer.nomeCompleto.trim() || customer.nomeCompleto.trim().split(' ').length < 2) {
      newErrors.nomeCompleto = 'Informe seu nome e sobrenome completos.';
    }

    if (!validateEmail(customer.email)) {
      newErrors.email = 'E-mail inválido para recebimento do rastreio.';
    }

    if (!validateCPF(customer.cpf)) {
      newErrors.cpf = 'CPF inválido (algoritmo dos dígitos verificadores falhou).';
    }

    if (!validatePhone(customer.telefone)) {
      newErrors.telefone = 'Celular com DDD inválido.';
    }

    if (!validateCEP(address.cep)) {
      newErrors.cep = 'Informe um CEP válido com 8 dígitos.';
    }

    if (!address.logradouro.trim()) {
      newErrors.logradouro = 'Endereço obrigatório.';
    }

    if (!address.numero.trim()) {
      newErrors.numero = 'Número obrigatório (ou S/N).';
    }

    if (!address.cidade.trim() || !address.uf.trim()) {
      newErrors.cidade = 'Cidade e Estado são obrigatórios.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (shippingList.length === 0) {
      lookupCep(address.cep, summary.subtotal).then((res) => {
        if (res.shippingOptions.length > 0) {
          setShippingList(res.shippingOptions);
          if (!selectedShipping) setSelectedShipping(res.shippingOptions[0]);
        }
      });
    }
    setStep('shipping');
  };

  // Step 2: Validate Shipping and Proceed to Payment
  const handleProceedToPayment = () => {
    if (!selectedShipping) {
      setErrors({ shipping: 'Selecione uma opção de entrega para continuar.' });
      return;
    }
    setErrors({});
    setStep('payment');
  };

  // Finalize Order
  const handleFinalizeOrder = (method: PaymentMethodType, cardInfo?: { brand: string; lastFour: string }) => {
    const orderNumber = `AUR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalTotal = method === 'pix' ? summary.pixTotal : summary.total;

    const orderData: Order = {
      id: Math.random().toString(36).substring(2, 10),
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      address,
      items: [...items],
      shipping: selectedShipping || {
        id: 'pac',
        name: 'PAC Seguro',
        price: 0,
        days: '5 dias',
        description: 'Envio seguro',
      },
      paymentMethod: method,
      subtotal: summary.subtotal,
      discount: summary.discountValue,
      shippingCost: summary.shippingValue,
      total: finalTotal,
      status: method === 'pix' || method === 'credit_card' ? 'paid' : 'pending',
      cardBrand: cardInfo?.brand,
      cardLastFour: cardInfo?.lastFour,
      securityChecksum: generateSecurityToken(),
    };

    setCreatedOrder(orderData);
    clearCart();
    setStep('confirmation');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={step === 'confirmation' ? onResetToHome : onClose}
      maxWidth={step === 'confirmation' ? '2xl' : 'xl'}
    >
      <div className="space-y-6">
        
        {/* Progress Stepper */}
        {step !== 'confirmation' && (
          <div className="flex items-center justify-between pb-4 border-b border-luxury-border/60 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  step === 'customer_address'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {step === 'customer_address' ? '1' : <Check className="w-3.5 h-3.5" />}
              </span>
              <span className="font-semibold text-neutral-800 hidden sm:inline">Identificação</span>
            </div>

            <ChevronRight className="w-4 h-4 text-neutral-400" />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  step === 'shipping'
                    ? 'bg-neutral-900 text-white'
                    : step === 'payment'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {step === 'payment' ? <Check className="w-3.5 h-3.5" /> : '2'}
              </span>
              <span className="font-semibold text-neutral-800 hidden sm:inline">Envio</span>
            </div>

            <ChevronRight className="w-4 h-4 text-neutral-400" />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  step === 'payment'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                3
              </span>
              <span className="font-semibold text-neutral-800 hidden sm:inline">Pagamento Seguro</span>
            </div>
          </div>
        )}

        {/* STEP 1: Customer Data & Address */}
        {step === 'customer_address' && (
          <form onSubmit={handleProceedToShipping} className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <User className="w-4 h-4 text-brand-600" />
              <h3 className="font-serif text-lg font-bold text-neutral-900">
                Dados Pessoais &bull; Sigilo Garantido
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Nome Completo:
                </label>
                <input
                  type="text"
                  required
                  value={customer.nomeCompleto}
                  onChange={(e) => setCustomer({ ...customer, nomeCompleto: sanitizeText(e.target.value) })}
                  placeholder="Seu nome completo"
                  className="w-full py-2.5 px-3.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500"
                />
                {errors.nomeCompleto && <p className="text-rose-600 mt-1">{errors.nomeCompleto}</p>}
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  E-mail para Rastreio:
                </label>
                <input
                  type="email"
                  required
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: sanitizeText(e.target.value) })}
                  placeholder="exemplo@email.com"
                  className="w-full py-2.5 px-3.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500"
                />
                {errors.email && <p className="text-rose-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  CPF (Verificação):
                </label>
                <input
                  type="text"
                  required
                  value={customer.cpf}
                  onChange={(e) => setCustomer({ ...customer, cpf: formatCPF(e.target.value) })}
                  placeholder="000.000.000-00"
                  className="w-full py-2.5 px-3.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500 font-mono"
                />
                {errors.cpf && <p className="text-rose-600 mt-1">{errors.cpf}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  WhatsApp / Celular com DDD:
                </label>
                <input
                  type="tel"
                  required
                  value={customer.telefone}
                  onChange={(e) => setCustomer({ ...customer, telefone: formatPhone(e.target.value) })}
                  placeholder="(11) 90000-0000"
                  className="w-full py-2.5 px-3.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500 font-mono"
                />
                {errors.telefone && <p className="text-rose-600 mt-1">{errors.telefone}</p>}
              </div>
            </div>

            {/* Address */}
            <div className="pt-3 border-t border-neutral-100">
              <div className="flex items-center gap-2 pb-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Endereço de Entrega
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    CEP:
                  </label>
                  <input
                    type="text"
                    required
                    value={address.cep}
                    onBlur={handleCepBlur}
                    onChange={(e) => setAddress({ ...address, cep: formatCEP(e.target.value) })}
                    placeholder="00000-000"
                    className="w-full py-2.5 px-3.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500 font-mono"
                  />
                  {isSearchingCep && <p className="text-brand-600 mt-1">Localizando CEP...</p>}
                  {errors.cep && <p className="text-rose-600 mt-1">{errors.cep}</p>}
                </div>

                <div className="col-span-2 sm:col-span-3">
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Rua / Avenida:
                  </label>
                  <input
                    type="text"
                    required
                    value={address.logradouro}
                    onChange={(e) => setAddress({ ...address, logradouro: sanitizeText(e.target.value) })}
                    placeholder="Nome do logradouro"
                    className="w-full py-2.5 px-3.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                  {errors.logradouro && <p className="text-rose-600 mt-1">{errors.logradouro}</p>}
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Número:
                  </label>
                  <input
                    type="text"
                    required
                    value={address.numero}
                    onChange={(e) => setAddress({ ...address, numero: sanitizeText(e.target.value) })}
                    placeholder="123"
                    className="w-full py-2.5 px-3.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                  {errors.numero && <p className="text-rose-600 mt-1">{errors.numero}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Complemento (opcional):
                  </label>
                  <input
                    type="text"
                    value={address.complemento}
                    onChange={(e) => setAddress({ ...address, complemento: sanitizeText(e.target.value) })}
                    placeholder="Apto 42, Bloco B"
                    className="w-full py-2.5 px-3.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Bairro:
                  </label>
                  <input
                    type="text"
                    required
                    value={address.bairro}
                    onChange={(e) => setAddress({ ...address, bairro: sanitizeText(e.target.value) })}
                    placeholder="Bairro"
                    className="w-full py-2.5 px-3.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Cidade:
                  </label>
                  <input
                    type="text"
                    required
                    value={address.cidade}
                    onChange={(e) => setAddress({ ...address, cidade: sanitizeText(e.target.value) })}
                    placeholder="Cidade"
                    className="w-full py-2.5 px-3.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    UF:
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={address.uf}
                    onChange={(e) => setAddress({ ...address, uf: sanitizeText(e.target.value).toUpperCase() })}
                    placeholder="SP"
                    className="w-full py-2.5 px-3.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500 uppercase text-center"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center gap-2 mt-4"
            >
              <span>Continuar para Escolha do Envio</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Shipping Method Selection */}
        {step === 'shipping' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-600" />
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Modalidade de Entrega Sigilosa
                </h3>
              </div>
              <button
                onClick={() => setStep('customer_address')}
                className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            </div>

            <div className="space-y-3">
              {(shippingList.length > 0 ? shippingList : [
                { id: 'pac' as const, name: 'PAC Seguro · Correios', price: summary.subtotal >= 3000 ? 0 : 34.9, days: '3 a 5 dias úteis', description: 'Envio seguro' },
                { id: 'sedex' as const, name: 'SEDEX Prioritário · Seguro Total', price: 59.9, days: '1 a 2 dias úteis', description: 'Entrega rápida com seguro' }
              ]).map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedShipping?.id === opt.id
                      ? 'border-neutral-900 bg-brand-50/40 shadow-sm'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="checkout_shipping"
                      checked={selectedShipping?.id === opt.id}
                      onChange={() => setSelectedShipping(opt)}
                      className="mt-1 text-neutral-900 focus:ring-neutral-900"
                    />
                    <div>
                      <span className="font-bold text-neutral-900 text-sm block">{opt.name}</span>
                      <span className="text-xs text-neutral-500 block mt-0.5">{opt.days}</span>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">{opt.description}</span>
                    </div>
                  </div>
                  <span className="font-serif text-base font-bold text-neutral-900">
                    {opt.price === 0 ? 'Grátis' : `R$ ${opt.price.toFixed(2).replace('.', ',')}`}
                  </span>
                </label>
              ))}
            </div>

            <div className="p-3 bg-neutral-100 rounded-xl text-xs text-neutral-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Garantia de embalagem neutra: sem marcas ou identificação externa de peruca.</span>
            </div>

            <button
              onClick={handleProceedToPayment}
              className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Ir para o Pagamento Seguro</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: Payment */}
        {step === 'payment' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Pagamento Seguro
                </h3>
              </div>
              <button
                onClick={() => setStep('shipping')}
                className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`py-3 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'pix'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span className="font-bold">PIX</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/80 px-1.5 py-0.5 rounded">
                  5% OFF
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`py-3 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cartão de Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`py-3 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'boleto'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span className="font-bold">Boleto</span>
                <span className="text-[10px] text-neutral-400">À vista</span>
              </button>
            </div>

            {/* Active Payment Method Content */}
            {paymentMethod === 'pix' && (
              <PixPayment
                pixData={generatePixData('ORD-TEMP', summary.pixTotal)}
                amount={summary.pixTotal}
                onPaymentConfirmed={() => handleFinalizeOrder('pix')}
              />
            )}

            {paymentMethod === 'credit_card' && (
              <CardPayment
                amount={summary.total}
                onPaymentSuccess={(cardInfo) => handleFinalizeOrder('credit_card', cardInfo)}
              />
            )}

            {paymentMethod === 'boleto' && (
              <BoletoPayment
                boletoData={generateBoletoData('ORD-TEMP', summary.total)}
                amount={summary.total}
                onBoletoConfirmed={() => handleFinalizeOrder('boleto')}
              />
            )}
          </div>
        )}

        {/* STEP 4: Confirmation & Receipt */}
        {step === 'confirmation' && createdOrder && (
          <OrderConfirmation
            order={createdOrder}
            onContinueShopping={() => {
              onClose();
              onResetToHome();
            }}
          />
        )}

      </div>
    </Modal>
  );
};
