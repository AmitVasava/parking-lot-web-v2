import { Component, Input, Output, EventEmitter, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ParkingSpot } from '../../../core/models/spot.model';
import { ParkingFloor } from '../../../core/models/floor.model';
import { SpotActionPayload } from '../../../core/models/spot-card.actions';
import { ParkingLotStore } from '../../../core/store/parking-lot.store';
import { FormatDateTimePipe } from '../../pipes/format-datetime.pipe';
import { ParkingTicket } from '../../../core/models/ticket.model';

@Component({
  selector: 'spot-card',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, FormatDateTimePipe],
  templateUrl: './spot-card.html',
})
export class SpotCard {
  private store = inject(ParkingLotStore);

  @Input() floor!: ParkingFloor;
  @Input() spot!: ParkingSpot;

  /** show footer action buttons (true in Park/Unpark page, false in Manage Floors) */
  @Input() showActions: boolean = false;

  @Output() park = new EventEmitter<SpotActionPayload>();
  @Output() unpark = new EventEmitter<SpotActionPayload>();

  /** Mapping vehicle type -> material icon name */
  vehicleIcons: Record<string, string> = {
    CAR: 'directions_car',
    BIKE: 'pedal_bike',
    TRUCK: 'local_shipping',
  };

  ticket = computed<ParkingTicket | undefined>(() =>
    this.store
      .tickets()
      .find((t) => t.spotId === this.spot.spotId && t.floorId === this.floor.floorId)
  );

  onPark() {
    const payload: SpotActionPayload = {
      floorId: this.floor.floorId,
      floorName: this.floor.floorName,
      spot: this.spot,
    };
    this.park.emit(payload);
  }

  onUnpark() {
    const payload: SpotActionPayload = {
      floorId: this.floor.floorId,
      floorName: this.floor.floorName,
      spot: this.spot,
    };
    this.unpark.emit(payload);
  }
}
