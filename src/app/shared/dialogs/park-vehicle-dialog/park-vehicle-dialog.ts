import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { ParkVehicleDialogData } from '../../../core/models/park-vehicle-dialog-data.model';
import { VehicleType } from '../../../core/models/vehicle-type.enum';

@Component({
  selector: 'park-vehicle-dialog',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule],
  templateUrl: './park-vehicle-dialog.html',
  styleUrls: ['./park-vehicle-dialog.scss'],
})
export class ParkVehicleDialog {
  vehicleNumber = '';
  driverName = '';

  /** TEMP – will move to shared constants later */
  readonly vehicleIcons: Record<VehicleType, string> = {
    CAR: 'directions_car',
    BIKE: 'pedal_bike',
    TRUCK: 'local_shipping',
  };

  readonly vehicleIconsGif: Record<VehicleType, string> = {
    CAR: 'assets/icons/car.gif',
    BIKE: 'assets/icons/bike.gif',
    TRUCK: 'assets/icons/truck.gif',
  };

  constructor(
    private dialogRef: MatDialogRef<ParkVehicleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ParkVehicleDialogData
  ) {}

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (!this.vehicleNumber.trim() || !this.driverName.trim()) return;

    this.dialogRef.close({
      vehicleNumber: this.vehicleNumber.trim(),
      driverName: this.driverName.trim(),
    });
  }
}
