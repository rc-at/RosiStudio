import React from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

const LOOKS = [
  {
    id: 'look-1',
    title: 'Trenzas Africanas Box Braids',
    tag: 'Trenzado',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'look-2',
    title: 'Corte Fade & Barba Express',
    tag: 'Barbería',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'look-3',
    title: 'Manicure Rusa & Esmaltado',
    tag: 'Uñas Spa',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'look-4',
    title: 'Mechas Balayage & Brillo',
    tag: 'Coloración',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
  },
];

export function LooksGalleryScroll() {
  return (
    <section className="px-4 sm:px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#171717] tracking-tight">
            Nuestros Looks
          </h2>
          <p className="text-[11px] text-[#6B6863]">
            Resultados recientes en salón y a domicilio
          </p>
        </div>

        <Link
          href="/reservar"
          className="text-xs font-bold text-[#C9A34E] hover:underline flex items-center gap-1"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Pedir cita</span>
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x-mandatory pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4">
        {LOOKS.map((look) => (
          <Link
            key={look.id}
            href="/reservar"
            className="group relative w-40 sm:w-auto shrink-0 snap-start aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-[#E5E0D8] focus:outline-none"
          >
            <img
              src={look.image}
              alt={look.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1 text-white">
              <span className="inline-block px-2 py-0.5 rounded-full bg-[#C9A34E] text-[#171717] text-[9px] font-bold uppercase tracking-wider">
                {look.tag}
              </span>
              <p className="text-xs font-bold leading-tight line-clamp-2">
                {look.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
