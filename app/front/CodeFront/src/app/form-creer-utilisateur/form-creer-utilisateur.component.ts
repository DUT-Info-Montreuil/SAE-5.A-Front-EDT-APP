import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-creer-utilisateur',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>Formulaire 1</h2><!-- Ajoutez ici le contenu de votre formulaire -->`,
  templateUrl: './form-creer-utilisateur.component.html',
  styleUrl: './form-creer-utilisateur.component.css'
})
export class FormCreerUtilisateurComponent {
	constructor(private router: Router) { }
	
  redirectToPage() {
	this.router.navigate(['/menu-utilisateur']);
  }
}
