'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Service,
  AppointmentModality,
  BookedServiceSnapshot,
  Appointment,
} from '@/types';
import {
  DEMO_SERVICES,
  DEMO_BUSINESS_CONFIG,
} from '@/lib/data/demo-data';
import {
  generateAvailableSlots,
  calculateEndTime,
  isDateClosed,
  formatDateDisplay,
} from '@/lib/availability';
import {
  createAppointment,
  fetchAppointments,
} from '@/lib/firebase/firestore';
import { signInWithGoogle } from '@/lib/firebase/auth';
import {
  Calendar as CalendarIcon,
  Clock,
  Home,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  Phone,
  Mail,
  AlertCircle,
  Check,
} from 'lucide-react';

export function BookingWizard() {
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get('service');

  // Multi-step state (1 to 5, 6 is Success screen)
  const [step, setStep] = useState<number>(1);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const minDate = mounted ? new Date().toISOString().split('T')[0] : '';

  const [selectedServices, setSelectedServices] = useState<Service[]>(() => {
    if (preselectedServiceId) {
      const found = DEMO_SERVICES.find((s) => s.id === preselectedServiceId);
      if (found) return [found];
    }
    return [];
  });

  const [modality, setModality] = useState<AppointmentModality>('LOCAL');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-22');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientUid, setClientUid] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState('');

  // Async & UI status
  const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Load existing appointments to accurately compute real-time collision prevention
  useEffect(() => {
    async function loadData() {
      const res = await fetchAppointments();
      setExistingAppointments(res.appointments);
    }
    loadData();
  }, []);

  // Totals calculation
  const totalDurationMinutes = selectedServices.reduce(
    (acc, s) => acc + s.durationMinutes,
    0
  );
  const servicesSubtotal = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const homeFee = modality === 'DOMICILIO' ? DEMO_BUSINESS_CONFIG.defaultHomeFee : 0;
  const totalPrice = servicesSubtotal + homeFee;

  // Available slots for selected date
  const availableSlots = (mounted && selectedDate && totalDurationMinutes > 0)
    ? generateAvailableSlots({
        date: selectedDate,
        totalDurationMinutes,
        existingAppointments,
      })
    : [];

  const handleToggleService = (service: Service) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
    // Reset selected slot when duration changes
    setSelectedTime('');
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithGoogle();
      if (res.user) {
        if (res.user.displayName) setClientName(res.user.displayName);
        if (res.user.email) setClientEmail(res.user.email);
        setClientUid(res.user.uid);
      }
    } catch (err) {
      console.error('Error Google Sign In:', err);
    }
  };

  const handleSubmitBooking = async () => {
    if (!selectedTime) {
      setErrorMessage('Por favor selecciona un horario de atención disponible.');
      return;
    }
    if (!clientName.trim() || !clientPhone.trim()) {
      setErrorMessage('Por favor ingresa tu nombre y número telefónico.');
      return;
    }
    if (modality === 'DOMICILIO' && !address.trim()) {
      setErrorMessage('Por favor ingresa la dirección para la atención a domicilio.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const endTime = calculateEndTime(selectedTime, totalDurationMinutes);

      const serviceSnapshots: BookedServiceSnapshot[] = selectedServices.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        durationMinutes: s.durationMinutes,
      }));

      const res = await createAppointment({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim() || undefined,
        clientUid,
        modality,
        address: modality === 'DOMICILIO' ? address.trim() : undefined,
        reference: modality === 'DOMICILIO' ? reference.trim() : undefined,
        homeServiceFee: homeFee,
        services: serviceSnapshots,
        date: selectedDate,
        startTime: selectedTime,
        endTime,
        totalDurationMinutes,
        totalPrice,
        notes: notes.trim() || undefined,
      });

      setCreatedAppointment(res.appointment);
      setStep(6); // Success step
    } catch (err) {
      console.error('Error creating appointment:', err);
      setErrorMessage('Ocurrió un error al procesar tu reserva. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-[#E5E0D8] shadow-sm text-center max-w-xl mx-auto space-y-3">
        <div className="w-8 h-8 border-3 border-[#C9A34E] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#6B6863]">Cargando calendario y servicios...</p>
      </div>
    );
  }

  // STEP 6: Confirmation Screen
  if (step === 6 && createdAppointment) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E0D8] shadow-lg max-w-2xl mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-[#C9A34E] flex items-center justify-center mx-auto shadow-inner">
          <Clock className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
            Solicitud Pendiente de Aprobación
          </span>
          <h2 className="font-heading text-3xl font-bold text-[#171717]">
            ¡Tu solicitud ha sido recibida!
          </h2>
          <p className="text-sm text-[#6B6863] max-w-md mx-auto">
            Muchas gracias <strong>{createdAppointment.clientName}</strong>. Tu cita está registrada con el código de seguimiento:
          </p>
          <div className="py-2">
            <span className="px-4 py-2 rounded-xl bg-[#F8F6F2] border border-[#E5E0D8] font-mono text-base font-bold text-[#171717]">
              {createdAppointment.id}
            </span>
          </div>
        </div>

        {/* Appointment Recap Card */}
        <div className="bg-[#F8F6F2] rounded-2xl p-5 text-left border border-[#E5E0D8] space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between border-b border-[#E5E0D8] pb-2">
            <span className="text-[#6B6863]">Fecha:</span>
            <span className="font-bold text-[#171717]">
              {formatDateDisplay(createdAppointment.date)}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#E5E0D8] pb-2">
            <span className="text-[#6B6863]">Horario solicitado:</span>
            <span className="font-bold text-[#171717]">
              {createdAppointment.startTime} - {createdAppointment.endTime} ({createdAppointment.totalDurationMinutes} min)
            </span>
          </div>
          <div className="flex justify-between border-b border-[#E5E0D8] pb-2">
            <span className="text-[#6B6863]">Modalidad:</span>
            <span className="font-bold text-[#171717]">
              {createdAppointment.modality === 'DOMICILIO' ? 'Atención a Domicilio' : 'En el Local'}
            </span>
          </div>
          {createdAppointment.address && (
            <div className="flex justify-between border-b border-[#E5E0D8] pb-2">
              <span className="text-[#6B6863]">Dirección:</span>
              <span className="font-medium text-[#171717] text-right">
                {createdAppointment.address}
              </span>
            </div>
          )}
          <div className="space-y-1 pt-1">
            <span className="text-[#6B6863] block">Servicios:</span>
            <ul className="list-disc pl-5 space-y-0.5 font-medium text-[#171717]">
              {createdAppointment.services.map((s) => (
                <li key={s.id}>
                  {s.name} — S/ {s.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#E5E0D8] text-base font-bold text-[#171717]">
            <span>Total Estimado:</span>
            <span className="text-[#A5802C]">
              S/ {createdAppointment.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#6B6863] leading-relaxed">
          Nuestra administradora revisará la disponibilidad de la agenda y te contactará al <strong>{createdAppointment.clientPhone}</strong> para confirmar formalmente tu cita.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/citas/${createdAppointment.id}`}
            className="flex-1 py-3 px-4 rounded-xl bg-[#171717] hover:bg-[#C9A34E] text-[#DFC27E] hover:text-[#171717] text-xs font-bold transition-all shadow text-center"
          >
            Ver estado de mi cita
          </Link>

          <button
            type="button"
            onClick={() => {
              setSelectedServices([]);
              setStep(1);
              setCreatedAppointment(null);
            }}
            className="py-3 px-4 rounded-xl bg-white hover:bg-[#E9E1D4]/40 text-[#171717] text-xs font-bold border border-[#E5E0D8] transition-colors"
          >
            Hacer otra reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Stepper Progress Bar */}
      <nav aria-label="Progreso de la reserva" className="bg-white rounded-2xl p-4 border border-[#E5E0D8] shadow-sm">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Servicios' },
            { num: 2, label: 'Modalidad' },
            { num: 3, label: 'Fecha y Hora' },
            { num: 4, label: 'Tus Datos' },
            { num: 5, label: 'Confirmación' },
          ].map((item, idx) => (
            <React.Fragment key={item.num}>
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === item.num
                      ? 'bg-[#171717] text-[#DFC27E] shadow'
                      : step > item.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#E9E1D4]/60 text-[#6B6863]'
                  }`}
                >
                  {step > item.num ? <Check className="w-4 h-4" /> : item.num}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-semibold ${
                    step === item.num ? 'text-[#171717]' : 'text-[#6B6863]'
                  } hidden md:inline-block`}
                >
                  {item.label}
                </span>
              </div>
              {idx < 4 && (
                <div
                  className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-colors ${
                    step > idx + 1 ? 'bg-emerald-500' : 'bg-[#E5E0D8]'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Select Services */}
      {step === 1 && (
        <section aria-labelledby="step-services-heading" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C9A34E]">
              Paso 1 de 5
            </span>
            <h2 id="step-services-heading" className="font-heading text-2xl sm:text-3xl font-bold text-[#171717]">
              Selecciona tus Servicios
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6863]">
              Puedes seleccionar uno o varios servicios para ser atendidos en la misma sesión.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEMO_SERVICES.filter((s) => s.active).map((service) => {
              const isSelected = selectedServices.some((s) => s.id === service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => handleToggleService(service)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isSelected
                      ? 'border-[#C9A34E] bg-[#E9E1D4]/25 shadow-sm'
                      : 'border-[#E5E0D8] hover:border-[#DFC27E] bg-white'
                  }`}
                >
                  <div
                    className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#171717] text-[#DFC27E]'
                        : 'border border-[#E5E0D8] bg-[#F8F6F2]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#C9A34E] tracking-wider">
                        {service.category}
                      </span>
                      <span className="text-xs font-bold text-[#171717]">
                        S/ {service.price.toFixed(2)}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-sm text-[#171717]">
                      {service.name}
                    </h3>
                    <p className="text-[11px] text-[#6B6863] line-clamp-2">
                      {service.description}
                    </p>

                    <div className="pt-1 flex items-center gap-1 text-[11px] font-medium text-[#6B6863]">
                      <Clock className="w-3 h-3 text-[#C9A34E]" />
                      <span>{service.durationMinutes} min</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar with Accumulated Duration and Price */}
          <div className="bg-[#F8F6F2] p-4 rounded-2xl border border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#6B6863]">
                Servicios seleccionados: <strong>{selectedServices.length}</strong>
              </span>
              <div className="flex items-center gap-4 text-sm font-bold text-[#171717] mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#C9A34E]" />
                  {totalDurationMinutes} min totales
                </span>
                <span className="text-base text-[#A5802C]">
                  S/ {servicesSubtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={selectedServices.length === 0}
              onClick={() => {
                setErrorMessage('');
                setStep(2);
              }}
              className={`w-full sm:w-auto px-6 py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                selectedServices.length > 0
                  ? 'bg-[#171717] text-[#DFC27E] hover:bg-[#C9A34E] hover:text-[#171717] shadow'
                  : 'bg-[#E5E0D8] text-[#6B6863] cursor-not-allowed'
              }`}
            >
              <span>Continuar con Modalidad</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: Modality (Local vs Domicilio) */}
      {step === 2 && (
        <section aria-labelledby="step-modality-heading" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C9A34E]">
              Paso 2 de 5
            </span>
            <h2 id="step-modality-heading" className="font-heading text-2xl sm:text-3xl font-bold text-[#171717]">
              ¿Dónde deseas recibir la atención?
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6863]">
              Elige entre visitarnos en nuestro salón o solicitar atención a domicilio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Local Option */}
            <div
              onClick={() => setModality('LOCAL')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                modality === 'LOCAL'
                  ? 'border-[#C9A34E] bg-[#E9E1D4]/25 shadow-sm'
                  : 'border-[#E5E0D8] hover:border-[#DFC27E] bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-[#171717] text-[#DFC27E] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                {modality === 'LOCAL' && (
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <h3 className="font-heading font-bold text-base text-[#171717]">
                En el Local de Rosi Studio
              </h3>
              <p className="text-xs text-[#6B6863]">
                {DEMO_BUSINESS_CONFIG.address}
              </p>
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                Sin costo adicional
              </div>
            </div>

            {/* Domicilio Option */}
            <div
              onClick={() => setModality('DOMICILIO')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                modality === 'DOMICILIO'
                  ? 'border-[#C9A34E] bg-[#E9E1D4]/25 shadow-sm'
                  : 'border-[#E5E0D8] hover:border-[#DFC27E] bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-[#C9A34E] text-[#171717] flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
                {modality === 'DOMICILIO' && (
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <h3 className="font-heading font-bold text-base text-[#171717]">
                A Domicilio
              </h3>
              <p className="text-xs text-[#6B6863]">
                Llevamos los materiales a tu ubicación.
              </p>
              <div className="text-xs font-bold text-[#A5802C] bg-[#E9E1D4]/60 px-2 py-1 rounded inline-block">
                Recargo demostrativo: + S/ {DEMO_BUSINESS_CONFIG.defaultHomeFee.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Domicilio Fields */}
          {modality === 'DOMICILIO' && (
            <div className="p-5 rounded-2xl bg-[#F8F6F2] border border-[#E5E0D8] space-y-4 animate-in fade-in duration-200">
              <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C9A34E]" />
                <span>Datos para la atención a domicilio</span>
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#171717]">
                  Dirección exacta *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Jr. Las Camelias 234, Dpto 301, San Martín de Porres"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E0D8] bg-white text-xs focus:ring-2 focus:ring-[#C9A34E] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#171717]">
                  Referencia de llegada (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. A dos cuadras del óvalo, portón negro con timbre visible"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E0D8] bg-white text-xs focus:ring-2 focus:ring-[#C9A34E] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-full border border-[#E5E0D8] text-xs font-bold text-[#171717] hover:bg-[#E9E1D4]/40 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (modality === 'DOMICILIO' && !address.trim()) {
                  setErrorMessage('Por favor especifica la dirección a domicilio.');
                  return;
                }
                setErrorMessage('');
                setStep(3);
              }}
              className="px-6 py-3 rounded-full bg-[#171717] hover:bg-[#C9A34E] text-[#DFC27E] hover:text-[#171717] font-bold text-xs shadow flex items-center gap-2 transition-all"
            >
              <span>Continuar con Fecha y Hora</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: Date & Time Picker */}
      {step === 3 && (
        <section aria-labelledby="step-datetime-heading" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C9A34E]">
              Paso 3 de 5
            </span>
            <h2 id="step-datetime-heading" className="font-heading text-2xl sm:text-3xl font-bold text-[#171717]">
              Selecciona Fecha y Horario Disponible
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6863]">
              Duración total de tus servicios: <strong>{totalDurationMinutes} minutos</strong>.
              El sistema filtra automáticamente los horarios disponibles evitando colisiones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Date Input & Status */}
            <div className="md:col-span-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-[#C9A34E]" />
                  <span>Elige la fecha de atención</span>
                </label>
                <input
                  type="date"
                  min={minDate || undefined}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E0D8] text-sm font-medium focus:ring-2 focus:ring-[#C9A34E] focus:outline-none"
                />
              </div>

              {selectedDate && (
                <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#E5E0D8] text-xs space-y-1">
                  <span className="text-[#6B6863] block">Fecha elegida:</span>
                  <span className="font-bold text-[#171717] capitalize block text-sm">
                    {formatDateDisplay(selectedDate)}
                  </span>
                  {isDateClosed(selectedDate).isClosed && (
                    <span className="text-red-700 font-semibold block pt-1">
                      ⚠️ {isDateClosed(selectedDate).reason}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Slots Grid */}
            <div className="md:col-span-7 space-y-3">
              <span className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C9A34E]" />
                <span>Horarios de inicio disponibles</span>
              </span>

              {isDateClosed(selectedDate).isClosed ? (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-[#E5E0D8]">
                  <p className="text-xs text-[#6B6863]">
                    El salón no atiende en la fecha seleccionada. Por favor selecciona otro día hábil (Lunes a Sábado).
                  </p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-[#E5E0D8]">
                  <p className="text-xs text-[#6B6863]">
                    No hay turnos disponibles que cubran {totalDurationMinutes} min en esta fecha. Intenta con una fecha posterior.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        !slot.available
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                          : selectedTime === slot.time
                          ? 'bg-[#171717] text-[#DFC27E] border-[#171717] shadow-sm'
                          : 'bg-white text-[#171717] border-[#E5E0D8] hover:border-[#C9A34E]'
                      }`}
                      title={slot.reason || 'Disponible'}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}

              {selectedTime && (
                <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>
                    Turno seleccionado: <strong>{selectedTime} a {calculateEndTime(selectedTime, totalDurationMinutes)}</strong>
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-full border border-[#E5E0D8] text-xs font-bold text-[#171717] hover:bg-[#E9E1D4]/40 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>

            <button
              type="button"
              disabled={!selectedTime}
              onClick={() => {
                setErrorMessage('');
                setStep(4);
              }}
              className={`px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 transition-all ${
                selectedTime
                  ? 'bg-[#171717] hover:bg-[#C9A34E] text-[#DFC27E] hover:text-[#171717] shadow'
                  : 'bg-[#E5E0D8] text-[#6B6863] cursor-not-allowed'
              }`}
            >
              <span>Continuar con Datos Personales</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: Customer Details Form */}
      {step === 4 && (
        <section aria-labelledby="step-customer-heading" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C9A34E]">
              Paso 4 de 5
            </span>
            <h2 id="step-customer-heading" className="font-heading text-2xl sm:text-3xl font-bold text-[#171717]">
              Ingresa tus Datos de Contacto
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6863]">
              No necesitas crear una cuenta obligatoriamente. Solo requerimos tu nombre y teléfono para confirmar tu reserva.
            </p>
          </div>

          {/* Optional Google Sign-In Quick-fill */}
          <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-[#171717]">
                ¿Prefieres autocompletar con Google?
              </span>
              <p className="text-[11px] text-[#6B6863]">
                Te permitirá vincular la cita y hacer seguimiento fácilmente.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#E9E1D4]/40 border border-[#E5E0D8] text-xs font-bold text-[#171717] shadow-sm flex items-center gap-2 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#171717] flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#C9A34E]" />
                <span>Nombre y Apellido *</span>
              </label>
              <input
                type="text"
                placeholder="Ej. Camila Morales"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E0D8] text-xs font-medium focus:ring-2 focus:ring-[#C9A34E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#171717] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#C9A34E]" />
                <span>Teléfono de contacto *</span>
              </label>
              <input
                type="tel"
                placeholder="Ej. +51 987 654 321"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E0D8] text-xs font-medium focus:ring-2 focus:ring-[#C9A34E] focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-[#171717] flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#C9A34E]" />
                <span>Correo Electrónico (opcional)</span>
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E0D8] text-xs font-medium focus:ring-2 focus:ring-[#C9A34E] focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-[#171717]">
                Notas o requerimientos especiales (opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Ej. Traeré extensiones propias, cabello sensible, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#E5E0D8] text-xs font-medium focus:ring-2 focus:ring-[#C9A34E] focus:outline-none"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-full border border-[#E5E0D8] text-xs font-bold text-[#171717] hover:bg-[#E9E1D4]/40 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!clientName.trim() || !clientPhone.trim()) {
                  setErrorMessage('Ingresa al menos tu nombre y número telefónico.');
                  return;
                }
                setErrorMessage('');
                setStep(5);
              }}
              className="px-6 py-3 rounded-full bg-[#171717] hover:bg-[#C9A34E] text-[#DFC27E] hover:text-[#171717] font-bold text-xs shadow flex items-center gap-2 transition-all"
            >
              <span>Revisar Resumen</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 5: Summary & Submit */}
      {step === 5 && (
        <section aria-labelledby="step-summary-heading" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C9A34E]">
              Paso 5 de 5
            </span>
            <h2 id="step-summary-heading" className="font-heading text-2xl sm:text-3xl font-bold text-[#171717]">
              Revisa y Confirma tu Reserva
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6863]">
              Verifica los detalles antes de enviar la solicitud. Tu cita se registrará en estado <strong>Pendiente de Aprobación</strong>.
            </p>
          </div>

          <div className="space-y-4">
            {/* Services breakdown */}
            <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5E0D8] space-y-3">
              <span className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                Servicios Seleccionados
              </span>
              <div className="divide-y divide-[#E5E0D8]">
                {selectedServices.map((s) => (
                  <div key={s.id} className="py-2 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-[#171717] block">{s.name}</span>
                      <span className="text-[11px] text-[#6B6863]">{s.durationMinutes} minutos</span>
                    </div>
                    <span className="font-bold text-[#171717]">
                      S/ {s.price.toFixed(2)}
                    </span>
                  </div>
                ))}

                {modality === 'DOMICILIO' && (
                  <div className="py-2 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-[#171717] block">Recargo por atención a domicilio</span>
                      <span className="text-[11px] text-[#6B6863]">Tarifa demostrativa de traslado</span>
                    </div>
                    <span className="font-bold text-[#A5802C]">
                      + S/ {DEMO_BUSINESS_CONFIG.defaultHomeFee.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#E5E0D8] flex justify-between items-center text-sm font-bold text-[#171717]">
                <span>Total Estimado:</span>
                <span className="text-lg text-[#A5802C]">
                  S/ {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Date, Time & Location summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-[#E5E0D8] bg-white space-y-1">
                <span className="text-[#6B6863] block">Fecha y Horario:</span>
                <span className="font-bold text-[#171717] block capitalize">
                  {formatDateDisplay(selectedDate)}
                </span>
                <span className="text-[#C9A34E] font-bold block">
                  {selectedTime} - {calculateEndTime(selectedTime, totalDurationMinutes)} ({totalDurationMinutes} min)
                </span>
              </div>

              <div className="p-4 rounded-xl border border-[#E5E0D8] bg-white space-y-1">
                <span className="text-[#6B6863] block">Modalidad y Lugar:</span>
                <span className="font-bold text-[#171717] block">
                  {modality === 'DOMICILIO' ? 'Atención a Domicilio' : 'En el Local'}
                </span>
                <span className="text-[#6B6863] block truncate">
                  {modality === 'DOMICILIO' ? address : DEMO_BUSINESS_CONFIG.address}
                </span>
              </div>
            </div>

            {/* Customer Summary */}
            <div className="p-4 rounded-xl border border-[#E5E0D8] bg-white text-xs space-y-1">
              <span className="text-[#6B6863] block">Datos del Cliente:</span>
              <span className="font-bold text-[#171717] block">{clientName}</span>
              <span className="text-[#6B6863] block">{clientPhone} {clientEmail ? `• ${clientEmail}` : ''}</span>
              {notes && (
                <p className="text-[11px] text-[#6B6863] pt-1 italic">
                  &ldquo;{notes}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Navigation & Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setStep(4)}
              className="px-5 py-2.5 rounded-full border border-[#E5E0D8] text-xs font-bold text-[#171717] hover:bg-[#E9E1D4]/40 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitBooking}
              className="px-7 py-3 rounded-full bg-[#C9A34E] hover:bg-[#A5802C] text-[#171717] font-bold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Procesando...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#171717]" />
                  <span>Confirmar Solicitud de Reserva</span>
                </>
              )}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
