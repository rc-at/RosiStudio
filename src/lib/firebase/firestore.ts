import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import {
  Appointment,
  AppointmentStatus,
  Product,
  Service,
} from '@/types';
import {
  DEMO_SERVICES,
  DEMO_PRODUCTS,
} from '@/lib/data/demo-data';
import { DEMO_APPOINTMENTS } from '@/lib/data/demo-appointments';

// In-memory demo store for testing before Firebase credentials are added
let memoryAppointments: Appointment[] = [...DEMO_APPOINTMENTS];
const memoryServices: Service[] = [...DEMO_SERVICES];
const memoryProducts: Product[] = [...DEMO_PRODUCTS];

// -------------------------------------------------------------
// CITAS / APPOINTMENTS
// -------------------------------------------------------------

export async function fetchAppointments(filters?: {
  status?: AppointmentStatus | 'TODAS';
  date?: string;
}): Promise<{ appointments: Appointment[]; isDemo: boolean }> {
  if (!isFirebaseConfigured || !db) {
    let result = [...memoryAppointments];
    if (filters?.status && filters.status !== 'TODAS') {
      result = result.filter((a) => a.status === filters.status);
    }
    if (filters?.date) {
      result = result.filter((a) => a.date === filters.date);
    }
    // Sort descending by date and time
    result.sort((a, b) => `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`));
    return { appointments: result, isDemo: true };
  }

  try {
    const appointmentsRef = collection(db, 'appointments');
    let q = query(appointmentsRef, orderBy('date', 'desc'), orderBy('startTime', 'desc'));

    if (filters?.status && filters.status !== 'TODAS') {
      q = query(appointmentsRef, where('status', '==', filters.status), orderBy('date', 'desc'));
    }

    const snapshot = await getDocs(q);
    const appointments: Appointment[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
      } as Appointment;
    });

    return { appointments, isDemo: false };
  } catch (error) {
    console.warn('Error fetching appointments from Firestore, using demo fallback:', error);
    return { appointments: memoryAppointments, isDemo: true };
  }
}

export async function fetchAppointmentById(id: string): Promise<{
  appointment: Appointment | null;
  isDemo: boolean;
}> {
  if (!isFirebaseConfigured || !db) {
    const found = memoryAppointments.find((a) => a.id === id) || null;
    return { appointment: found, isDemo: true };
  }

  try {
    const docRef = doc(db, 'appointments', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return { appointment: null, isDemo: false };
    return {
      appointment: { id: snap.id, ...snap.data() } as Appointment,
      isDemo: false,
    };
  } catch (error) {
    console.warn('Error fetching appointment by ID:', error);
    const found = memoryAppointments.find((a) => a.id === id) || null;
    return { appointment: found, isDemo: true };
  }
}

export async function createAppointment(
  data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<{ id: string; appointment: Appointment; isDemo: boolean }> {
  const newId = 'cita-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  const nowIso = new Date().toISOString();

  const appointment: Appointment = {
    ...data,
    id: newId,
    status: 'PENDIENTE', // Siempre inicia como PENDIENTE de aprobación
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  if (!isFirebaseConfigured || !db) {
    // Save in memory store
    memoryAppointments = [appointment, ...memoryAppointments];
    return { id: newId, appointment, isDemo: true };
  }

  try {
    const docRef = doc(db, 'appointments', newId);
    await setDoc(docRef, {
      ...appointment,
      serverCreatedAt: serverTimestamp(),
      serverUpdatedAt: serverTimestamp(),
    });
    return { id: newId, appointment, isDemo: false };
  } catch (error) {
    console.warn('Error saving appointment to Firestore, stored in local demo session:', error);
    memoryAppointments = [appointment, ...memoryAppointments];
    return { id: newId, appointment, isDemo: true };
  }
}

export async function updateAppointmentStatus(
  id: string,
  newStatus: AppointmentStatus
): Promise<{ success: boolean; isDemo: boolean }> {
  if (!isFirebaseConfigured || !db) {
    memoryAppointments = memoryAppointments.map((a) =>
      a.id === id ? { ...a, status: newStatus, updatedAt: new Date().toISOString() } : a
    );
    return { success: true, isDemo: true };
  }

  try {
    const docRef = doc(db, 'appointments', id);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
      serverUpdatedAt: serverTimestamp(),
    });
    return { success: true, isDemo: false };
  } catch (error) {
    console.warn('Error updating status in Firestore:', error);
    memoryAppointments = memoryAppointments.map((a) =>
      a.id === id ? { ...a, status: newStatus, updatedAt: new Date().toISOString() } : a
    );
    return { success: true, isDemo: true };
  }
}

// -------------------------------------------------------------
// SERVICIOS / SERVICES
// -------------------------------------------------------------

export async function fetchServices(): Promise<{ services: Service[]; isDemo: boolean }> {
  if (!isFirebaseConfigured || !db) {
    return { services: memoryServices, isDemo: true };
  }

  try {
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);
    if (snapshot.empty) {
      return { services: memoryServices, isDemo: true };
    }
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
    return { services: list, isDemo: false };
  } catch (error) {
    console.warn('Error fetching services from Firestore:', error);
    return { services: memoryServices, isDemo: true };
  }
}

// -------------------------------------------------------------
// PRODUCTOS / PRODUCTS
// -------------------------------------------------------------

export async function fetchProducts(): Promise<{ products: Product[]; isDemo: boolean }> {
  if (!isFirebaseConfigured || !db) {
    return { products: memoryProducts, isDemo: true };
  }

  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    if (snapshot.empty) {
      return { products: memoryProducts, isDemo: true };
    }
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
    return { products: list, isDemo: false };
  } catch (error) {
    console.warn('Error fetching products from Firestore:', error);
    return { products: memoryProducts, isDemo: true };
  }
}
