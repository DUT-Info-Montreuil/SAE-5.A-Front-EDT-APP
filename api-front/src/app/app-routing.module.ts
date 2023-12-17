import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* import components */
import { CalendarComponent } from './calendar/calendar.component';
import { CreateUsersComponent } from './create-users/create-users.component';



export const appRoutes: Routes = [
  { path: 'calendar', component: CalendarComponent },
  { path: 'create-users', component: CreateUsersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
