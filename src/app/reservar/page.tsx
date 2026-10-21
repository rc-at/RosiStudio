import React, { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { Calendar } from 'lucide-react';

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E1D4]/70 text-[#171717] text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#C9A34E]" />
              <span>Agenda Tu Experiencia</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
              Reserva tu Cita en ROSI STUDIO
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6863]">
              Sigue los sencillos pasos para elegir tus servicios, modalidad y horario preferido. Toda solicitud queda registrada para aprobación de la administradora.
            </p>
          </div>

          {/* Booking Flow Wizard wrapped in Suspense for useSearchParams */}
          <Suspense
            fallback={
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-[#C9A34E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-[#6B6863]">Cargando agenda de reservas...</p>
              </div>
            }
          >
            <BookingWizard />
          </Suspense>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
