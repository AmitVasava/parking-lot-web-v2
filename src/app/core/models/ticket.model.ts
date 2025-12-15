import { VehicleType } from './vehicle-type.enum';

export interface ParkingTicket {
  ticketId: number;
  ticketNumber: string;
  floorId: number;
  spotId: number;
  vehicleNumber: string;
  vehicleType: VehicleType;
  driverName: string;
  parkedAt: string; // ISO
  unparkedAt?: string;
}
