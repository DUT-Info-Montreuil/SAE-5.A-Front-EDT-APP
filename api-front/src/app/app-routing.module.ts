import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* import components */
import { CalendarComponent } from './components/calendar/calendar.component';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { CreateUsersComponent } from './components/dashboard/create-users/create-users.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const appRoutes: Routes = [
  { path: 'calendar', component: CalendarComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'create-users', component: CreateUsersComponent },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
