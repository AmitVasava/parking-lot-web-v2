import { Component, inject } from '@angular/core';
import { ParkingLotStore } from '../../../../core/store/parking-lot.store';
import { SpotCard } from '../../../../shared/components/spot-card/spot-card';
import { SpotActionPayload } from '../../../../core/models/spot-card.actions';

@Component({
  selector: 'app-park-vehicle',
  imports: [SpotCard],
  templateUrl: './park-vehicle.html',
  styleUrl: './park-vehicle.scss',
})
export class ParkVehicle {
  store = inject(ParkingLotStore);
  floors = this.store.floors;

  handlePark(event: SpotActionPayload) {
    this.store.openParkDialog(event);
  }

  handleUnpark(event: SpotActionPayload) {
    this.store.openUnparkDialog(event);
  }
}
