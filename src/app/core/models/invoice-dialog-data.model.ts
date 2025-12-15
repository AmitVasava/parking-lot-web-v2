import { VehicleType } from './vehicle-type.enum';

export interface InvoiceDialogData {
  floorName: string;
  spotName: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  driverName: string;
  ticketNumber: string;
  paymentMethod: string;
  parkedAt: string; // ISO date
  unparkedAt: string; // ISO date
  durationMinutes: number;
  amountToPay: number;
}
