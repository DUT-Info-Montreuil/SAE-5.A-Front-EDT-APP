import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { FormCreerUtilisateurComponent } from './form-creer-utilisateur/form-creer-utilisateur.component';
import { FormTrouverUtilisateurComponent } from './form-trouver-utilisateur/form-trouver-utilisateur.component';
import { MenuUtilisateurComponent } from './menu-utilisateur/menu-utilisateur.component';
import { CreerUtilisateurComponent } from './creer-utilisateur/creer-utilisateur.component';
import { CreateUserArrayComponent } from './create-user-array/create-user-array.component';



export const routes: Routes = [
  {path: 'connexion', component: ConnexionComponent},
	{ path: 'form-creer-utilisateur', component: FormCreerUtilisateurComponent },
	{ path: 'form-trouver-utilisateur', component: FormTrouverUtilisateurComponent },
	{ path: 'menu-utilisateur', component: MenuUtilisateurComponent },
  { path: 'creer-utilisateur', component: CreerUtilisateurComponent },
  { path: 'create-user-array', component: CreateUserArrayComponent },
  { path: '', redirectTo: '/connexion', pathMatch: 'full' },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })
  

export class AppRoutes { }

