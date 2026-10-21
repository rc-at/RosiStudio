'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/layout/BrandLogo';
import {
  Appointment,
  AppointmentStatus,
  AdminUser,
} from '@/types';
import {
  DEMO_BUSINESS_CONFIG,
  DEMO_BUSINESS_HOURS,
  DEMO_SERVICES,
} from '@/lib/data/demo-data';
import {
  fetchAppointments,
  updateAppointmentStatus,
} from '@/lib/firebase/firestore';
import {
  signInWithGoogle,
  signOut,
  subscribeToAuth,
} from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Check,
  X,
  Phone,
  Home,
  LogOut,
  LogIn,
  Settings,
  Scissors,
  Eye,
  RefreshCw,
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'schedules' | 'services' | 'settings'>('appointments');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const todayStr = mounted ? new Date().toISOString().split('T')[0] : '2026-10-22';
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | 'TODAS'>('TODAS');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // Confirmation modal state
  const [pendingAction, setPendingAction] = useState<{
    appointmentId: string;
    action: AppointmentStatus;
    label: string;
  } | null>(null);

  // Subscribe to auth
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const reloadAppointments = async () => {
    try {
      const res = await fetchAppointments();
      setAppointments(res.appointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  useEffect(() => {
    let active = true;
    fetchAppointments().then((res) => {
      if (active) {
        setAppointments(res.appointments);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleLogin = async () => {
    try {
      const res = await signInWithGoogle();
      if (res.user) {
        setCurrentUser({
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName,
          photoURL: res.user.photoURL,
          isAdmin: res.isAdmin,
        });
      }
    } catch (err) {
      console.error('Error durante el inicio de sesión:', err);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentUser(null);
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    try {
      await updateAppointmentStatus(pendingAction.appointmentId, pendingAction.action);
      setActionSuccessMessage(`Cita actualizada a estado: ${pendingAction.action}`);
      setTimeout(() => setActionSuccessMessage(''), 4000);

      // Refresh local list
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === pendingAction.appointmentId
            ? { ...a, status: pendingAction.action, updatedAt: new Date().toISOString() }
            : a
        )
      );

      if (selectedAppointment && selectedAppointment.id === pendingAction.appointmentId) {
        setSelectedAppointment((prev) =>
          prev ? { ...prev, status: pendingAction.action } : null
        );
      }
    } catch (err) {
      console.error('Error actualizando cita:', err);
    } finally {
      setPendingAction(null);
    }
  };

  // Metrics
  const pendingCount = appointments.filter((a) => a.status === 'PENDIENTE').length;
  const acceptedCount = appointments.filter((a) => a.status === 'ACEPTADA').length;
  const todayCount = appointments.filter((a) => a.date === todayStr && a.status !== 'CANCELADA').length;
  const totalRevenue = appointments
    .filter((a) => a.status === 'ACEPTADA' || a.status === 'COMPLETADA')
    .reduce((sum, a) => sum + a.totalPrice, 0);

  // Filtered list
  const filteredAppointments = appointments.filter((app) => {
    const matchesStatus =
      selectedStatus === 'TODAS' || app.status === selectedStatus;
    const matchesQuery =
      app.clientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.clientPhone.includes(searchFilter) ||
      app.id.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'PENDIENTE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Pendiente
          </span>
        );
      case 'ACEPTADA':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Aceptada
          </span>
        );
      case 'COMPLETADA':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            Completada
          </span>
        );
      case 'RECHAZADA':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
            Rechazada
          </span>
        );
      case 'CANCELADA':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-300">
            Cancelada
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col">
      {/* Admin Top Bar */}
      <header className="bg-[#171717] text-white border-b-2 border-[#C9A34E] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-90">
              <BrandLogo size="sm" className="[&_span]:text-white [&_span.text-\[\#C9A34E\]]:text-[#C9A34E]" />
            </Link>
            <div className="hidden sm:block border-l border-white/20 pl-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#DFC27E] block">
                Panel de Administración
              </span>
              <span className="text-[10px] text-white/60">
                Zona Horaria: {DEMO_BUSINESS_CONFIG.timezone}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-[#E9E1D4]/80 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-colors"
            >
              Ver Web Pública
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#DFC27E] font-medium hidden md:inline">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Cerrar sesión administrativa"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="px-4 py-1.5 rounded-lg bg-[#C9A34E] hover:bg-[#A5802C] text-[#171717] text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Acceder con Google</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Demo status alert banner if Firebase is not yet connected */}
      {!isFirebaseConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-300 text-amber-950 px-4 py-2 text-center text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Modo Demostración Activo:</strong> Firebase aún no está conectado con credenciales en <code>.env.local</code>. Los cambios de citas se reflejan en la memoria local para pruebas y revisión de interfaz.
          </span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <nav aria-label="Secciones del panel de administración" className="flex border-b border-[#E5E0D8] space-x-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'border-[#C9A34E] text-[#171717]'
                : 'border-transparent text-[#6B6863] hover:text-[#171717]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#C9A34E]" />
            <span>Citas & Dashboard</span>
            {pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedules')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'schedules'
                ? 'border-[#C9A34E] text-[#171717]'
                : 'border-transparent text-[#6B6863] hover:text-[#171717]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#C9A34E]" />
            <span>Horarios y No Laborables</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'services'
                ? 'border-[#C9A34E] text-[#171717]'
                : 'border-transparent text-[#6B6863] hover:text-[#171717]'
            }`}
          >
            <Scissors className="w-4 h-4 text-[#C9A34E]" />
            <span>Gestión de Servicios</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#C9A34E] text-[#171717]'
                : 'border-transparent text-[#6B6863] hover:text-[#171717]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#C9A34E]" />
            <span>Configuración del Negocio</span>
          </button>
        </nav>

        {/* Success toast */}
        {actionSuccessMessage && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionSuccessMessage('')}
              className="text-emerald-700 hover:text-emerald-950 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* TAB 1: Appointments & Dashboard */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-[#C9A34E] uppercase tracking-wider block">
                  Por Aprobar
                </span>
                <span className="font-heading text-3xl font-bold text-[#171717]">
                  {pendingCount}
                </span>
                <span className="text-[11px] text-[#6B6863] block">
                  Solicitudes pendientes
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Citas Aceptadas
                </span>
                <span className="font-heading text-3xl font-bold text-[#171717]">
                  {acceptedCount}
                </span>
                <span className="text-[11px] text-[#6B6863] block">
                  Confirmadas en agenda
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-[#171717] uppercase tracking-wider block">
                  Citas de Hoy
                </span>
                <span className="font-heading text-3xl font-bold text-[#171717]">
                  {todayCount}
                </span>
                <span className="text-[11px] text-[#6B6863] block">
                  Fecha {todayStr}
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-[#A5802C] uppercase tracking-wider block">
                  Ingresos Estimados
                </span>
                <span className="font-heading text-3xl font-bold text-[#171717]">
                  S/ {totalRevenue.toFixed(2)}
                </span>
                <span className="text-[11px] text-[#6B6863] block">
                  Aceptadas y completadas
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E5E0D8] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Status pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {(['TODAS', 'PENDIENTE', 'ACEPTADA', 'COMPLETADA', 'RECHAZADA', 'CANCELADA'] as const).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStatus(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        selectedStatus === st
                          ? 'bg-[#171717] text-[#DFC27E]'
                          : 'bg-[#F8F6F2] text-[#6B6863] hover:bg-[#E9E1D4]/50'
                      }`}
                    >
                      {st === 'TODAS' ? 'Todas las Citas' : st}
                    </button>
                  )
                )}
              </div>

              {/* Search & Refresh */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-3.5 h-3.5 text-[#6B6863] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente, teléfono o ID..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#E5E0D8] focus:outline-none focus:ring-1 focus:ring-[#C9A34E]"
                  />
                </div>

                <button
                  type="button"
                  onClick={reloadAppointments}
                  className="p-2 rounded-xl border border-[#E5E0D8] hover:bg-[#E9E1D4]/40 text-[#171717]"
                  title="Recargar citas"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Appointments Cards List */}
            <div className="md:hidden space-y-3">
              {filteredAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-[#E5E0D8] text-center text-xs text-[#6B6863]">
                  No se encontraron citas con los filtros seleccionados.
                </div>
              ) : (
                filteredAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl p-4 border border-[#E5E0D8] shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-[#E5E0D8] pb-2.5">
                      <div>
                        <span className="font-mono text-[10px] text-[#6B6863] block">
                          {app.id}
                        </span>
                        <h3 className="font-bold text-sm text-[#171717]">
                          {app.clientName}
                        </h3>
                        <a
                          href={`tel:${app.clientPhone}`}
                          className="text-xs text-[#C9A34E] font-semibold flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{app.clientPhone}</span>
                        </a>
                      </div>
                      <div>{getStatusBadge(app.status)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-[#6B6863] block">Fecha & Hora</span>
                        <span className="font-medium text-[#171717]">{app.date}</span>
                        <span className="block text-[11px] text-[#6B6863]">{app.startTime} - {app.endTime}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#6B6863] block">Modalidad</span>
                        <span className="font-medium text-[#171717]">
                          {app.modality === 'DOMICILIO' ? 'A Domicilio' : 'En Local'}
                        </span>
                        <span className="block text-xs font-bold text-[#A5802C]">
                          Total: S/ {app.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-[#6B6863] border-t border-dashed border-[#E5E0D8] pt-2">
                      <span className="font-bold text-[#171717]">Servicios: </span>
                      <span>{app.services.map((s) => s.name).join(', ')}</span>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAppointment(app)}
                        className="px-3 py-1.5 rounded-xl border border-[#E5E0D8] text-xs font-bold text-[#171717] hover:bg-[#E9E1D4]/40 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detalles</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {app.status === 'PENDIENTE' && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setPendingAction({
                                  appointmentId: app.id,
                                  action: 'ACEPTADA',
                                  label: 'Aceptar y confirmar solicitud',
                                })
                              }
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Aceptar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setPendingAction({
                                  appointmentId: app.id,
                                  action: 'RECHAZADA',
                                  label: 'Rechazar solicitud',
                                })
                              }
                              className="px-2.5 py-1.5 rounded-xl bg-red-100 text-red-800 text-xs font-bold flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Rechazar</span>
                            </button>
                          </>
                        )}

                        {app.status === 'ACEPTADA' && (
                          <button
                            type="button"
                            onClick={() =>
                              setPendingAction({
                                appointmentId: app.id,
                                action: 'COMPLETADA',
                                label: 'Marcar cita como completada',
                              })
                            }
                            className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Completar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Appointments Table */}
            <div className="hidden md:block bg-white rounded-2xl border border-[#E5E0D8] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E0D8] bg-[#F8F6F2] text-[11px] font-bold text-[#6B6863] uppercase tracking-wider">
                      <th className="py-3 px-4">Código / Cliente</th>
                      <th className="py-3 px-4">Fecha y Horario</th>
                      <th className="py-3 px-4">Modalidad</th>
                      <th className="py-3 px-4">Servicios</th>
                      <th className="py-3 px-4 text-right">Total</th>
                      <th className="py-3 px-4 text-center">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0D8] text-xs">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#6B6863]">
                          No se encontraron citas con los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((app) => (
                        <tr
                          key={app.id}
                          className="hover:bg-[#F8F6F2]/60 transition-colors"
                        >
                          {/* Cliente */}
                          <td className="py-3 px-4">
                            <span className="font-mono text-[10px] text-[#6B6863] block">
                              {app.id}
                            </span>
                            <span className="font-bold text-[#171717] block">
                              {app.clientName}
                            </span>
                            <a
                              href={`tel:${app.clientPhone}`}
                              className="text-[11px] text-[#C9A34E] hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{app.clientPhone}</span>
                            </a>
                          </td>

                          {/* Fecha */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-semibold text-[#171717] block">
                              {app.date}
                            </span>
                            <span className="text-[11px] text-[#6B6863] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#C9A34E]" />
                              <span>{app.startTime} - {app.endTime}</span>
                            </span>
                          </td>

                          {/* Modalidad */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                app.modality === 'DOMICILIO'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {app.modality === 'DOMICILIO' ? (
                                <>
                                  <Home className="w-3 h-3" />
                                  <span>Domicilio</span>
                                </>
                              ) : (
                                <span>En Local</span>
                              )}
                            </span>
                            {app.address && (
                              <span className="block text-[10px] text-[#6B6863] max-w-xs truncate mt-0.5" title={app.address}>
                                {app.address}
                              </span>
                            )}
                          </td>

                          {/* Servicios */}
                          <td className="py-3 px-4 max-w-xs">
                            <span className="font-medium text-[#171717] block truncate">
                              {app.services.map((s) => s.name).join(', ')}
                            </span>
                            <span className="text-[10px] text-[#6B6863]">
                              {app.totalDurationMinutes} min total
                            </span>
                          </td>

                          {/* Total */}
                          <td className="py-3 px-4 text-right font-bold text-[#171717] whitespace-nowrap">
                            S/ {app.totalPrice.toFixed(2)}
                          </td>

                          {/* Estado */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            {getStatusBadge(app.status)}
                          </td>

                          {/* Acciones */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedAppointment(app)}
                                className="p-1.5 rounded-lg border border-[#E5E0D8] hover:bg-[#E9E1D4]/40 text-[#171717]"
                                title="Ver detalles completos"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {app.status === 'PENDIENTE' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPendingAction({
                                        appointmentId: app.id,
                                        action: 'ACEPTADA',
                                        label: 'Aceptar y confirmar solicitud',
                                      })
                                    }
                                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                                    title="Aceptar solicitud de cita"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPendingAction({
                                        appointmentId: app.id,
                                        action: 'RECHAZADA',
                                        label: 'Rechazar solicitud',
                                      })
                                    }
                                    className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                    title="Rechazar solicitud"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}

                              {app.status === 'ACEPTADA' && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPendingAction({
                                      appointmentId: app.id,
                                      action: 'COMPLETADA',
                                      label: 'Marcar cita como atendida y completada',
                                    })
                                  }
                                  className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                                  title="Completar cita"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Schedules & Holidays */}
        {activeTab === 'schedules' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A34E]">
                Disponibilidad
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#171717]">
                Horarios Semanales y Días No Laborables
              </h2>
              <p className="text-xs text-[#6B6863]">
                Define la ventana de atención utilizada por el motor de disponibilidad para generar los turnos que los clientes pueden reservar.
              </p>
            </div>

            <div className="divide-y divide-[#E5E0D8]">
              {DEMO_BUSINESS_HOURS.map((sch) => (
                <div key={sch.dayOfWeek} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-24 font-bold text-[#171717]">
                      {sch.dayName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sch.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {sch.isOpen ? 'Abierto' : 'Día de descanso'}
                    </span>
                  </div>

                  <div className="text-[#6B6863] font-mono">
                    {sch.isOpen ? `${sch.openTime} a ${sch.closeTime}` : 'Cerrado'}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5E0D8] text-xs space-y-2">
              <span className="font-bold text-[#171717] block">
                Reglas de Prevención de Bloqueos:
              </span>
              <ul className="list-disc pl-5 space-y-1 text-[#6B6863]">
                <li>Zona Horaria configurada: <strong>{DEMO_BUSINESS_CONFIG.timezone}</strong>.</li>
                <li>Días de descanso habituales (Domingo) no permiten solicitudes en el calendario público.</li>
                <li>Tiempo de colchón / buffer entre citas: <strong>{DEMO_BUSINESS_CONFIG.bufferMinutesBetweenAppointments} minutos</strong> para esterilización y preparación de herramientas.</li>
                <li>Tanto las citas <code>PENDIENTE</code> como <code>ACEPTADA</code> bloquean el turno para evitar reservas simultáneas.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: Services Catalog Management */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A34E]">
                Catálogo Activo
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#171717]">
                Servicios Configurados ({DEMO_SERVICES.length})
              </h2>
              <p className="text-xs text-[#6B6863]">
                Lista de servicios ofrecidos. Al conectar Firestore, podrás agregar nuevos servicios y ajustar tarifas en tiempo real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEMO_SERVICES.map((s) => (
                <div key={s.id} className="p-4 rounded-xl border border-[#E5E0D8] bg-[#F8F6F2] space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-[#C9A34E] uppercase">
                      {s.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Activo
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-sm text-[#171717]">
                    {s.name}
                  </h3>
                  <div className="flex justify-between text-[#171717] font-semibold pt-2 border-t border-[#E5E0D8]">
                    <span>{s.durationMinutes} min</span>
                    <span className="text-base text-[#A5802C]">S/ {s.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Business Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A34E]">
                Negocio
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#171717]">
                Información de ROSI STUDIO
              </h2>
              <p className="text-xs text-[#6B6863]">
                Parámetros generales de contacto, moneda y tarifas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#171717]">Nombre Comercial</label>
                <input
                  type="text"
                  disabled
                  value={DEMO_BUSINESS_CONFIG.name}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] bg-gray-50 text-[#171717]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#171717]">Lema Oficial</label>
                <input
                  type="text"
                  disabled
                  value={DEMO_BUSINESS_CONFIG.slogan}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] bg-gray-50 text-[#171717]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#171717]">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  disabled
                  value={DEMO_BUSINESS_CONFIG.phone}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] bg-gray-50 text-[#171717]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#171717]">Tarifa a Domicilio (Demostrativa)</label>
                <input
                  type="text"
                  disabled
                  value={`S/ ${DEMO_BUSINESS_CONFIG.defaultHomeFee.toFixed(2)}`}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] bg-gray-50 text-[#171717]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-[#171717]">Dirección del Local Principal</label>
                <input
                  type="text"
                  disabled
                  value={DEMO_BUSINESS_CONFIG.address}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] bg-gray-50 text-[#171717]"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E5E0D8] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div>
                <span className="font-mono text-xs text-[#6B6863] block">
                  {selectedAppointment.id}
                </span>
                <h3 className="font-heading text-xl font-bold text-[#171717]">
                  Detalles de la Cita
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B6863]">Cliente:</span>
                <span className="font-bold text-[#171717]">
                  {selectedAppointment.clientName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6863]">Teléfono:</span>
                <a
                  href={`tel:${selectedAppointment.clientPhone}`}
                  className="text-[#C9A34E] font-bold hover:underline"
                >
                  {selectedAppointment.clientPhone}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6863]">Fecha & Horario:</span>
                <span className="font-bold text-[#171717]">
                  {selectedAppointment.date} ({selectedAppointment.startTime} a {selectedAppointment.endTime})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6863]">Modalidad:</span>
                <span className="font-bold text-[#171717]">
                  {selectedAppointment.modality === 'DOMICILIO' ? 'Atención a Domicilio' : 'En el Local'}
                </span>
              </div>
              {selectedAppointment.address && (
                <div className="flex justify-between">
                  <span className="text-[#6B6863]">Dirección:</span>
                  <span className="font-medium text-[#171717] text-right">
                    {selectedAppointment.address} {selectedAppointment.reference ? `(${selectedAppointment.reference})` : ''}
                  </span>
                </div>
              )}
              <div className="space-y-1 pt-2 border-t border-[#E5E0D8]">
                <span className="text-[#6B6863] font-bold block">Servicios:</span>
                <ul className="list-disc pl-5 space-y-0.5">
                  {selectedAppointment.services.map((s) => (
                    <li key={s.id}>
                      {s.name} — S/ {s.price.toFixed(2)} ({s.durationMinutes} min)
                    </li>
                  ))}
                </ul>
              </div>
              {selectedAppointment.notes && (
                <div className="p-3 bg-gray-50 rounded-xl text-[#6B6863] italic">
                  &ldquo;{selectedAppointment.notes}&rdquo;
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-[#E5E0D8] text-sm font-bold text-[#171717]">
                <span>Total Estimado:</span>
                <span className="text-base text-[#A5802C]">
                  S/ {selectedAppointment.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 rounded-xl border border-[#E5E0D8] text-xs font-bold text-[#171717] hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {pendingAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E5E0D8] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-[#C9A34E] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-heading text-lg font-bold text-[#171717]">
                Confirmar Acción
              </h3>
              <p className="text-xs text-[#6B6863]">
                ¿Estás seguro de que deseas{' '}
                <strong>{pendingAction.label.toLowerCase()}</strong> para la cita{' '}
                <code>{pendingAction.appointmentId}</code>?
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#E5E0D8] text-xs font-bold text-[#171717] hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="flex-1 py-2.5 rounded-xl bg-[#171717] hover:bg-[#C9A34E] text-white hover:text-[#171717] text-xs font-bold shadow"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
