// Exemple : NavigationUtilisateurService.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationUtilisateurService {
  constructor(private router: Router) {}

  navigateToForm1() {
    this.router.navigate(['/form-creer-utilisateur']);
  }

  navigateToForm2() {
    this.router.navigate(['/form-trouver-utilisateur']);
  }

  // Ajoutez d'autres méthodes de navigation au besoin
}
