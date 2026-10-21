import React from 'react';
import Link from 'next/link';
import { DEMO_BUSINESS_CONFIG } from '@/lib/data/demo-data';
import { Home, Sparkles, CheckCircle2 } from 'lucide-react';

export function BusinessInfoSection() {
  return (
    <section className="py-16 md:py-20 bg-[#F8F6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Modalities comparison */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9A34E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modalidades de Atención</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
              Pensado para Tu Comodidad y Estilo de Vida
            </h2>

            <p className="text-base text-[#6B6863] leading-relaxed">
              En ROSI STUDIO nos adaptamos a tus necesidades. Puedes visitarnos en nuestro espacio equipado o solicitar atención en la comodidad de tu hogar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Salón */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#E9E1D4]/60 flex items-center justify-center text-[#171717]">
                  <Sparkles className="w-5 h-5 text-[#C9A34E]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#171717]">
                  En Nuestro Local
                </h3>
                <p className="text-xs text-[#6B6863] leading-relaxed">
                  Disfruta de una atmósfera agradable, sillones ergonómicos, música relajante y herramientas de grado profesional esterilizadas.
                </p>
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                  Sin recargo adicional
                </div>
              </div>

              {/* Domicilio */}
              <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#E9E1D4]/60 flex items-center justify-center text-[#171717]">
                  <Home className="w-5 h-5 text-[#C9A34E]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#171717]">
                  A Domicilio
                </h3>
                <p className="text-xs text-[#6B6863] leading-relaxed">
                  Llevamos todos los implementos necesarios directamente a tu casa para sesiones de trenzas, cortes familiares o peinados de fiesta.
                </p>
                <div className="text-xs font-bold text-[#A5802C] bg-[#E9E1D4]/50 px-2.5 py-1 rounded-md inline-block">
                  Recargo referencial S/ {DEMO_BUSINESS_CONFIG.defaultHomeFee.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Location & Hygiene Guarantee */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] shadow-md space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A34E]">
                Compromiso de Calidad
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#171717]">
                ¿Por qué elegir ROSI STUDIO?
              </h3>
            </div>

            <ul className="space-y-3 text-sm text-[#171717]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A34E] shrink-0 mt-0.5" />
                <span>
                  <strong>Puntualidad y respeto por tu tiempo:</strong> Trabajamos bajo agenda para que no tengas que esperar innecesariamente.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A34E] shrink-0 mt-0.5" />
                <span>
                  <strong>Esterilización rigurosa:</strong> Limpieza y desinfección de navajas, tijeras, peines y herramientas entre cada cliente.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A34E] shrink-0 mt-0.5" />
                <span>
                  <strong>Asesoría personalizada:</strong> Te recomendamos el estilo, color o forma que mejor se armonice con tu rostro y textura capilar.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A34E] shrink-0 mt-0.5" />
                <span>
                  <strong>Aprobación guiada:</strong> Cada solicitud es verificada por la administradora para garantizar disponibilidad absoluta.
                </span>
              </li>
            </ul>

            <div className="pt-4 border-t border-[#E5E0D8]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#6B6863] block">Ubicación principal</span>
                  <span className="text-sm font-bold text-[#171717]">
                    {DEMO_BUSINESS_CONFIG.address}
                  </span>
                </div>
                <Link
                  href="/reservar"
                  className="px-5 py-2.5 rounded-full bg-[#C9A34E] hover:bg-[#A5802C] text-[#171717] font-bold text-xs shadow transition-all"
                >
                  Agendar Cita
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
