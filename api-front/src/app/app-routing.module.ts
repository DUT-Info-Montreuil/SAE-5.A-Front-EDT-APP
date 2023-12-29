import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* import components */
import { ConnexionComponent } from './components/connexion/connexion.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {SidebarComponent} from "./components/sidebar/sidebar.component";

export const appRoutes: Routes = [
  { path: 'connexion', component: ConnexionComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sidebar', component: SidebarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
