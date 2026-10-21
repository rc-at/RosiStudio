'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { DEMO_SERVICES } from '@/lib/data/demo-data';
import { ServiceCategory } from '@/types';
import { Clock, Scissors, ArrowRight, Search } from 'lucide-react';

const CATEGORIES: ('Todas' | ServiceCategory)[] = [
  'Todas',
  'Corte de cabello',
  'Trenzas',
  'Manicure',
  'Pedicure',
  'Tinte',
  'Peinados',
  'Diseño de cejas',
  'Otros servicios',
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as ServiceCategory | null;

  const [prevCategoryParam, setPrevCategoryParam] = useState(categoryParam);
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ServiceCategory>(
    categoryParam && CATEGORIES.includes(categoryParam) ? categoryParam : 'Todas'
  );
  const [searchQuery, setSearchQuery] = useState('');

  if (categoryParam !== prevCategoryParam) {
    setPrevCategoryParam(categoryParam);
    setSelectedCategory(
      categoryParam && CATEGORIES.includes(categoryParam) ? categoryParam : 'Todas'
    );
  }

  const filteredServices = DEMO_SERVICES.filter((service) => {
    const matchesCategory =
      selectedCategory === 'Todas' || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && service.active;
  });

  return (
    <main className="flex-1 px-4 sm:px-6 py-5 max-w-7xl mx-auto w-full space-y-4">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight">
          Nuestros Servicios
        </h1>
        <p className="text-xs text-[#6B6863]">
          Elige los tratamientos para tu próxima sesión en salón o a domicilio
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#6B6863] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por nombre o descripción (corte, trenzas, balayage)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E5E0D8] bg-white text-xs text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#C9A34E] shadow-sm"
        />
      </div>

      {/* Category Filter Pills (Horizontal scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-[#171717] text-[#DFC27E] border-[#171717] shadow-sm font-bold'
                : 'bg-white text-[#6B6863] border-[#E5E0D8] hover:bg-[#E9E1D4]/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid (Compact cards) */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#E5E0D8] p-6 max-w-md mx-auto space-y-2">
          <Scissors className="w-8 h-8 text-[#C9A34E] mx-auto opacity-70" />
          <h2 className="font-heading text-base font-bold text-[#171717]">
            No encontramos servicios
          </h2>
          <p className="text-xs text-[#6B6863]">
            No hay resultados para esta búsqueda o categoría.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Todas');
              setSearchQuery('');
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-[#171717] text-[#DFC27E] text-xs font-bold"
          >
            Ver todos los servicios
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredServices.map((service) => (
            <article
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E5E0D8] hover:border-[#C9A34E]/60 shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden bg-[#E9E1D4]">
                  {service.imageUrl && (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-[#171717] border border-[#E5E0D8]">
                    {service.category}
                  </span>
                </div>

                <div className="p-3.5 space-y-1.5">
                  <h2 className="font-heading text-base font-bold text-[#171717] leading-snug">
                    {service.name}
                  </h2>
                  <p className="text-xs text-[#6B6863] leading-relaxed line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E5E0D8]">
                    <span className="flex items-center gap-1 font-medium text-[#6B6863] text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-[#C9A34E]" />
                      <span>{service.durationMinutes} min</span>
                    </span>
                    <span className="text-base font-bold text-[#171717]">
                      S/ {service.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 pt-0">
                <Link
                  href={`/reservar?service=${service.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#C9A34E] hover:bg-[#A5802C] text-[#171717] font-bold text-xs shadow-sm transition-colors active:scale-98"
                >
                  <span>Reservar este servicio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      <AppHeader />

      <Suspense
        fallback={
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-[#C9A34E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#6B6863]">Cargando catálogo...</p>
          </div>
        }
      >
        <ServicesContent />
      </Suspense>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  );
}
