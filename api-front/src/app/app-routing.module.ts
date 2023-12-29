import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* import components */
import { ConnexionComponent } from './components/connexion/connexion.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const appRoutes: Routes = [
  { path: 'connexion', component: ConnexionComponent },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
