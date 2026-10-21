import React from 'react';
import Link from 'next/link';
import { DEMO_PRODUCTS } from '@/lib/data/demo-data';
import { ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';

export function ProductsTeaser() {
  const previewProducts = DEMO_PRODUCTS.slice(0, 3);

  return (
    <section className="py-16 md:py-20 bg-white border-t border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9A34E]">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cuidado y Mantenimiento</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
              Productos Profesionales
            </h2>
            <p className="text-sm sm:text-base text-[#6B6863]">
              Extiende el resultado de tu sesión con ceras de fijación, aceites capilares, tintes y herramientas profesionales disponibles en nuestro salón.
            </p>
          </div>

          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#171717] hover:text-[#C9A34E] group transition-colors"
          >
            <span>Ver catálogo completo ({DEMO_PRODUCTS.length} productos)</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewProducts.map((prod) => (
            <article
              key={prod.id}
              className="bg-[#F8F6F2] rounded-2xl p-5 border border-[#E5E0D8] hover:border-[#C9A34E]/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full rounded-xl overflow-hidden bg-white mb-4 border border-[#E5E0D8]/60">
                  {prod.imageUrl && (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#C9A34E] uppercase tracking-wider text-[10px]">
                      {prod.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                      Disponible
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-[#171717] line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-[#6B6863] line-clamp-2">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E5E0D8] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6B6863] block">Precio referencial</span>
                  <span className="text-lg font-bold text-[#171717]">
                    S/ {prod.price.toFixed(2)}
                  </span>
                </div>

                <a
                  href={`https://wa.me/51987654321?text=Hola%20Rosi%20Studio,%20quisiera%20consultar%20por%20el%20producto:%20${encodeURIComponent(prod.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#E9E1D4]/60 text-[#171717] text-xs font-semibold border border-[#E5E0D8] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Consultar</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
