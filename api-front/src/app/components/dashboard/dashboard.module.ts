import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EdtCalendarComponent } from '../edt-calendar/edt-calendar.component';
import  { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { RoomManagerComponent } from './room-manager/room-manager.component';
import { RessourceManagerComponent } from './ressource-manager/ressource-manager.component';
import { GroupManagerComponent } from './group-manager/group-manager.component';
import { SemestreComponent } from './semestre/semestre.component';
import { EquipementManagerComponent } from './equipement-manager/equipement-manager.component';

import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';


@NgModule({
  declarations: [
    DashboardComponent,
    CreateUsersComponent,
    EdtCalendarComponent,
    RoomManagerComponent,
    RessourceManagerComponent,
    GroupManagerComponent,
    SemestreComponent,
    EquipementManagerComponent,
    UserManagerComponent
  ],
  exports: [
    EdtCalendarComponent
  ],
  imports: [
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatCardModule,
    MatAutocompleteModule,
    CdkDropList,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    AsyncPipe,




  ]
})
export class DashboardModule { }
