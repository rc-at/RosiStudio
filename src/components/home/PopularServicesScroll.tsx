import React from 'react';
import Link from 'next/link';
import { DEMO_SERVICES } from '@/lib/data/demo-data';
import { Clock, Plus, ArrowRight } from 'lucide-react';

export function PopularServicesScroll() {
  const featured = DEMO_SERVICES.filter((s) => s.featured || s.active).slice(0, 5);

  return (
    <section className="px-4 sm:px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#171717] tracking-tight">
            Servicios Populares
          </h2>
          <p className="text-[11px] text-[#6B6863]">
            Los más solicitados por nuestros clientes
          </p>
        </div>

        <Link
          href="/servicios"
          className="text-xs font-bold text-[#C9A34E] hover:underline flex items-center gap-1"
        >
          <span>Catálogo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Snap Carousel on mobile, 4-col on desktop */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((service) => (
          <article
            key={service.id}
            className="w-64 sm:w-auto shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-[#E5E0D8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image */}
              <div className="relative h-36 w-full bg-[#E9E1D4] overflow-hidden">
                {service.imageUrl && (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                )}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold text-[#171717] border border-[#E5E0D8]">
                  {service.category}
                </span>
              </div>

              {/* Info */}
              <div className="p-3.5 space-y-1">
                <h3 className="font-heading font-bold text-sm text-[#171717] line-clamp-1">
                  {service.name}
                </h3>
                <p className="text-[11px] text-[#6B6863] line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-[#E5E0D8]">
                  <span className="flex items-center gap-1 text-[11px] text-[#6B6863] font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#C9A34E]" />
                    {service.durationMinutes}m
                  </span>
                  <span className="font-bold text-sm text-[#171717]">
                    S/ {service.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="p-3.5 pt-0">
              <Link
                href={`/reservar?service=${service.id}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#171717] hover:bg-[#C9A34E] text-[#DFC27E] hover:text-[#171717] text-xs font-bold transition-colors shadow-sm active:scale-98"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Reservar turno</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
