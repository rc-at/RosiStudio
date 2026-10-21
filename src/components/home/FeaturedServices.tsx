import React from 'react';
import Link from 'next/link';
import { DEMO_SERVICES } from '@/lib/data/demo-data';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';

export function FeaturedServices() {
  const featured = DEMO_SERVICES.filter((s) => s.featured).slice(0, 4);

  return (
    <section className="py-16 md:py-20 bg-white border-y border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9A34E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nuestras Especialidades</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
              Servicios Destacados
            </h2>
            <p className="text-sm sm:text-base text-[#6B6863]">
              Técnicas perfeccionadas para realzar tu belleza y estilo. Precios y duraciones referenciales con atención de primera.
            </p>
          </div>

          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#171717] hover:text-[#C9A34E] group transition-colors"
          >
            <span>Ver catálogo completo ({DEMO_SERVICES.length} servicios)</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((service) => (
            <article
              key={service.id}
              className="group bg-[#F8F6F2] rounded-2xl overflow-hidden border border-[#E5E0D8] hover:border-[#C9A34E]/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Service Image */}
                <div className="relative h-48 w-full overflow-hidden bg-[#E9E1D4]">
                  {service.imageUrl && (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-[#171717] border border-[#E5E0D8] shadow-sm">
                    {service.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <h3 className="font-heading text-lg font-bold text-[#171717] group-hover:text-[#A5802C] transition-colors line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#6B6863] leading-relaxed line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 text-[#6B6863] border-t border-[#E5E0D8]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#C9A34E]" />
                      {service.durationMinutes} min
                    </span>
                    <span className="text-base font-bold text-[#171717]">
                      S/ {service.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <Link
                  href={`/reservar?service=${service.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white hover:bg-[#C9A34E] text-[#171717] hover:text-[#171717] font-semibold text-xs border border-[#E5E0D8] shadow-sm transition-all"
                >
                  <span>Reservar este servicio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
