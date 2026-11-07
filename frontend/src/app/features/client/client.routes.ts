import { Routes } from '@angular/router';
import { ClientShellComponent } from './client-shell/client-shell.component';
import { HomeComponent } from './home/home.component';
import { TrackingComponent } from './tracking/tracking.component';
import { HistoryComponent } from './history/history.component';
import { ProfileComponent } from './profile/profile.component';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: ClientShellComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'tracking', component: TrackingComponent },
      { path: 'tracking/:id', component: TrackingComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];
