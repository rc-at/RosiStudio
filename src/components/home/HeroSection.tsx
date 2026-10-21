import React from 'react';
import Link from 'next/link';
import { Calendar, Sparkles, Scissors } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#DFC27E]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9E1D4]/70 border border-[#C9A34E]/30 text-xs font-semibold text-[#171717] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A34E]" />
              <span>ROSI STUDIO • Expertos en Belleza</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#171717] tracking-tight leading-[1.15]">
              Tu belleza, <br />
              <span className="text-[#C9A34E] italic font-serif">tu momento.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6B6863] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Descubre una experiencia de estilismo integral con cortes modernos de barbería y salón, trenzas exclusivas, manicure spa, coloración y peinados. Atendemos en nuestro local y con servicio a domicilio para tu máxima comodidad.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/reservar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#C9A34E] hover:bg-[#A5802C] text-[#171717] font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-5 h-5 text-[#171717]" />
                <span>Reservar una cita</span>
              </Link>

              <Link
                href="/servicios"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#E9E1D4]/40 text-[#171717] font-semibold text-base border border-[#E5E0D8] transition-colors"
              >
                <Scissors className="w-4 h-4 text-[#C9A34E]" />
                <span>Ver catálogo de servicios</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[#E5E0D8] grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="space-y-1">
                <span className="block font-heading text-xl font-bold text-[#171717]">
                  100%
                </span>
                <span className="block text-xs text-[#6B6863]">
                  Higiene y Esterilización
                </span>
              </div>
              <div className="space-y-1">
                <span className="block font-heading text-xl font-bold text-[#171717]">
                  Local & Móvil
                </span>
                <span className="block text-xs text-[#6B6863]">
                  Citas en Salón o Domicilio
                </span>
              </div>
              <div className="space-y-1">
                <span className="block font-heading text-xl font-bold text-[#171717]">
                  4.9 ★
                </span>
                <span className="block text-xs text-[#6B6863]">
                  Satisfacción de Clientes
                </span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Side */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative gold frame */}
              <div className="absolute -inset-3 rounded-3xl border border-[#C9A34E]/30 bg-gradient-to-tr from-[#E9E1D4]/40 to-transparent transform rotate-1 pointer-events-none" />

              {/* Main Image Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white border border-[#E5E0D8]">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
                  alt="Estilismo y belleza profesional en Rosi Studio"
                  className="w-full h-[400px] sm:h-[480px] object-cover"
                />

                {/* Floating pill badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#E5E0D8] shadow-lg flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-[#171717]">
                      Agenda tu espacio hoy
                    </p>
                    <p className="text-[11px] text-[#6B6863]">
                      Confirmación rápida por la administradora
                    </p>
                  </div>
                  <Link
                    href="/reservar"
                    className="px-3.5 py-1.5 rounded-lg bg-[#171717] hover:bg-[#C9A34E] text-white hover:text-[#171717] text-xs font-bold transition-colors"
                  >
                    Elegir horario
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
