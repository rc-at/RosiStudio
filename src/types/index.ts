export type ServiceCategory =
  | 'Corte de cabello'
  | 'Trenzas'
  | 'Manicure'
  | 'Pedicure'
  | 'Tinte'
  | 'Peinados'
  | 'Diseño de cejas'
  | 'Otros servicios';

export type ProductCategory =
  | 'Gel para hombre'
  | 'Tinte'
  | 'Peines'
  | 'Productos capilares'
  | 'Cuidado de uñas'
  | 'Artículos de belleza';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number; // En soles (PEN / S/.)
  durationMinutes: number;
  imageUrl?: string;
  active: boolean;
  featured?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number; // En soles (PEN / S/.)
  imageUrl?: string;
  inStock: boolean;
  stockCount?: number;
  brand?: string;
}

export type AppointmentModality = 'LOCAL' | 'DOMICILIO';

export type AppointmentStatus =
  | 'PENDIENTE'
  | 'ACEPTADA'
  | 'RECHAZADA'
  | 'CANCELADA'
  | 'COMPLETADA';

export interface BookedServiceSnapshot {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientUid?: string;
  modality: AppointmentModality;
  address?: string;
  reference?: string;
  homeServiceFee: number;
  services: BookedServiceSnapshot[];
  date: string; // ISO Date YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
  totalDurationMinutes: number;
  totalPrice: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string; // ISO DateTime string
  updatedAt: string; // ISO DateTime string
}

export interface DaySchedule {
  dayOfWeek: number; // 0: Domingo, 1: Lunes, ..., 6: Sábado
  dayName: string;
  isOpen: boolean;
  openTime: string; // '09:00'
  closeTime: string; // '20:00'
}

export interface BlockedDate {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
  fullDay: boolean;
  startTime?: string;
  endTime?: string;
}

export interface BusinessConfig {
  name: string;
  slogan: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  defaultHomeFee: number;
  bookingAdvanceDays: number;
  bufferMinutesBetweenAppointments: number;
}

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
  reason?: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
}
