import { Routes } from '@angular/router';
import { DriverShellComponent } from './driver-shell/driver-shell.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EarningsComponent } from './earnings/earnings.component';
import { HistoryComponent } from './history/history.component';
import { RequestsComponent } from './requests/requests.component';

export const DRIVER_ROUTES: Routes = [
  {
    path: '',
    component: DriverShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'earnings', component: EarningsComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'requests', component: RequestsComponent }
    ]
  }
];
