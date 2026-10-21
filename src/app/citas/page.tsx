'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { fetchAppointments } from '@/lib/firebase/firestore';
import { Appointment, AppointmentStatus } from '@/types';
import { formatDateDisplay } from '@/lib/availability';
import { DEMO_BUSINESS_CONFIG } from '@/lib/data/demo-data';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Home,
  MessageCircle,
  Search,
  ArrowRight,
  Plus,
} from 'lucide-react';

type FilterTab = 'TODAS' | 'PENDIENTES' | 'CONFIRMADAS' | 'COMPLETADAS' | 'CANCELADAS';

export default function AppointmentsListPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterTab, setFilterTab] = useState<FilterTab>('TODAS');
  const [searchCode, setSearchCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchAppointments().then((res) => {
      if (active) {
        setAppointments(res.appointments);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredAppointments = appointments.filter((app) => {
    // Tab filter
    if (filterTab === 'PENDIENTES' && app.status !== 'PENDIENTE') return false;
    if (filterTab === 'CONFIRMADAS' && app.status !== 'ACEPTADA') return false;
    if (filterTab === 'COMPLETADAS' && app.status !== 'COMPLETADA') return false;
    if (filterTab === 'CANCELADAS' && app.status !== 'CANCELADA' && app.status !== 'RECHAZADA') return false;

    // Search filter
    if (searchCode.trim()) {
      const q = searchCode.toLowerCase().trim();
      return (
        app.id.toLowerCase().includes(q) ||
        app.clientName.toLowerCase().includes(q) ||
        app.clientPhone.includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'PENDIENTE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Por Confirmar</span>
          </span>
        );
      case 'ACEPTADA':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Confirmada</span>
          </span>
        );
      case 'COMPLETADA':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            <span>Completada</span>
          </span>
        );
      case 'RECHAZADA':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-600" />
            <span>Rechazada</span>
          </span>
        );
      case 'CANCELADA':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-300 inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-gray-600" />
            <span>Cancelada</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      <AppHeader />

      <main className="flex-1 px-4 sm:px-6 py-5 max-w-3xl mx-auto w-full space-y-4">
        {/* Title & Quick Action */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#171717] tracking-tight">
              Mis Citas
            </h1>
            <p className="text-xs text-[#6B6863]">
              Consulta el estado de tus reservas agendadas
            </p>
          </div>

          <Link
            href="/reservar"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C9A34E] text-[#171717] font-bold text-xs shadow-sm hover:bg-[#A5802C] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva cita</span>
          </Link>
        </div>

        {/* Code Search Input for Guest Users */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B6863] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código de cita (ej. cita-demo-101)..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E5E0D8] bg-white text-xs text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#C9A34E] shadow-sm"
          />
        </div>

        {/* Segmented Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {(
            [
              { key: 'TODAS', label: 'Todas' },
              { key: 'PENDIENTES', label: 'Por Confirmar' },
              { key: 'CONFIRMADAS', label: 'Confirmadas' },
              { key: 'COMPLETADAS', label: 'Completadas' },
              { key: 'CANCELADAS', label: 'Canceladas' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterTab(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                filterTab === tab.key
                  ? 'bg-[#171717] text-[#DFC27E] border-[#171717] shadow-sm'
                  : 'bg-white text-[#6B6863] border-[#E5E0D8] hover:bg-[#E9E1D4]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#E5E0D8] shadow-sm">
            <div className="w-7 h-7 border-3 border-[#C9A34E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#6B6863]">Cargando tus citas...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#E5E0D8] shadow-sm space-y-3">
            <Calendar className="w-10 h-10 text-[#C9A34E] mx-auto opacity-70" />
            <h2 className="font-heading text-base font-bold text-[#171717]">
              No tienes citas en esta sección
            </h2>
            <p className="text-xs text-[#6B6863] max-w-xs mx-auto">
              Cuando reserves un turno en el salón o a domicilio, podrás hacer seguimiento de su aprobación aquí.
            </p>
            <Link
              href="/reservar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171717] text-[#DFC27E] text-xs font-bold hover:bg-[#C9A34E] hover:text-[#171717] transition-colors"
            >
              <span>Agendar mi primera cita</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map((app) => (
              <article
                key={app.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E0D8] shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                {/* Header: Date, Time & Status */}
                <div className="flex items-start justify-between gap-2 border-b border-[#E5E0D8] pb-3">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] text-[#6B6863] block">
                      ID: {app.id}
                    </span>
                    <h3 className="font-bold text-sm text-[#171717] capitalize">
                      {formatDateDisplay(app.date)}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#6B6863]">
                      <Clock className="w-3.5 h-3.5 text-[#C9A34E]" />
                      <span>{app.startTime} - {app.endTime} ({app.totalDurationMinutes} min)</span>
                    </div>
                  </div>

                  <div>{getStatusBadge(app.status)}</div>
                </div>

                {/* Services summary */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#6B6863] tracking-wider block">
                    Servicios:
                  </span>
                  <div className="space-y-1">
                    {app.services.map((s) => (
                      <div key={s.id} className="flex justify-between text-[#171717]">
                        <span className="font-medium">{s.name}</span>
                        <span className="font-semibold">S/ {s.price.toFixed(2)}</span>
                      </div>
                    ))}
                    {app.modality === 'DOMICILIO' && (
                      <div className="flex justify-between text-purple-800 text-[11px] pt-1 border-t border-dashed border-[#E5E0D8]">
                        <span className="flex items-center gap-1">
                          <Home className="w-3 h-3" />
                          <span>Atención a domicilio ({app.address || 'Domicilio'})</span>
                        </span>
                        <span className="font-bold">+ S/ {app.homeServiceFee.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total and Actions */}
                <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#6B6863] block">Total Estimado</span>
                    <span className="text-base font-bold text-[#171717]">
                      S/ {app.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${DEMO_BUSINESS_CONFIG.whatsapp}?text=Hola%20Rosi%20Studio,%20quisiera%20consultar%20por%20mi%20cita%20${app.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      title="Consultar por WhatsApp"
                      aria-label="Consultar cita por WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    <Link
                      href={`/citas/${app.id}`}
                      className="px-3 py-2 rounded-xl bg-[#F8F6F2] hover:bg-[#E9E1D4]/50 text-[#171717] text-xs font-bold border border-[#E5E0D8] transition-colors"
                    >
                      Ver estado
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
      <WhatsAppButton />
    </div>
  );
}
