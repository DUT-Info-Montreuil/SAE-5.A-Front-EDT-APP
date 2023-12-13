import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';

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
      info: this.formBuilder.group({
        idGroupe: [''],
        idSalle: [''],
        isManager: ['']
      })
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
    
  }

  onSubmit(): void {
    if (this.mainForm.valid) {
      // Handle form submission
      console.log(this.mainForm.value);
    }
  }

}
