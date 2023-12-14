import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-creer-utilisateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './creer-utilisateur.component.html',
  styleUrl: './creer-utilisateur.component.css'
})
export class CreerUtilisateurComponent {
  userForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    userName: new FormControl(''),
    password: new FormControl(''),
    role: new FormControl('', Validators.required),
    info: new FormGroup({})
  });

  constructor(private http: HttpClient) { }

  onSubmit() {
    const firstName = this.userForm.get('firstName')?.value;
    const lastName = this.userForm.get('lastName')?.value;

    if (firstName && lastName) {
      const firstLetter = firstName.charAt(0); 
      const userName = `${firstLetter}${lastName}`.replace(/[^A-Za-z]/g, '').toLowerCase();
      this.userForm.get('userName')?.patchValue(userName); 

      const currentYear = new Date().getFullYear();
      const password = `${userName}${currentYear}`;
      this.userForm.get('password')?.patchValue(password);
    }
    
    
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwMjQ1OTUwNSwianRpIjoiZWJkZmI5ZTktMmUwZS00MDVjLTllOTEtYjRlNmM4NDQzZjIyIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IlVydWsiLCJuYmYiOjE3MDI0NTk1MDUsImV4cCI6MTcwMjQ2MDQwNX0.267ppzQDiToAaxbIY3pcF-8652CjAK7nhQubC-GMN2s"

    //const token = localStorage.getItem('token');
    const body = this.userForm.value;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };


    this.http.post('http://localhost:5050/utilisateurs/add', body, httpOptions)
    .subscribe({
      next: (response: any) => {
        console.log('Réponse de l\'API :', response);
      },
      error: (error: any) => {
        console.error('Erreur lors de la requête :', error);
      }
    });
  
    console.warn(this.userForm.value);
  }

  onRoleChange(): void {
    const roleControl = this.userForm.get('role');
    const infoGroup = this.userForm.get('info') as FormGroup;

    // Supprimer tous les contrôles existants dans le groupe "info"
    Object.keys((infoGroup as FormGroup).controls).forEach((controlName: string) => {
      this.removeControl(infoGroup, controlName);
    });

    // Ajouter les contrôles spécifiques pour le rôle sélectionné
    if (roleControl?.value === 'professeur') {
      infoGroup?.addControl('idSalle', new FormControl('', Validators.required));
      infoGroup?.addControl('isManager', new FormControl(false, Validators.required));
    } else if (roleControl?.value === 'eleve') {  
      infoGroup?.addControl('idGroupe', new FormControl('', Validators.required));
    }
  }

  private removeControl(formGroup: AbstractControl | null, controlName: string): void {
    if (formGroup instanceof FormGroup && formGroup.get(controlName)) {
      formGroup.removeControl(controlName);
    }
  }
}

