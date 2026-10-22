'use client';

import React, { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { DEMO_PRODUCTS } from '@/lib/data/demo-data';
import { ProductCategory } from '@/types';
import { Check } from 'lucide-react';

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
      <AppHeader />

      <main className="flex-1 px-4 sm:px-6 py-5 max-w-7xl mx-auto w-full space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight">
            Catálogo de Productos
          </h1>
          <p className="text-xs text-[#6B6863]">
            Ceras, fijadores, tintes y aceites de primera línea disponibles directamente en nuestro salón
          </p>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {PRODUCT_CATEGORIES.map((cat) => (
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredProducts.map((prod) => (
            <article
              key={prod.id}
              className="bg-white rounded-2xl p-4 border border-[#E5E0D8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[#F8F6F2] mb-3">
                  {prod.imageUrl && (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-[#171717] border border-[#E5E0D8]">
                    {prod.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    {prod.brand && (
                      <span className="text-[10px] font-medium text-[#6B6863]">
                        {prod.brand}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      <span>Disponible</span>
                    </span>
                  </div>

                  <h2 className="font-heading text-base font-bold text-[#171717] leading-snug">
                    {prod.name}
                  </h2>
                  <p className="text-xs text-[#6B6863] leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5E0D8] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6B6863] block">Precio</span>
                  <span className="text-base font-bold text-[#171717]">
                    S/ {prod.price.toFixed(2)}
                  </span>
                </div>

                <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-[#F8F6F2] border border-[#E5E0D8] text-[#171717] text-xs font-semibold">
                  En salón
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
