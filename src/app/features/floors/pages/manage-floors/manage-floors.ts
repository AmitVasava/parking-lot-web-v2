import { Component, inject } from '@angular/core';
import { ParkingLotStore } from '../../../../core/store/parking-lot.store';
import { MatButtonModule } from '@angular/material/button';
import { SpotCard } from '../../../../shared/components/spot-card/spot-card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-manage-floors',
  imports: [MatButtonModule, SpotCard, MatIconModule],
  templateUrl: './manage-floors.html',
  styleUrl: './manage-floors.scss',
})
export class ManageFloors {
  store = inject(ParkingLotStore);
  floors = this.store.floors;
}
