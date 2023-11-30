import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FormCreerUtilisateurComponent } from './form-creer-utilisateur/form-creer-utilisateur.component'; // Importez votre composant

@NgModule({
  declarations: [
    AppComponent,
    FormCreerUtilisateurComponent // Ajoutez votre composant ici
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
    // Ajoutez d'autres modules nécessaires à votre application
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
