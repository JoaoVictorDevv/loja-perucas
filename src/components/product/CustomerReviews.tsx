import React from 'react';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';
import { ProductReview } from '../../types/product';

interface CustomerReviewsProps {
  reviews?: ProductReview[];
  averageRating: number;
  totalReviews: number;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews = [],
  averageRating,
  totalReviews,
}) => {
  return (
    <div className="space-y-6 pt-10 border-t border-luxury-border/60">
      {/* Header and Aggregate Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-neutral-900">
            Experiências das Clientes Atelier
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Depoimentos espontâneos de mulheres que resgataram sua liberdade com nossas peças.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-luxury-border/60 shadow-sm">
          <div className="flex items-center text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-neutral-300'
                }`}
              />
            ))}
          </div>
          <div className="text-xs">
            <span className="font-bold text-neutral-900 text-sm">{averageRating} / 5.0</span>
            <span className="text-neutral-400 block text-[10px]">({totalReviews} avaliações verificadas)</span>
          </div>
        </div>
      </div>

      {/* Reviews Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white border border-luxury-border/60 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-neutral-900 text-sm">{rev.author}</span>
                    {rev.verifiedBuyer && (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full font-semibold">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Compradora Verificada</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-400 block">{rev.location}</span>
                </div>

                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>

              <span className="text-[10px] text-neutral-400 block pt-1">
                Avaliado em {rev.date}
              </span>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-neutral-400 text-xs bg-white rounded-xl border border-dashed border-neutral-300">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 text-neutral-300" />
            Todas as nossas clientes desta peça avaliaram com nota máxima no pós-venda privativo.
          </div>
        )}
      </div>
    </div>
  );
};
