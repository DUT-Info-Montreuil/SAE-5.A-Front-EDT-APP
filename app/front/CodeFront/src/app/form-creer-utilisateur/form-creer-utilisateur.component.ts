import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AxiosService } from './axios.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-creer-utilisateur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<h2>Formulaire 1</h2><!-- Ajoutez ici le contenu de votre formulaire -->`,
  templateUrl: './form-creer-utilisateur.component.html',
  styleUrl: './form-creer-utilisateur.component.css'
})
export class FormCreerUtilisateurComponent {
	formData: any = {
		FirstName: '',
		LastName: '',
		IdUtilisateur: '',
		Username: '',
		PassWord: ''
    };
	
	constructor(private router: Router, private axiosService: AxiosService) { }
	
  redirectToPage() {
	this.router.navigate(['/menu-utilisateur']);
  }
  
  onSubmit() {
    this.axiosService.postData(this.formData).subscribe(response => {
      console.log('Réponse de la requête POST :', response);
      // Gérez la réponse comme nécessaire
    });
  }
}



 
