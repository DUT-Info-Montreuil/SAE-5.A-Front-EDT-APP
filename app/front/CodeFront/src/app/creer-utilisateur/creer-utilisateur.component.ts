import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-creer-utilisateur',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './creer-utilisateur.component.html',
  styleUrl: './creer-utilisateur.component.css'
})
export class CreerUtilisateurComponent {
  nom = new FormControl('');

  
  updateNom() {
    this.nom.setValue('Nancy');
  }
}

