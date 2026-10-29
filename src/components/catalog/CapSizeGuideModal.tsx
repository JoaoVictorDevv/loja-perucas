import React from 'react';
import { Modal } from '../common/Modal';
import { CheckCircle2, Info, Sparkles, Ruler } from 'lucide-react';

interface CapSizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CapSizeGuideModal: React.FC<CapSizeGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Guia do Atelier: Medidas e Tipos de Lace"
      subtitle="Descubra o encaixe anatômico perfeito para conforto absoluto e naturalidade imperceptível"
      maxWidth="2xl"
    >
      <div className="space-y-6 text-sm text-neutral-700">
        
        {/* Step 1: Como Medir */}
        <div className="bg-brand-50/70 p-5 rounded-2xl border border-brand-200/60">
          <div className="flex items-center gap-2 font-serif text-lg font-bold text-neutral-900 mb-2">
            <Ruler className="w-5 h-5 text-brand-700" />
            <h4>Como Medir Sua Circunferência</h4>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed mb-3">
            Com uma fita métrica flexível, dê a volta completa na cabeça posicionando-a na linha frontal do cabelo, passando acima das orelhas e pela nuca.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-brand-100 shadow-sm">
              <span className="font-bold text-neutral-900 block text-sm">Tamanho P</span>
              <span className="text-brand-800 font-semibold">52 a 54 cm</span>
              <p className="text-[11px] text-neutral-500 mt-1">Ideal para cabeças menores ou sem cabelo volumoso por baixo.</p>
            </div>
            <div className="p-3 bg-white rounded-xl border-2 border-brand-500 shadow-sm relative">
              <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-500 text-white uppercase">
                Padrão
              </span>
              <span className="font-bold text-neutral-900 block text-sm">Tamanho M</span>
              <span className="text-brand-800 font-semibold">55 a 57 cm</span>
              <p className="text-[11px] text-neutral-500 mt-1">Veste 85% das clientes com extremo conforto e tiras ajustáveis.</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-brand-100 shadow-sm">
              <span className="font-bold text-neutral-900 block text-sm">Tamanho G</span>
              <span className="text-brand-800 font-semibold">58 a 60 cm</span>
              <p className="text-[11px] text-neutral-500 mt-1">Para quem prefere uma touca mais folgada ou usa tranças grossas de base.</p>
            </div>
          </div>
        </div>

        {/* Step 2: Tipos de Touca */}
        <div>
          <h4 className="font-serif text-lg font-bold text-neutral-900 mb-3">
            Diferença Entre os Modelos de Lace
          </h4>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 text-sm">Lace Frontal 13x4 HD</span>
                <span className="text-[11px] bg-neutral-100 px-2 py-0.5 rounded font-medium text-neutral-600">Mais Popular</span>
              </div>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Possui 13 polegadas de orelha a orelha e 4 polegadas de profundidade na testa. Permite risca ao meio, risca lateral e repartições versáteis com acabamento invisível.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 text-sm">Lace Frontal 13x6 HD</span>
                <span className="text-[11px] bg-neutral-100 px-2 py-0.5 rounded font-medium text-neutral-600">Extra Profunda</span>
              </div>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                6 polegadas de profundidade para repartição livre muito mais profunda na coroa da cabeça. Ideal para quem adora penteados divididos ao meio bem marcados.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-brand-300 bg-brand-50/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span className="font-bold text-neutral-900 text-sm">Full Lace 360° Suíça</span>
                </div>
                <span className="text-[11px] bg-brand-200/80 px-2 py-0.5 rounded font-bold text-brand-900">Nobreza Total</span>
              </div>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Toda a cabeça é confeccionada em tela respirável ultrafina tecida fio a fio. Permite qualquer penteado: rabo de cavalo alto, trança boxeadora, coque de noiva e riscas em qualquer direção.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Pentes e Elásticos */}
        <div className="p-4 rounded-xl bg-neutral-100/80 text-xs text-neutral-600 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-neutral-800">
            <Info className="w-4 h-4 text-brand-600" />
            <span>Segurança sem cola (Glueless Friendly):</span>
          </div>
          <p>
            Todas as nossas perucas vêm com 4 pentes internos anatômicos e alças elásticas com ganchos milimétricos na nuca. Você pode usá-las 100% sem cola no dia a dia, com total firmeza e segurança.
          </p>
        </div>

      </div>
    </Modal>
  );
};
