import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar } from 'lucide-react';

export function ExperienceGallery() {
  const galleryItems = [
    {
      title: 'Trenzas Artísticas & Box Braids',
      tag: 'Trenzado',
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Degradados & Estilo Urbano',
      tag: 'Barbería',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Manicure Rusa & Nail Art',
      tag: 'Uñas Spa',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Coloración, Balayage & Brillo',
      tag: 'Colorimetría',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9A34E]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Galería de Trabajos</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
            Nuestros Resultados Hablan por Sí Mismos
          </h2>
          <p className="text-sm sm:text-base text-[#6B6863]">
            Cada detalle es tratado con dedicación, utilizando productos de alta gama y técnicas especializadas para que te sientas y te veas espectacular.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-lg transition-all duration-300 border border-[#E5E0D8]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1.5 text-white">
                <span className="inline-block px-2 py-0.5 rounded-full bg-[#C9A34E] text-[#171717] text-[10px] font-bold uppercase tracking-wider">
                  {item.tag}
                </span>
                <h3 className="font-heading text-base font-bold leading-tight">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="mt-12 text-center">
          <Link
            href="/reservar"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#171717] hover:bg-[#C9A34E] text-white hover:text-[#171717] font-semibold text-sm transition-all shadow"
          >
            <Calendar className="w-4 h-4" />
            <span>¿Listo para renovar tu look? Agenda tu cita</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
