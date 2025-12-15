import { ParkingSpot } from './spot.model';

export interface ParkingFloor {
  floorId: number;
  floorName: string;
  spots: ParkingSpot[];
}
