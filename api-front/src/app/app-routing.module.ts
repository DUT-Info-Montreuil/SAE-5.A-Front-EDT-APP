import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* import components */
import { ConnexionComponent } from './components/connexion/connexion.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import { HomeComponent } from './components/home/home.component';
import {ScheduleComponent} from "./components/schedule/schedule.component";
import {ScheduleEditComponent} from "./components/schedule/schedule-edit/schedule-edit.component";
import {ScheduleReadonlyComponent} from "./components/schedule/schedule-readonly/schedule-readonly.component";


export const appRoutes: Routes = [
  { path: 'connexion', component: ConnexionComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path:'home', component:HomeComponent },
  { path:'', component:HomeComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'schedule', component: ScheduleComponent},
  { path: 'schedule/edit', component: ScheduleEditComponent},
  { path: 'schedule/readonly', component: ScheduleReadonlyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
