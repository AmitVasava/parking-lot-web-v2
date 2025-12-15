import { ParkingTicket } from './ticket.model';
import { VehicleType } from './vehicle-type.enum';

export interface Invoice {
  id: string; // Invoice number (INV-XXXX)
  ticket: ParkingTicket; // Ticket snapshot
  ratePerHour: number; // e.g., 50
  durationMinutes: number; // Total parked duration
  baseAmount: number; // Amount before tax
  taxAmount: number; // Tax value (18% or configurable)
  totalAmount: number; // Final amount paid
  paymentMethod: 'CASH' | 'CARD' | 'UPI'; // Selected method
  generatedAt: string; // Invoice generated time (ISO)
  parkedAt: string; // Entry timestamp (ISO)
  unparkedAt: string; // Exit timestamp (ISO)
  status: 'PAID' | 'UNPAID'; // Usually PAID for your system
}
