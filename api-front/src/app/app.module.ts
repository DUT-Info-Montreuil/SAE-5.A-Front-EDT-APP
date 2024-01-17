import {Injectable, LOCALE_ID, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProfileModule } from './components/profile/profile.module';

import {registerLocaleData} from "@angular/common";
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import localeFr from '@angular/common/locales/fr';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarNativeDateFormatter, DateAdapter,
  DateFormatterParams
} from "angular-calendar";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import { EdtCalendarComponent } from './components/edt-calendar/edt-calendar.component';
import {MatSelectModule} from "@angular/material/select";
registerLocaleData(localeFr)

@Injectable()
class CustomDateFormatter extends CalendarNativeDateFormatter {
  @Injectable()
  public override weekViewHour({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  }
  @Injectable()
  public override dayViewHour({date, locale}: DateFormatterParams): string {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  }


}

@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    SidebarComponent,
    NavbarComponent,

  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    DashboardModule,
    ProfileModule,
    CalendarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CustomDateFormatter
        }
      }),
    CdkDrag,
    CdkDropList,
    MatOptionModule,
    MatSelectModule,

  ],
  providers: [
    {provide: LOCALE_ID, useValue:'fr-FR'},
    {provide: CalendarDateFormatter, useClass: CustomDateFormatter}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
