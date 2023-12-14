import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-user-array',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user-array.component.html',
  styleUrl: './create-user-array.component.css'
})

export class CreateUserArrayComponent {
  mainForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient ) {}

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
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Username: [''],
      Password: [''],
      info: this.formBuilder.group({
        idgroupe: ['', Validators.required],
        idsalle: ['', Validators.required],
        isManager: [false, Validators.required]
      })
    });
  }

  onSubmit(): void {
    const usersArray = this.mainForm.get('users') as FormArray;
    usersArray.controls.forEach((userGroup: AbstractControl<any, any>) => {
      const firstName = userGroup.get('FirstName')?.value;
      const lastName = userGroup.get('LastName')?.value;

      if (firstName && lastName) {
        const firstLetter = firstName.charAt(0);
        const userName = `${firstLetter}${lastName}`.replace(/[^A-Za-z]/g, '').toLowerCase();
        userGroup.get('Username')?.patchValue(userName);

        const currentYear = new Date().getFullYear();
        const password = `${userName}${currentYear}`;
        userGroup.get('Password')?.patchValue(password);
      }
    });

    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwMjU1MzIxMywianRpIjoiMjc3M2YzMjUtNDJlOC00ZGYzLWEwMTUtZDA5ZjdlZTIxMGY4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MiwibmJmIjoxNzAyNTUzMjEzLCJleHAiOjE3MDI1NTQxMTN9.aK-Hi46cjUXMf6jt0IC6NvnLY1YpEbOrADC_1CzwJUg";
    const headers = { 'Authorization': `Bearer ${token}` };
    const body = this.mainForm.value;
    this.http.post('http://localhost:5050/utilisateurs/add', body, { headers }).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error: any) => {
        console.log(error);
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
        infoGroup.addControl('idsalle', new FormControl('', Validators.required));
        infoGroup.addControl('isManager', new FormControl(false, Validators.required));
      } else if (roleControl?.value === 'eleve') {
        infoGroup.addControl('idgroupe', new FormControl('', Validators.required));
      }
    });

  }

  private removeControl(formGroup: AbstractControl | null, controlName: string): void {
    if (formGroup instanceof FormGroup && formGroup.get(controlName)) {
      formGroup.removeControl(controlName);
    }
  }

}
