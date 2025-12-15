import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VehicleType } from '../../../core/models/vehicle-type.enum';
import { FormatDateTimePipe } from '../../pipes/format-datetime.pipe';
import { DatePipe } from '@angular/common';
import { InvoiceDialogData } from '../../../core/models/invoice-dialog-data.model';

@Component({
  standalone: true,
  selector: 'invoice-dialog',
  imports: [MatButtonModule, MatIconModule, FormatDateTimePipe, DatePipe],
  templateUrl: './invoice-dialog.html',
})
export class InvoiceDialog {
  /** Generates once per dialog */
  readonly invoiceNumber = 'INV-' + Math.floor(1000 + Math.random() * 9000);

  /** Raw date → HTML handles formatting */
  readonly invoiceDate = new Date();

  /** Pricing */
  readonly ratePerHour = 50;
  readonly baseAmount: number;
  readonly taxAmount: number;

  /** TEMPORARY — will move to shared constants later */
  readonly vehicleIcons: Record<VehicleType, string> = {
    CAR: 'directions_car',
    BIKE: 'pedal_bike',
    TRUCK: 'local_shipping',
  };

  constructor(
    private dialogRef: MatDialogRef<InvoiceDialog>,
    @Inject(MAT_DIALOG_DATA) public data: InvoiceDialogData
  ) {
    // Base amount already includes rate calculations
    this.baseAmount = data.amountToPay;

    // GST = 18%
    this.taxAmount = Math.round(this.baseAmount * 0.18);
  }

  close() {
    this.dialogRef.close();
  }

  download() {
    alert('Download Invoice (PDF feature coming soon)');
  }
}
