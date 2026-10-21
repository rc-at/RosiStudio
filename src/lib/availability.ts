import { Appointment, BlockedDate, DaySchedule, TimeSlot } from '@/types';
import { DEMO_BUSINESS_HOURS, DEMO_BUSINESS_CONFIG } from './data/demo-data';

export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const startTotal = timeToMinutes(startTime);
  return minutesToTime(startTotal + durationMinutes);
}

/**
 * Checks whether a given YYYY-MM-DD date is in the past compared to today in Lima (UTC-5)
 */
export function isDateInPast(dateStr: string): boolean {
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  
  const today = new Date();
  const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  return targetDate < currentDate;
}

/**
 * Formats a date string for user friendly Peruvian Spanish display
 */
export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Checks if a specific date is closed due to weekly schedule or blocked holiday dates
 */
export function isDateClosed(
  dateStr: string,
  schedules: DaySchedule[] = DEMO_BUSINESS_HOURS,
  blockedDates: BlockedDate[] = []
): { isClosed: boolean; reason?: string } {
  if (isDateInPast(dateStr)) {
    return { isClosed: true, reason: 'Fecha anterior al día actual' };
  }

  // Check custom blocked holidays
  const blocked = blockedDates.find((b) => b.date === dateStr && b.fullDay);
  if (blocked) {
    return { isClosed: true, reason: blocked.reason || 'Día no laborable / Feriado' };
  }

  // Check weekly schedule
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay(); // 0 is Sunday

  const schedule = schedules.find((s) => s.dayOfWeek === dayOfWeek);
  if (!schedule || !schedule.isOpen) {
    return { isClosed: true, reason: 'Día de descanso habitual' };
  }

  return { isClosed: false };
}

/**
 * Checks if two time intervals overlap (including buffer)
 */
export function hasTimeOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number,
  bufferMinutes = 0
): boolean {
  // A starts before B ends + buffer AND B starts before A ends + buffer
  return startA < endB + bufferMinutes && startB < endA + bufferMinutes;
}

/**
 * Generates available time slots for a given date and service duration.
 * Both 'PENDIENTE' and 'ACEPTADA' appointments reserve the slot.
 */
export function generateAvailableSlots({
  date,
  totalDurationMinutes,
  existingAppointments,
  schedules = DEMO_BUSINESS_HOURS,
  blockedDates = [],
  slotIntervalMinutes = 30,
  bufferMinutes = DEMO_BUSINESS_CONFIG.bufferMinutesBetweenAppointments,
}: {
  date: string;
  totalDurationMinutes: number;
  existingAppointments: Appointment[];
  schedules?: DaySchedule[];
  blockedDates?: BlockedDate[];
  slotIntervalMinutes?: number;
  bufferMinutes?: number;
}): TimeSlot[] {
  const closedCheck = isDateClosed(date, schedules, blockedDates);
  if (closedCheck.isClosed) {
    return [];
  }

  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay();
  const schedule = schedules.find((s) => s.dayOfWeek === dayOfWeek);

  if (!schedule || !schedule.isOpen) return [];

  const openMinutes = timeToMinutes(schedule.openTime);
  const closeMinutes = timeToMinutes(schedule.closeTime);

  // Filter active appointments for this date (both PENDIENTE and ACEPTADA block the slot)
  const activeAppointmentsOnDate = existingAppointments.filter(
    (app) =>
      app.date === date &&
      (app.status === 'PENDIENTE' || app.status === 'ACEPTADA')
  );

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const isToday = date === todayStr;
  const currentMinutesFromMidnight = now.getHours() * 60 + now.getMinutes();

  const slots: TimeSlot[] = [];

  for (
    let slotStart = openMinutes;
    slotStart + totalDurationMinutes <= closeMinutes;
    slotStart += slotIntervalMinutes
  ) {
    const slotEnd = slotStart + totalDurationMinutes;
    const timeStr = minutesToTime(slotStart);

    // If booking for today, slots must be in the future (plus 30 min minimum notice)
    if (isToday && slotStart <= currentMinutesFromMidnight + 30) {
      slots.push({
        time: timeStr,
        available: false,
        reason: 'Horario ya transcurrido o muy próximo',
      });
      continue;
    }

    // Check collision with any existing appointment on that day
    let conflictFound = false;
    let conflictReason = '';

    for (const app of activeAppointmentsOnDate) {
      const appStart = timeToMinutes(app.startTime);
      const appEnd = timeToMinutes(app.endTime);

      if (hasTimeOverlap(slotStart, slotEnd, appStart, appEnd, bufferMinutes)) {
        conflictFound = true;
        conflictReason =
          app.status === 'PENDIENTE'
            ? 'Horario en proceso de aprobación por otro cliente'
            : 'Horario reservado';
        break;
      }
    }

    slots.push({
      time: timeStr,
      available: !conflictFound,
      reason: conflictFound ? conflictReason : undefined,
    });
  }

  return slots;
}
