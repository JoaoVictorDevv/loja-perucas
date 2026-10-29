import React, { useState } from 'react';
import { ShieldCheck, Lock, Award, HeartHandshake, MessageCircle, Mail, CheckCircle } from 'lucide-react';
import { STORE_CONFIG } from '../../data/products';
import { useToast } from '../../context/ToastContext';

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { success, warning } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      warning('Por favor, informe um e-mail válido.');
      return;
    }
    setSubscribed(true);
    success('Você está na lista exclusiva do Atelier! Em breve enviaremos lançamentos em primeira mão.');
  };

  return (
    <footer className="bg-luxury-dark text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Security & Trust Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-neutral-800">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <Award className="w-6 h-6 text-brand-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">100% Cabelo Humano</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Fios brasileiros e eslavos selecionados com cutículas preservadas.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <Lock className="w-6 h-6 text-brand-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Segurança Bancária SSL</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Ambiente blindado e criptografado com conformidade PCI-DSS.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <ShieldCheck className="w-6 h-6 text-brand-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Garantia Incondicional</h4>
              <p className="text-xs text-neutral-400 mt-0.5">7 dias corridos após o recebimento para troca ou devolução sem burocracia.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <HeartHandshake className="w-6 h-6 text-brand-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Envio Sigiloso</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Caixa neutra e lacrada, sem menção externa a perucas ou laces.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-neutral-800">
          
          {/* Brand Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-luxury-gold text-neutral-950 flex items-center justify-center font-serif text-base font-bold">
                A
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                AURORA
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Atelier especializado na confecção artesanal de perucas e laces em cabelo 100% humano selecionado. Resgatando autoestimas com naturalidade cirúrgica e toque de seda.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://instagram.com/${STORE_CONFIG.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-brand-600 text-white flex items-center justify-center transition-colors"
                aria-label="Instagram da Aurora"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${STORE_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp da Aurora"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${STORE_CONFIG.email}`}
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors"
                aria-label="E-mail de atendimento"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold tracking-wider uppercase text-white font-sans">
              Coleções
            </h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#lisa" className="hover:text-white transition-colors">Lisas Virgens</a></li>
              <li><a href="#ondulada" className="hover:text-white transition-colors">Onduladas Alta Densidade</a></li>
              <li><a href="#cacheada" className="hover:text-white transition-colors">Cacheadas & Afro Power</a></li>
              <li><a href="#full-lace" className="hover:text-white transition-colors">Full Lace 360°</a></li>
              <li><a href="#promocoes" className="hover:text-white transition-colors">Peças Únicas Disponíveis</a></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold tracking-wider uppercase text-white font-sans">
              Atendimento Atelier
            </h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><span className="text-neutral-300 font-medium">WhatsApp Visagista:</span> {STORE_CONFIG.whatsappFormatado}</li>
              <li><span className="text-neutral-300 font-medium">Horário:</span> Seg a Sex, das 09h às 19h</li>
              <li><span className="text-neutral-300 font-medium">E-mail:</span> {STORE_CONFIG.email}</li>
              <li><a href="#politica" className="hover:text-white transition-colors">Política de Troca & Devolução</a></li>
              <li><a href="#privacidade" className="hover:text-white transition-colors">Privacidade & LGPD</a></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold tracking-wider uppercase text-white font-sans">
              Atelier Exclusivo
            </h5>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Receba avisos prioritários de peças únicas e convites para provador virtual.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Inscrição confirmada com sucesso!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-400 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-luxury-gold text-neutral-950 font-semibold text-xs rounded-lg hover:bg-brand-300 transition-colors"
                >
                  Inscrever-se no Clube VIP
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Security & Payment Badges bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
          <div>
            <p>© {new Date().getFullYear()} {STORE_CONFIG.nome} · Todos os direitos reservados. CNPJ: 00.000.000/0001-00</p>
            <p className="text-[11px] text-neutral-600 mt-1">
              Plataforma desenvolvida com Arquitetura de Segurança SDD e PCI-DSS Compliance.
            </p>
          </div>

          {/* Payment & Security Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-semibold text-neutral-300">
              PIX 5% OFF
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-medium text-neutral-300">
              Mastercard
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-medium text-neutral-300">
              Visa
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-medium text-neutral-300">
              Elo
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-medium text-neutral-300">
              Amex
            </span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-medium text-neutral-300">
              Boleto
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800 text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
              <Lock className="w-3 h-3" /> SSL 256-Bit
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
