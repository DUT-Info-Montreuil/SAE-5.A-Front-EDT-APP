import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AxiosService } from './axios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-trouver-utilisateur',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>Formulaire 2</h2><!-- Ajoutez ici le contenu de votre formulaire -->`,
  templateUrl: './form-trouver-utilisateur.component.html',
  styleUrl: './form-trouver-utilisateur.component.css'
})

export class FormTrouverUtilisateurComponent implements OnInit {
  data: any;

  constructor(private axiosService: AxiosService, private router: Router) { }

  ngOnInit(): void {
    this.axiosService.getData().subscribe(response => {
      this.data = response;
    });
  }
  
  redirectToPage() {
	this.router.navigate(['/menu-utilisateur']);
  }
}
