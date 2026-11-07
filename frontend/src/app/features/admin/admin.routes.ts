import { Routes } from '@angular/router';
import { AdminShellComponent } from './admin-shell/admin-shell.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DriversComponent } from './drivers/drivers.component';
import { RidesComponent } from './rides/rides.component';
import { TariffsComponent } from './tariffs/tariffs.component';
import { AccountsComponent } from './accounts/accounts.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'drivers', component: DriversComponent },
      { path: 'rides', component: RidesComponent },
      { path: 'tariffs', component: TariffsComponent },
      { path: 'accounts', component: AccountsComponent }
    ]
  }
];
