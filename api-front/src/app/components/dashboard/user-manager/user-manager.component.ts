import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { set } from 'date-fns';
import { Utilisateur } from '../models/utilisateur.model';
import { Subscription } from 'rxjs';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css'
})
export class UserManagerComponent {
  searchUser : Utilisateur[] = [];
  allUsers : Utilisateur[] = [];
  ShowCreateUser : boolean = false;
  showModalModifUser : boolean = false;
  showSuprUser : boolean = false;
  idChangeUser : number = 0;
  idDelUser : number = 0;
  DelUserLastName : any;

  sub : Subscription[] = [];


  constructor( private http: HttpClient , private search : SearchService ) {}


  ngOnInit(): void {

    this.sub.push(
      this.search.utilisateur$.subscribe((data : Utilisateur[]) => {
        this.allUsers = data;
        this.searchUser = data;
      })
    )

    this.loadAllUsers();
  } 



  toggleCreateUser(){
    this.ShowCreateUser = !this.ShowCreateUser;
    if (!this.ShowCreateUser){
      this.loadAllUsers();
    }
  }
  togglleModalModifUser(){
    if (!this.showSuprUser){
      this.showModalModifUser = !this.showModalModifUser;
    }

  }

  


  toggleSuprUser(id? : number){
    this.showSuprUser = !this.showSuprUser;
    if (id){
      this.idDelUser = id;
      let u  = this.allUsers.filter((user : any) => user.idUtilisateur == id)[0];
      this.DelUserLastName = u.userName;

    }
    if (!this.showSuprUser){
      this.idDelUser = 0;
      this.DelUserLastName = "";
    }



  }

  delUser(){
    const token = localStorage.getItem('token');
    const header = { 'Authorization': `Bearer ${token}` };
    this.http.delete('http://localhost:5050/utilisateurs/delete/'+this.idDelUser, { headers: header }).subscribe((res: any) => {
      
      this.loadAllUsers();
      
    });




  }

  chargerUser(id : number){
    console.log(id);
    this.idChangeUser = id;
    this.togglleModalModifUser();
    setTimeout(() => {
      let u  = this.allUsers.filter((user : any) => user.idUtilisateur == id)[0];
      const nom = document.getElementById("modifNomEleve") as HTMLInputElement;
      const prenom = document.getElementById("modifPrenomEleve") as HTMLInputElement;
      const userName = document.getElementById("modifUserNameEleve") as HTMLInputElement;


      nom.value = u.nom;
      prenom.value = u.prenom;
      userName.value = u.userName;

    } , 0 );


  }

  changerUser() {
    const nom = document.getElementById("modifNomEleve") as HTMLInputElement;
    const prenom = document.getElementById("modifPrenomEleve") as HTMLInputElement;
    const userName = document.getElementById("modifUserNameEleve") as HTMLInputElement;
    const password = document.getElementById("modifPasswordEleve") as HTMLInputElement;
    const role = document.getElementById("modifRoleEleve") as HTMLInputElement;

    const token = localStorage.getItem('token');
    const header = { 'Authorization': `Bearer ${token}` };
    const body = {
      "idUtilisateur" : this.idChangeUser,
      "LastName" : nom.value,
      "FirstName" : prenom.value,
      "Username" : userName.value
    }
    this.http.put('http://localhost:5050/utilisateurs/update/'+this.idChangeUser, body, { headers: header }).subscribe((res: any) => {
      console.log(res);
      this.loadAllUsers();
      
    });


  }

  getStringRole(id : number) : string{
    switch(id) {
      case 0:
          return "Administrateur";
      case 1:
          return "Gestionnaire";
      case 2:
          return "Professeur";
      case 3:
          return "Etudiant";
      default:
          return "Inconnu";
    }
  }



  toggleModalModifEleve(){
    this.showModalModifUser = !this.showModalModifUser;

  }


  loadAllUsers(){
    this.search.updateUtilisateur();
  }


}
