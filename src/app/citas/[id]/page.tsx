'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { fetchAppointmentById } from '@/lib/firebase/firestore';
import { Appointment } from '@/types';
import { formatDateDisplay } from '@/lib/availability';
import { DEMO_BUSINESS_CONFIG } from '@/lib/data/demo-data';
import { Clock, CheckCircle2, XCircle, AlertCircle, Phone, ArrowLeft } from 'lucide-react';

function AppointmentDetailContent() {
  const params = useParams();
  const appointmentId = params?.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!appointmentId) return;
      try {
        const res = await fetchAppointmentById(appointmentId);
        setAppointment(res.appointment);
      } catch (err) {
        console.error('Error fetching appointment:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E0D8] shadow-sm">
        <div className="w-8 h-8 border-4 border-[#C9A34E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#6B6863]">Consultando estado de la cita...</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-[#E5E0D8] shadow-sm space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
        <h1 className="font-heading text-2xl font-bold text-[#171717]">
          Cita no encontrada
        </h1>
        <p className="text-xs text-[#6B6863]">
          No pudimos localizar la cita con el código <code>{appointmentId}</code>. Verifica que el identificador sea correcto.
        </p>
        <Link
          href="/reservar"
          className="inline-block px-5 py-2.5 rounded-full bg-[#171717] text-[#DFC27E] text-xs font-bold"
        >
          Solicitar una nueva cita
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-4">
        <div>
          <span className="text-[11px] font-mono text-[#6B6863] block">
            CÓDIGO: {appointment.id}
          </span>
          <h1 className="font-heading text-2xl font-bold text-[#171717]">
            Estado de tu Reserva
          </h1>
        </div>

        <div>
          {appointment.status === 'PENDIENTE' && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Pendiente de Aprobación</span>
            </span>
          )}
          {appointment.status === 'ACEPTADA' && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cita Confirmada</span>
            </span>
          )}
          {appointment.status === 'COMPLETADA' && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completada</span>
            </span>
          )}
          {appointment.status === 'RECHAZADA' && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300 inline-flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>Rechazada</span>
            </span>
          )}
          {appointment.status === 'CANCELADA' && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-300 inline-flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancelada</span>
            </span>
          )}
        </div>
      </div>

      {/* Status explanation */}
      <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5E0D8] text-xs space-y-1">
        {appointment.status === 'PENDIENTE' && (
          <p className="text-[#6B6863]">
            Tu solicitud está en revisión. La administradora de ROSI STUDIO verificará los detalles y te confirmará por WhatsApp o llamada al <strong>{appointment.clientPhone}</strong>.
          </p>
        )}
        {appointment.status === 'ACEPTADA' && (
          <p className="text-emerald-800 font-medium">
            ¡Tu cita está programada! Te esperamos el día seleccionado. Si solicitaste atención a domicilio, nuestro personal llegará a la hora indicada.
          </p>
        )}
      </div>

      {/* Details card */}
      <div className="space-y-3 text-xs sm:text-sm">
        <div className="flex justify-between py-1.5 border-b border-[#E5E0D8]">
          <span className="text-[#6B6863]">Cliente:</span>
          <span className="font-bold text-[#171717]">{appointment.clientName}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-[#E5E0D8]">
          <span className="text-[#6B6863]">Fecha:</span>
          <span className="font-bold text-[#171717]">
            {formatDateDisplay(appointment.date)}
          </span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-[#E5E0D8]">
          <span className="text-[#6B6863]">Horario:</span>
          <span className="font-bold text-[#171717]">
            {appointment.startTime} a {appointment.endTime} ({appointment.totalDurationMinutes} min)
          </span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-[#E5E0D8]">
          <span className="text-[#6B6863]">Modalidad:</span>
          <span className="font-bold text-[#171717]">
            {appointment.modality === 'DOMICILIO' ? 'Atención a Domicilio' : 'En el Local'}
          </span>
        </div>
        {appointment.address && (
          <div className="flex justify-between py-1.5 border-b border-[#E5E0D8]">
            <span className="text-[#6B6863]">Dirección:</span>
            <span className="font-medium text-[#171717] text-right">{appointment.address}</span>
          </div>
        )}
        <div className="pt-2">
          <span className="text-[#6B6863] font-bold block mb-1">Servicios:</span>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            {appointment.services.map((s) => (
              <li key={s.id} className="text-[#171717]">
                {s.name} — S/ {s.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between pt-3 border-t border-[#E5E0D8] text-base font-bold text-[#171717]">
          <span>Total Estimado:</span>
          <span className="text-[#A5802C]">S/ {appointment.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2">
        <a
          href={`https://wa.me/${DEMO_BUSINESS_CONFIG.whatsapp}?text=Hola%20Rosi%20Studio,%20quisiera%20consultar%20por%20mi%20cita%20${appointment.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span>Contactar con el salón por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

export default function AppointmentStatusPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B6863] hover:text-[#171717] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>

          <Suspense
            fallback={
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E0D8] shadow-sm">
                <div className="w-8 h-8 border-4 border-[#C9A34E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-[#6B6863]">Cargando información...</p>
              </div>
            }
          >
            <AppointmentDetailContent />
          </Suspense>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
