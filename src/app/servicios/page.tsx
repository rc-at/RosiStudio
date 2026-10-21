'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { DEMO_SERVICES } from '@/lib/data/demo-data';
import { ServiceCategory } from '@/types';
import { Clock, Scissors, ArrowRight, Sparkles, Search } from 'lucide-react';

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

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ServiceCategory>('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = DEMO_SERVICES.filter((service) => {
    const matchesCategory =
      selectedCategory === 'Todas' || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && service.active;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E9E1D4]/80 text-[#171717] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A34E]" />
              <span>Catálogo Profesional</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#171717] tracking-tight">
              Nuestros Servicios
            </h1>
            <p className="text-base text-[#6B6863] leading-relaxed">
              Explora nuestra carta de tratamientos capilares, barbería tradicional, trenzas de diseño y estética de uñas. Los precios y duraciones mostrados son referenciales de demostración.
            </p>
          </div>

          {/* Demo notice pill */}
          <div className="max-w-2xl mx-auto mb-8 bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-center text-xs text-amber-900">
            ℹ️ <strong>Información de demostración:</strong> Los precios, tiempos de atención y catálogo definitivo pueden ajustarse desde el panel de administración según las tarifas vigentes del salón.
          </div>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="w-4 h-4 text-[#6B6863] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar servicio (ej. corte, trenzas, balayage, manicure)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E5E0D8] bg-white text-xs text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#C9A34E] shadow-sm"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none justify-start md:justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                  selectedCategory === cat
                    ? 'bg-[#171717] text-[#DFC27E] border-[#171717] shadow-sm'
                    : 'bg-white text-[#171717] border-[#E5E0D8] hover:bg-[#E9E1D4]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E0D8] p-8 max-w-md mx-auto">
              <Scissors className="w-10 h-10 text-[#C9A34E] mx-auto mb-3" />
              <h2 className="font-heading text-lg font-bold text-[#171717]">
                No se encontraron servicios
              </h2>
              <p className="text-xs text-[#6B6863] mt-1">
                No hay servicios disponibles en esta categoría por el momento.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory('Todas')}
                className="mt-4 px-4 py-2 rounded-full bg-[#171717] text-white text-xs font-bold"
              >
                Ver todos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <article
                  key={service.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E5E0D8] hover:border-[#C9A34E]/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-52 w-full overflow-hidden bg-[#E9E1D4]">
                      {service.imageUrl && (
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[11px] font-bold text-[#171717] border border-[#E5E0D8] shadow-sm">
                        {service.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <h2 className="font-heading text-xl font-bold text-[#171717] leading-tight">
                        {service.name}
                      </h2>
                      <p className="text-xs text-[#6B6863] leading-relaxed">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-3 border-t border-[#E5E0D8]">
                        <span className="flex items-center gap-1.5 font-medium text-[#6B6863]">
                          <Clock className="w-4 h-4 text-[#C9A34E]" />
                          <span>{service.durationMinutes} minutos aprox.</span>
                        </span>
                        <div className="text-right">
                          <span className="text-[10px] text-[#6B6863] block">Desde</span>
                          <span className="text-lg font-bold text-[#171717]">
                            S/ {service.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA */}
                  <div className="p-6 pt-0">
                    <Link
                      href={`/reservar?service=${service.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C9A34E] hover:bg-[#A5802C] text-[#171717] font-bold text-xs shadow-sm transition-all duration-200"
                    >
                      <span>Seleccionar y Reservar</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
