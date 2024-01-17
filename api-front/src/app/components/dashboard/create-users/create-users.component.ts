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
        return data;
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

  groupeComposeName(groupe:any) {
    let composeName = groupe.Nom;
    if (groupe.idParentGroupe) {
      let parentName = this.groupes.find((grp) => grp.idGroupe == groupe.idParentGroupe);
      composeName = parentName + composeName;
    }
    return composeName;
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

    const token = localStorage.getItem('token');
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

  onFileSelected(event: any): void {
    console.log("onFileSelected");
    console.log(event);
    const file: File = event.target.files[0];
    if (file) {
      this.parseCSV(file);
    }
  }

  parseCSV(file: File): void {
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const csv: string = e.target.result;
      const usersData = this.processCSVData(csv);
      
      this.mainForm.patchValue({
        users: usersData
      });
    
    };
    reader.readAsText(file);
  }

  processCSVData(csv: string): any[] {
    const roleControl = this.mainForm.get('role');
    const usersArray = this.mainForm.get('users') as FormArray;

    usersArray.clear();


    const lines: string[] = csv.split('\n');

    const headers: string[] = lines[0].split(',').map(header => header.trim());

    const usersData: any[] = []; // Change the declaration to an array

    for (let i=1; i<lines.length; i++) {

      if (i !== 1) {
        this.addUser(); // Appel à chaque itération après la première
      }

      const currentLine: string[] = lines[i].split(',').map(value => value.trim());
      console.log("current" + currentLine);
      console.log("headers" + headers);
      if (currentLine.length === headers.length) {
        const user: any = {
          
          "FirstName": currentLine[headers.indexOf('FirstName')],
          "LastName": currentLine[headers.indexOf('LastName')],
          "info": {}
        };

        if (roleControl?.value === 'professeur') {
          user.info.idsalle = currentLine[headers.indexOf('idsalle')];
          user.info.isManager = currentLine[headers.indexOf('isManager')] === 'TRUE';
        }
        console.log("user" + user);
        usersData.push(user); // Use push method to add each user object to the array
      }
    }
    return usersData;
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


