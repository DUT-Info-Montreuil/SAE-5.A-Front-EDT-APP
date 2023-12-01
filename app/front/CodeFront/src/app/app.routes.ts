import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormCreerUtilisateurComponent } from './form-creer-utilisateur/form-creer-utilisateur.component';
import { FormTrouverUtilisateurComponent } from './form-trouver-utilisateur/form-trouver-utilisateur.component';
import { MenuUtilisateurComponent } from './menu-utilisateur/menu-utilisateur.component';

export const routes: Routes = [
	{ path: 'form-creer-utilisateur', component: FormCreerUtilisateurComponent },
	{ path: 'form-trouver-utilisateur', component: FormTrouverUtilisateurComponent },
	{ path: 'menu-utilisateur', component: MenuUtilisateurComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutes { }


