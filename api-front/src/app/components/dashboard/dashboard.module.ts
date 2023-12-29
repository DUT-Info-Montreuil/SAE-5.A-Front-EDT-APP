import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { CreateUsersComponent } from './create-users/create-users.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CreateUsersComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DashboardModule { }
