import React, { Suspense } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { BookingWizard } from '@/components/booking/BookingWizard';

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      <AppHeader />

      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-8 max-w-4xl mx-auto w-full">
        {/* Compact App Header */}
        <div className="mb-4 sm:mb-6 text-center sm:text-left">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A34E] block">
            Reserva de Citas
          </span>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#171717]">
            Agenda tu Turno en ROSI STUDIO
          </h1>
          <p className="text-xs text-[#6B6863]">
            Personaliza tus servicios, elige salón o domicilio y selecciona tu horario disponible.
          </p>
        </div>

        {/* Booking Flow Wizard wrapped in Suspense for useSearchParams */}
        <Suspense
          fallback={
            <div className="py-20 text-center bg-white rounded-3xl border border-[#E5E0D8] p-8">
              <div className="w-8 h-8 border-3 border-[#C9A34E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-[#6B6863]">Cargando agenda...</p>
            </div>
          }
        >
          <BookingWizard />
        </Suspense>
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  );
}
