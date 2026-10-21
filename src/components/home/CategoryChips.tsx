import React from 'react';
import Link from 'next/link';

interface CategoryItem {
  id: string;
  name: string;
  categoryQuery: string;
  icon: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'corte', name: 'Cortes', categoryQuery: 'Corte de cabello', icon: '✂️' },
  { id: 'trenzas', name: 'Trenzas', categoryQuery: 'Trenzas', icon: '🎀' },
  { id: 'manicure', name: 'Manicure', categoryQuery: 'Manicure', icon: '💅' },
  { id: 'pedicure', name: 'Pedicure', categoryQuery: 'Pedicure', icon: '🦶' },
  { id: 'tinte', name: 'Tintes', categoryQuery: 'Tinte', icon: '🎨' },
  { id: 'cejas', name: 'Cejas', categoryQuery: 'Diseño de cejas', icon: '👁️' },
  { id: 'peinados', name: 'Peinados', categoryQuery: 'Peinados', icon: '✨' },
  { id: 'otros', name: 'Tratamientos', categoryQuery: 'Otros servicios', icon: '💆' },
];

export function CategoryChips() {
  return (
    <section className="px-4 sm:px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-lg font-bold text-[#171717] tracking-tight">
          Categorías
        </h2>
        <Link
          href="/servicios"
          className="text-xs font-bold text-[#C9A34E] hover:underline"
        >
          Ver todas
        </Link>
      </div>

      {/* Horizontal scroll row on mobile, compact grid on larger screens */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 md:grid-cols-8">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/servicios?category=${encodeURIComponent(cat.categoryQuery)}`}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#E5E0D8] group-hover:border-[#C9A34E] shadow-sm flex items-center justify-center text-2xl transition-all duration-200 group-active:scale-95 group-hover:shadow-md">
              <span>{cat.icon}</span>
            </div>
            <span className="text-[11px] font-semibold text-[#171717] group-hover:text-[#A5802C] transition-colors text-center whitespace-nowrap">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
