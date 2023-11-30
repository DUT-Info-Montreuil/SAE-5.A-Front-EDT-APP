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
	
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private router: Router, private axiosService: AxiosService) { }
	
  redirectToPage() {
	this.router.navigate(['/menu-utilisateur']);
  }
  
  onSubmit() {
	  
	const FirstName = this.formData.FirstName;
    const LastName = this.formData.LastName;
	const IdUtilisateur = this.formData.IdUtilisateur;
    const Username = this.formData.Username;
	const PassWord = this.formData.PassWord;

    const postData = {
      FirstName: FirstName,
      LastName: LastName,
	  IdUtilisateur: IdUtilisateur,
      Username: Username,
	  PassWord: PassWord,
    };
	
    this.axiosService.postData(postData).subscribe(
      response => {
        console.log('Réponse de la requête POST :', response);
        this.successMessage = 'Formulaire envoyé avec succès!';
        this.errorMessage = ''; // Effacer le message d'erreur s'il y en avait un
      },
      error => {
        console.error('Erreur lors de la requête POST :', error);
        this.successMessage = ''; // Effacer le message de succès s'il y en avait un
        this.errorMessage = 'Une erreur s\'est produite lors de l\'envoi du formulaire.';
      }
    );
  }
}



 
