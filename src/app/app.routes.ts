import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { ManageFloors } from './features/floors/pages/manage-floors/manage-floors';
import { ParkVehicle } from './features/parking/pages/park-vehicle/park-vehicle';
import { Tickets } from './features/tickets/pages/tickets/tickets';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'floors', pathMatch: 'full' },
      { path: 'floors', component: ManageFloors },
      { path: 'parking', component: ParkVehicle },
      { path: 'tickets', component: Tickets },
    ],
  },
];
