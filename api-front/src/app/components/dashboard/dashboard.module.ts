import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar/calendar.component';

import  { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { RoomManagerComponent } from './room-manager/room-manager.component';
import { RessourceManagerComponent } from './ressource-manager/ressource-manager.component';
import { GroupManagerComponent } from './group-manager/group-manager.component';
@NgModule({
  declarations: [
    DashboardComponent,
    CreateUsersComponent,
    CalendarComponent,
    RoomManagerComponent,
    RessourceManagerComponent,
    GroupManagerComponent
  ],
  imports: [
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
