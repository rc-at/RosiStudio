import React from 'react';
import Link from 'next/link';
import { DEMO_BUSINESS_CONFIG } from '@/lib/data/demo-data';
import { MapPin, Clock, Calendar } from 'lucide-react';

export function CompactSalonInfo() {
  return (
    <section className="px-4 sm:px-6 py-4 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E0D8] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A34E]">
              Atención y Modalidades
            </span>
            <h2 className="font-heading text-lg font-bold text-[#171717]">
              En Salón o a Domicilio
            </h2>
          </div>

          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              Salón equipado
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E9E1D4]/60 text-[#171717] text-[11px] font-bold border border-[#E5E0D8]">
              A domicilio (+S/ 15)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#F8F6F2] border border-[#E5E0D8]">
            <MapPin className="w-4 h-4 text-[#C9A34E] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-[#171717] block">Local Principal</span>
              <span className="text-[#6B6863] text-[11px] block">{DEMO_BUSINESS_CONFIG.address}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#F8F6F2] border border-[#E5E0D8]">
            <Clock className="w-4 h-4 text-[#C9A34E] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-[#171717] block">Horarios Habituales</span>
              <span className="text-[#6B6863] text-[11px] block">Lunes a Sábado: 09:00 - 20:30 (Domingos cerrado)</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/reservar"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#171717] hover:bg-[#C9A34E] text-[#DFC27E] hover:text-[#171717] text-xs font-bold transition-all text-center flex items-center justify-center gap-2 shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar mi cita ahora</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
