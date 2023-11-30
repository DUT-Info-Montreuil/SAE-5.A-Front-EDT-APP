import { Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import {TotoComponent} from "./toto/toto.component";

export const routes: Routes = [
    {path: 'connexion', component: ConnexionComponent},
    {path: 'toto', component: TotoComponent}
];
