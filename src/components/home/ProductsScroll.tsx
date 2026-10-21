import React from 'react';
import Link from 'next/link';
import { DEMO_PRODUCTS, DEMO_BUSINESS_CONFIG } from '@/lib/data/demo-data';
import { MessageCircle, ArrowRight } from 'lucide-react';

export function ProductsScroll() {
  const products = DEMO_PRODUCTS.slice(0, 4);

  return (
    <section className="px-4 sm:px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#171717] tracking-tight">
            Cuidado Capilar & Barbería
          </h2>
          <p className="text-[11px] text-[#6B6863]">
            Productos recomendados para tu rutina
          </p>
        </div>

        <Link
          href="/productos"
          className="text-xs font-bold text-[#C9A34E] hover:underline flex items-center gap-1"
        >
          <span>Ver catálogo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex gap-3.5 overflow-x-auto no-scrollbar snap-x-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {products.map((prod) => (
          <article
            key={prod.id}
            className="w-56 sm:w-auto shrink-0 snap-start bg-white rounded-2xl p-3.5 border border-[#E5E0D8] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative h-32 w-full rounded-xl overflow-hidden bg-[#F8F6F2] mb-2.5">
                {prod.imageUrl && (
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/95 text-[9px] font-bold text-[#171717]">
                  {prod.category}
                </span>
              </div>

              <h3 className="font-heading font-bold text-xs text-[#171717] line-clamp-1">
                {prod.name}
              </h3>
              <p className="text-[10px] text-[#6B6863] line-clamp-2 mt-0.5">
                {prod.description}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#E5E0D8] flex items-center justify-between">
              <span className="font-bold text-sm text-[#171717]">
                S/ {prod.price.toFixed(2)}
              </span>

              <a
                href={`https://wa.me/${DEMO_BUSINESS_CONFIG.whatsapp}?text=Hola%20Rosi%20Studio,%20quisiera%20consultar%20por%20el%20producto:%20${encodeURIComponent(prod.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold transition-colors shadow-sm"
              >
                <MessageCircle className="w-3 h-3 fill-current" />
                <span>Pedir</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
