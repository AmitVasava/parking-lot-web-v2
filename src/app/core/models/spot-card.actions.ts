import { ParkingSpot } from './spot.model';

export interface SpotActionPayload {
  floorId: number;
  floorName: string;
  spot: ParkingSpot;
}
