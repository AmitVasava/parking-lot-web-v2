import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { ParkingFloor } from '../models/floor.model';
import { MatDialog } from '@angular/material/dialog';
import { ParkingTicket } from '../models/ticket.model';
import { inject } from '@angular/core';
import { SpotActionPayload } from '../models/spot-card.actions';
import { ParkVehicleDialog } from '../../shared/dialogs/park-vehicle-dialog/park-vehicle-dialog';
import { UnparkVehicleDialog } from '../../shared/dialogs/unpark-vehicle-dialog/unpark-vehicle-dialog';
import { VehicleType } from '../models/vehicle-type.enum';
import { InvoiceDialog } from '../../shared/dialogs/invoice-dialog/invoice-dialog';
import { InvoiceDialogData } from '../models/invoice-dialog-data.model';
import { ParkVehicleDialogData } from '../models/park-vehicle-dialog-data.model';

// -----------------------------------------
// CONSTANTS
// -----------------------------------------
const RATE_PER_HOUR = 50;

// -----------------------------------------
// HELPERS
// -----------------------------------------
function formatDate(date: Date) {
  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export const ParkingLotStore = signalStore(
  { providedIn: 'root' },

  // -----------------------------------------
  // INITIAL STATE
  // -----------------------------------------
  withState({
    floors: [
      {
        floorId: 1,
        floorName: 'Floor 1',
        spots: [
          {
            spotId: 1,
            spotName: 'Floor 1 - Spot 1',
            allowedType: VehicleType.CAR,
            occupied: false,
          },
          {
            spotId: 2,
            spotName: 'Floor 1 - Spot 2',
            allowedType: VehicleType.BIKE,
            occupied: false,
          },
          {
            spotId: 3,
            spotName: 'Floor 1 - Spot 3',
            allowedType: VehicleType.CAR,
            occupied: false,
          },
          {
            spotId: 4,
            spotName: 'Floor 1 - Spot 4',
            allowedType: VehicleType.TRUCK,
            occupied: false,
          },
        ],
      },
      {
        floorId: 2,
        floorName: 'Floor 2',
        spots: [
          {
            spotId: 5,
            spotName: 'Floor 2 - Spot 1',
            allowedType: VehicleType.TRUCK,
            occupied: false,
          },
          {
            spotId: 6,
            spotName: 'Floor 2 - Spot 2',
            allowedType: VehicleType.BIKE,
            occupied: false,
          },
          {
            spotId: 7,
            spotName: 'Floor 2 - Spot 3',
            allowedType: VehicleType.BIKE,
            occupied: false,
          },
        ],
      },
    ],
    tickets: [] as ParkingTicket[],
  }),

  // -----------------------------------------
  // METHODS
  // -----------------------------------------
  withMethods((store, dialog = inject(MatDialog)) => ({
    // 🔍 Find a ticket for a spot
    findTicket(floorId: number, spotId: number) {
      return store.tickets().find((t) => t.floorId === floorId && t.spotId === spotId);
    },

    // ♻ Reusable function to update a spot's occupied state
    setSpotOccupied(floorId: number, spotId: number, occupied: boolean) {
      const updatedFloors = store.floors().map((floor) =>
        floor.floorId === floorId
          ? {
              ...floor,
              spots: floor.spots.map((s) => (s.spotId === spotId ? { ...s, occupied } : s)),
            }
          : floor
      );

      patchState(store, { floors: updatedFloors });
    },

    // 💰 Invoice calculation
    generateInvoice(ticket: ParkingTicket, paymentMethod: string) {
      const parkedDate = new Date(ticket.parkedAt);
      const unparkDate = new Date();

      const durationMinutes = Math.max(
        1,
        Math.round((unparkDate.getTime() - parkedDate.getTime()) / 60000)
      );

      const amountToPay = Math.ceil((durationMinutes / 60) * RATE_PER_HOUR);

      return {
        parkedAtDisplay: formatDate(parkedDate),
        unparkedAtDisplay: formatDate(unparkDate),
        durationMinutes,
        amountToPay,
        unparkDate,
      };
    },

    // -----------------------------------------------------
    // OPEN PARK DIALOG
    // -----------------------------------------------------
    openParkDialog(payload: SpotActionPayload) {
      dialog
        .open(ParkVehicleDialog, {
          disableClose: true,
          panelClass: 'custom-dialog-panel',
          maxWidth: 'none',
          data: {
            floorName: payload.floorName,
            spotName: payload.spot.spotName,
            allowedType: payload.spot.allowedType,
          } satisfies ParkVehicleDialogData,
        })
        .afterClosed()
        .subscribe((result) => {
          if (!result?.vehicleNumber) return;

          this.parkVehicle(
            payload.floorId,
            payload.spot.spotId,
            result.vehicleNumber,
            result.driverName,
            payload.spot.allowedType
          );
        });
    },

    // -----------------------------------------------------
    // PARK VEHICLE
    // -----------------------------------------------------
    parkVehicle(
      floorId: number,
      spotId: number,
      vehicleNumber: string,
      driverName: string,
      vehicleType: VehicleType
    ) {
      const nextId =
        store.tickets().length > 0 ? Math.max(...store.tickets().map((t) => t.ticketId)) + 1 : 1;

      const newTicket: ParkingTicket = {
        ticketId: nextId,
        ticketNumber: `TKT-${nextId.toString().padStart(3, '0')}`,
        driverName,
        floorId,
        spotId,
        vehicleNumber,
        vehicleType,
        parkedAt: new Date().toISOString(),
      };

      this.setSpotOccupied(floorId, spotId, true);

      patchState(store, {
        tickets: [...store.tickets(), newTicket],
      });

      return newTicket;
    },

    // -----------------------------------------------------
    // OPEN UNPARK DIALOG
    // -----------------------------------------------------
    openUnparkDialog(payload: SpotActionPayload) {
      const ticket = this.findTicket(payload.floorId, payload.spot.spotId);
      if (!ticket) return;

      dialog
        .open(UnparkVehicleDialog, {
          disableClose: true,
          panelClass: 'custom-dialog-panel',
          maxWidth: 'none',
          data: {
            floorName: payload.floorName,
            spotName: payload.spot.spotName,
            allowedType: payload.spot.allowedType,
            driverName: ticket.driverName,
            ticketNumber: ticket.ticketNumber,
            vehicleNumber: ticket.vehicleNumber,
            parkedAt: ticket.parkedAt,
          },
        })
        .afterClosed()
        .subscribe((result) => {
          if (!result) return;

          const invoice = this.generateInvoice(ticket, result.paymentMethod);

          this.unparkVehicle(payload.floorId, payload.spot.spotId);

          dialog.open(InvoiceDialog, {
            disableClose: false,
            panelClass: 'custom-dialog-panel',
            maxWidth: 'none',
            data: {
              floorName: payload.floorName,
              spotName: payload.spot.spotName,
              vehicleType: payload.spot.allowedType,
              vehicleNumber: ticket.vehicleNumber,
              driverName: ticket.driverName,
              ticketNumber: ticket.ticketNumber,
              paymentMethod: result.paymentMethod,

              parkedAt: ticket.parkedAt,
              unparkedAt: invoice.unparkDate.toISOString(),

              durationMinutes: invoice.durationMinutes,
              amountToPay: invoice.amountToPay,
            } satisfies InvoiceDialogData,
          });
        });
    },

    // -----------------------------------------------------
    // UNPARK VEHICLE
    // -----------------------------------------------------
    unparkVehicle(floorId: number, spotId: number) {
      this.setSpotOccupied(floorId, spotId, false);

      const updatedTickets = store
        .tickets()
        .filter((t) => !(t.floorId === floorId && t.spotId === spotId));

      patchState(store, { tickets: updatedTickets });
    },
  }))
);
