'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { DEMO_PRODUCTS } from '@/lib/data/demo-data';
import { ProductCategory } from '@/types';
import { ShoppingBag, MessageCircle, Check } from 'lucide-react';

const PRODUCT_CATEGORIES: ('Todas' | ProductCategory)[] = [
  'Todas',
  'Gel para hombre',
  'Tinte',
  'Peines',
  'Productos capilares',
  'Cuidado de uñas',
  'Artículos de belleza',
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ProductCategory>('Todas');

  const filteredProducts = DEMO_PRODUCTS.filter((prod) => {
    if (selectedCategory === 'Todas') return true;
    return prod.category === selectedCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E9E1D4]/80 text-[#171717] text-xs font-bold uppercase tracking-wider">
              <ShoppingBag className="w-3.5 h-3.5 text-[#C9A34E]" />
              <span>Cuidado Personal & Barbería</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#171717] tracking-tight">
              Catálogo de Productos
            </h1>
            <p className="text-base text-[#6B6863] leading-relaxed">
              Descubre nuestra selección de fijadores, ceras de acabado mate, tintes profesionales, aceites nutritivos y peines de precisión para mantener tu estilo cada día.
            </p>
          </div>

          {/* Informative notice */}
          <div className="max-w-2xl mx-auto mb-8 bg-[#E9E1D4]/50 border border-[#E5E0D8] rounded-xl p-4 text-center text-xs text-[#171717] space-y-1">
            <p className="font-semibold">
              🛍️ Catálogo informativo y venta directa en salón o a domicilio
            </p>
            <p className="text-[#6B6863]">
              Para adquirir o separar cualquier producto, puedes consultarnos directamente por WhatsApp o solicitarlo para tu próxima cita agendada.
            </p>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none justify-start md:justify-center">
            {PRODUCT_CATEGORIES.map((cat) => (
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

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <article
                key={prod.id}
                className="bg-white rounded-2xl p-5 border border-[#E5E0D8] hover:border-[#C9A34E]/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-52 w-full rounded-xl overflow-hidden bg-[#F8F6F2] mb-4 border border-[#E5E0D8]/60">
                    {prod.imageUrl && (
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#171717] border border-[#E5E0D8] shadow-sm uppercase tracking-wider">
                      {prod.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      {prod.brand && (
                        <span className="text-[11px] font-medium text-[#6B6863]">
                          {prod.brand}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        <span>En stock ({prod.stockCount ?? 10} disp.)</span>
                      </span>
                    </div>

                    <h2 className="font-heading text-lg font-bold text-[#171717] leading-snug">
                      {prod.name}
                    </h2>
                    <p className="text-xs text-[#6B6863] leading-relaxed">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E0D8] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#6B6863] block">Precio</span>
                    <span className="text-xl font-bold text-[#171717]">
                      S/ {prod.price.toFixed(2)}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/51987654321?text=Hola%20ROSI%20STUDIO,%20deseo%20consultar%20por%20el%20producto:%20${encodeURIComponent(prod.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Consultar</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
