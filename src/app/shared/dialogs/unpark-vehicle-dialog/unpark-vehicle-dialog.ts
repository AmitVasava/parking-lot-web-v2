import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { VehicleType } from '../../../core/models/vehicle-type.enum';
import { FormatDateTimePipe } from '../../pipes/format-datetime.pipe';

export interface UnparkDialogData {
  floorName: string;
  spotName: string;
  allowedType: VehicleType;
  ticketNumber: string;
  vehicleNumber: string;
  driverName: string;
  parkedAt: string;
}

export interface UnparkDialogResult {
  paymentMethod: 'CASH' | 'CARD' | 'UPI';
  totalAmount: number;
}

@Component({
  selector: 'unpark-vehicle-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, FormsModule, FormatDateTimePipe],
  templateUrl: './unpark-vehicle-dialog.html',
})
export class UnparkVehicleDialog {
  paymentMethod: 'CASH' | 'CARD' | 'UPI' = 'CASH';

  readonly ratePerHour = 50;

  durationMinutes: number;
  baseAmount: number;
  taxAmount: number;
  amountToPay: number;

  paymentOptions = [
    { value: 'CASH', label: 'Cash', sub: 'Pay using Cash', icon: 'assets/icons/cash.png' },
    { value: 'CARD', label: 'Card', sub: 'Pay using Card', icon: 'assets/icons/card.png' },
    { value: 'UPI', label: 'UPI', sub: 'Pay using UPI', icon: 'assets/icons/upi.png' },
  ];

  vehicleIcons: Record<VehicleType, string> = {
    CAR: 'directions_car',
    BIKE: 'pedal_bike',
    TRUCK: 'local_shipping',
  };

  constructor(
    private dialogRef: MatDialogRef<UnparkVehicleDialog, UnparkDialogResult | null>,
    @Inject(MAT_DIALOG_DATA) public data: UnparkDialogData
  ) {
    const parked = new Date(data.parkedAt);
    const now = new Date();

    const diff = now.getTime() - parked.getTime();
    this.durationMinutes = Math.max(1, Math.round(diff / 60000));

    const hours = this.durationMinutes / 60;

    this.baseAmount = Math.ceil(hours * this.ratePerHour);
    this.taxAmount = Math.round(this.baseAmount * 0.18);
    this.amountToPay = this.baseAmount + this.taxAmount;
  }

  close() {
    this.dialogRef.close(null);
  }

  submit() {
    this.dialogRef.close({
      paymentMethod: this.paymentMethod,
      totalAmount: this.amountToPay,
    });
  }
}
