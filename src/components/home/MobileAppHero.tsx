import React from 'react';
import Link from 'next/link';
import { Calendar, Sparkles, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { DEMO_BUSINESS_CONFIG } from '@/lib/data/demo-data';

export function MobileAppHero() {
  return (
    <section className="px-4 sm:px-6 pt-4 pb-2 max-w-7xl mx-auto">
      {/* App Greeting & Headline */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#C9A34E] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hola, bienvenida/o</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight leading-tight">
            Tu belleza, <span className="text-[#A5802C] italic font-serif">tu momento.</span>
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E9E1D4]/60 text-xs text-[#171717] font-medium border border-[#E5E0D8]">
          <MapPin className="w-3.5 h-3.5 text-[#C9A34E]" />
          <span>{DEMO_BUSINESS_CONFIG.city}, Perú</span>
        </div>
      </div>

      {/* Primary Action Card (App-style Hero Card) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#171717] via-[#24221E] to-[#171717] text-white p-5 sm:p-7 shadow-lg border border-[#C9A34E]/40">
        {/* Subtle decorative gold sheen background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A34E]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[11px] font-semibold text-[#DFC27E] border border-[#C9A34E]/30">
              <Sparkles className="w-3 h-3 text-[#C9A34E]" />
              <span>Agenda tu turno hoy</span>
            </span>
            <span className="text-xs text-white/70 font-medium">
              Salón & Domicilio
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide leading-snug">
              Renueva tu estilo con los mejores especialistas
            </h2>
            <p className="text-xs text-[#E9E1D4]/80 leading-relaxed max-w-xl">
              Cortes modernos, trenzas artísticas, manicure spa, coloración y peinados. Turnos guiados con confirmación inmediata.
            </p>
          </div>

          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/reservar"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#C9A34E] hover:bg-[#A5802C] text-[#171717] font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4 text-[#171717]" />
              <span>Reservar una cita</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              href="/servicios"
              className="inline-flex items-center justify-center px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition-colors"
            >
              <span>Ver servicios</span>
            </Link>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/70">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A34E]" />
              <span>100% esterilizado</span>
            </span>
            <span>•</span>
            <span>Sin esperas innecesarias</span>
            <span>•</span>
            <span className="text-[#DFC27E] font-bold">4.9 ★ Valoración</span>
          </div>
        </div>
      </div>
    </section>
  );
}
