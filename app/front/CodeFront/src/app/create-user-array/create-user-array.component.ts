import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-user-array',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user-array.component.html',
  styleUrl: './create-user-array.component.css'
})

export class CreateUserArrayComponent {
  mainForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }
 
  initializeForm(): void {
    this.mainForm = this.formBuilder.group({
      role: ['', Validators.required],
      users: this.formBuilder.array([this.createUserForm()])
    });
  }

  
  createUserForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: [''],
      password: [''],
      info: this.formBuilder.group({
        idGroupe: ['', Validators.required],
        idSalle: ['', Validators.required],
        isManager: [false, Validators.required]
      })
    });
  }

  onSubmit(): void {
    const usersArray = this.mainForm.get('users') as FormArray;

    usersArray.controls.forEach((userGroup: AbstractControl<any, any>) => {
      const firstName = userGroup.get('firstName')?.value;
      const lastName = userGroup.get('lastName')?.value;

      if (firstName && lastName) {
        const firstLetter = firstName.charAt(0);
        const userName = `${firstLetter}${lastName}`.replace(/[^A-Za-z]/g, '').toLowerCase();
        userGroup.get('userName')?.patchValue(userName);

        const currentYear = new Date().getFullYear();
        const password = `${userName}${currentYear}`;
        userGroup.get('password')?.patchValue(password);
      }
    });
    
  }


  get userFormArray(): FormArray | null {
    return this.mainForm.get('users') as FormArray;
  }
  addUser(): void {
    if (this.userFormArray) {
      const newUserForm = this.createUserForm(); // Crée un nouveau FormGroup pour le nouvel utilisateur
      this.userFormArray.push(newUserForm); // Ajoute le nouvel utilisateur au FormArray
    }
  }
  removeUser(index: number): void {
    if (this.userFormArray && index !== 0) {
      this.userFormArray.removeAt(index);
    }
  }
  

  onRoleChange(): void {
    const roleControl = this.mainForm.get('role');
    const usersArray = this.mainForm.get('users') as FormArray;

    // Supprimer tous les contrôles existants dans le groupe "info"
    usersArray.controls.forEach((userGroup: AbstractControl<any, any>) => {
      const infoGroup = userGroup.get('info') as FormGroup;
      Object.keys(infoGroup.controls).forEach((controlName: string) => {
        this.removeControl(infoGroup, controlName);
      });

      // Ajouter les contrôles spécifiques pour le rôle sélectionné pour chaque utilisateur
      if (roleControl?.value === 'professeur') {
        infoGroup.addControl('idSalle', new FormControl('', Validators.required));
        infoGroup.addControl('isManager', new FormControl(false, Validators.required));
      } else if (roleControl?.value === 'eleve') {
        infoGroup.addControl('idGroupe', new FormControl('', Validators.required));
      }
    });

  }

  private removeControl(formGroup: AbstractControl | null, controlName: string): void {
    if (formGroup instanceof FormGroup && formGroup.get(controlName)) {
      formGroup.removeControl(controlName);
    }
  }

}
