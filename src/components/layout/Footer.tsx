'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { DEMO_BUSINESS_CONFIG, DEMO_BUSINESS_HOURS } from '@/lib/data/demo-data';
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#171717] text-[#E9E1D4] border-t-4 border-[#C9A34E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Presentation */}
          <div className="space-y-4">
            <BrandLogo size="lg" className="[&_span]:text-white [&_span.text-\[\#C9A34E\]]:text-[#C9A34E]" />
            <p className="text-sm text-[#E9E1D4]/80 leading-relaxed pt-2">
              Dedicados al cuidado capilar, estilismo moderno, barbería de precisión, trenzas artísticas y tratamientos integrales de belleza. Tu confianza es nuestra mayor inspiración.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-[#C9A34E]/30 text-xs text-[#DFC27E]">
              <span>✨ Atención en local y a domicilio</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white tracking-wide mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-[#C9A34E] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-[#C9A34E] transition-colors">
                  Catálogo de Servicios
                </Link>
              </li>
              <li>
                <Link href="/productos" className="hover:text-[#C9A34E] transition-colors">
                  Productos Capilares y Barbería
                </Link>
              </li>
              <li>
                <Link href="/reservar" className="hover:text-[#C9A34E] transition-colors font-medium text-[#DFC27E]">
                  Reservar una Cita
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#C9A34E] transition-colors text-xs opacity-75">
                  Acceso Administradora
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white tracking-wide mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C9A34E]" />
              <span>Horarios de Atención</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-[#E9E1D4]/80">
              {DEMO_BUSINESS_HOURS.map((h) => (
                <li key={h.dayOfWeek} className="flex justify-between py-1 border-b border-white/5">
                  <span>{h.dayName}:</span>
                  <span className="font-medium text-white">
                    {h.isOpen ? `${h.openTime} - ${h.closeTime}` : 'Cerrado'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact and Location */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white tracking-wide mb-4">
              Ubicación y Contacto
            </h3>
            <div className="space-y-3 text-sm text-[#E9E1D4]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C9A34E] shrink-0 mt-1" />
                <span>{DEMO_BUSINESS_CONFIG.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C9A34E] shrink-0" />
                <span>{DEMO_BUSINESS_CONFIG.phone}</span>
              </div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${DEMO_BUSINESS_CONFIG.whatsapp}?text=Hola%20Rosi%20Studio,%20quisiera%20consultar%20sobre%20sus%20servicios`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-xs shadow transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contactar por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E9E1D4]/60 gap-4">
          <p>© 2026 ROSI STUDIO. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Diseñado para resaltar tu belleza con excelencia
          </p>
        </div>
      </div>
    </footer>
  );
}
