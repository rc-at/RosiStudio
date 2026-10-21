'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { DEMO_BUSINESS_CONFIG } from '@/lib/data/demo-data';

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${DEMO_BUSINESS_CONFIG.whatsapp}?text=Hola%20ROSI%20STUDIO,%20quisiera%20hacer%20una%20consulta%20sobre%20sus%20servicios%20y%20citas`;

  return (
    <aside aria-label="Contacto directo por WhatsApp" className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Contactar a ROSI STUDIO por WhatsApp"
      >
        <MessageCircle className="w-6 h-6 shrink-0 fill-current" />
        <span className="hidden sm:inline-block text-xs font-bold tracking-wide">
          ¿Dudas? Escríbenos
        </span>
      </a>
    </aside>
  );
}
