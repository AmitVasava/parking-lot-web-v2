import { VehicleType } from "./vehicle-type.enum";

export interface ParkingSpot {
  spotId: number;
  spotName: string;
  allowedType: VehicleType;
  occupied: boolean;
}
