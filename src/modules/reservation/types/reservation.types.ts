// ==============================================================================
// Wahide Frontend - Reservation Module Types
// Strictly synchronized with Wahide Go Backend: internal/modules/reservation/domain
// ==============================================================================

export type ReservationStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface Reservation {
  id: string;
  tenantId?: string;
  customerName: string;
  phone: string;
  bookingDate: string; // YYYY-MM-DD
  bookingTime: string; // HH:mm
  serviceName: string;
  notes: string;
  status: ReservationStatus;
  reminderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationInput {
  customerName: string;
  phone: string;
  bookingDate: string; // YYYY-MM-DD
  bookingTime?: string; // HH:mm
  serviceName?: string;
  notes?: string;
}

export interface UpdateReservationInput {
  customerName?: string;
  phone?: string;
  bookingDate?: string; // YYYY-MM-DD
  bookingTime?: string; // HH:mm
  serviceName?: string;
  notes?: string;
  status?: ReservationStatus;
}

export interface ListReservationsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ReservationStatus | "ALL";
  date?: string; // YYYY-MM-DD
}

export interface CalendarSummary {
  month: string; // YYYY-MM
  summary: Record<string, number>; // "2026-10-15": 3
  totalBookings: number;
}
