import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrl: './create-users.component.css',
})
export class CreateUsersComponent {
  mainForm!: FormGroup;
  groupes: any[] = [];
  salles: any[] = [];

  constructor(private formBuilder: FormBuilder, private http: HttpClient ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadGroupes();
    this.loadSalles();
  }

  initializeForm(): void {
    this.mainForm = this.formBuilder.group({
      role: ['', Validators.required],
      users: this.formBuilder.array([this.createUserForm()])
    });
  }

  loadGroupes(): void {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.get('http://localhost:5050/groupe/getAll', { headers }).subscribe({
      next: (data: any) => {
        console.log(data);
        this.groupes = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  loadSalles(): void {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.get('http://localhost:5050/salle/getAll', { headers }).subscribe({
      next: (data: any) => {
        console.log(data);
        this.salles = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  createUserForm(): FormGroup {
    return this.formBuilder.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Username: [''],
      Password: [''],
      info: this.formBuilder.group({
      })
    });
  }

  onSubmit(): void {
    const usersArray = this.mainForm.get('users') as FormArray;
    const roleControl = this.mainForm.get('role');
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

        if (roleControl?.value === 'professeur') {
          const initiale = `${firstLetter}${lastName.charAt(0)}`.toUpperCase();
          userGroup.get('info.Initiale')?.patchValue(initiale);
        }
      }
    });

    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwMjU1ODA5NiwianRpIjoiNzk5MTBmYTEtZTE4Ny00ZjljLWIwNjgtOGI5NTI3ZmYxM2NkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MiwibmJmIjoxNzAyNTU4MDk2LCJleHAiOjE3MDI1NTg5OTZ9.HoGBLbY39DdJ34Crbct6CUUGEHkjM7fV-6efcTLW94w";
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
      let userForm;
      const roleControl = this.mainForm.get('role');
      if (roleControl?.value === 'professeur') {
        //create userForm with idsalle, isManager
        userForm = this.formBuilder.group({
          FirstName: ['', Validators.required],
          LastName: ['', Validators.required],
          Username: [''],
          Password: [''],
          info: this.formBuilder.group({
            Initiale: [''],
            idsalle: ['', Validators.required],
            isManager: [false, Validators.required]
          })
        });
      } else if (roleControl?.value === 'eleve') {
        //create userForm with idgroupe
        userForm = this.formBuilder.group({
          FirstName: ['', Validators.required],
          LastName: ['', Validators.required],
          Username: [''],
          Password: [''],
          info: this.formBuilder.group({
            idgroupe: ['', Validators.required]
          })
        });
      }else{
        //create userForm
        userForm = this.createUserForm();
      }
      this.userFormArray.push(userForm);
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
        infoGroup.addControl('Initiale', new FormControl(''));
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


