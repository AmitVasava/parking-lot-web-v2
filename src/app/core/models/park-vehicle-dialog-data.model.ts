import { VehicleType } from './vehicle-type.enum';

export interface ParkVehicleDialogData {
  floorName: string;
  spotName: string;
  allowedType: VehicleType;
}
