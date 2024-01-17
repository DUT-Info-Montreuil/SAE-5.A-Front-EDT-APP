import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* import components */
import { ConnexionComponent } from './components/connexion/connexion.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {SidebarComponent} from "./components/sidebar/sidebar.component";

import { EdtCalendarComponent } from "./components/edt-calendar/edt-calendar.component";


export const appRoutes: Routes = [
  { path: 'connexion', component: ConnexionComponent },
  { path: 'dashboard', component: DashboardComponent },

  { path: 'sidebar', component: SidebarComponent },

  { path: 'edt-calendar', component: EdtCalendarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
