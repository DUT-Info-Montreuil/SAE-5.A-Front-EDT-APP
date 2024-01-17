import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* import components */
import { ConnexionComponent } from './components/connexion/connexion.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import { ProfileComponent } from './components/profile/profile.component';

import { FirstLoginComponent} from './components/first-login/first-login.component';

import { EdtCalendarComponent } from "./components/edt-calendar/edt-calendar.component";


export const appRoutes: Routes = [
  { path: 'connexion', component: ConnexionComponent },
  { path: 'dashboard', component: DashboardComponent },

  { path: 'sidebar', component: SidebarComponent },

  { path: 'edt-calendar', component: EdtCalendarComponent},
  { path: 'sidebar', component: SidebarComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'first-login', component: FirstLoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
