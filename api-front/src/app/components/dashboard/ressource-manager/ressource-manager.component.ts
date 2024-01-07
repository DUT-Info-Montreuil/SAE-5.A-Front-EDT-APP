import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { th } from 'date-fns/locale';


@Component({
  selector: 'app-ressource-manager',
  templateUrl: './ressource-manager.component.html',
  styleUrl: './ressource-manager.component.css'
})
export class RessourceManagerComponent {
  ressources: any ;
  idInetval : any;
  showModalCreateRessource = false;
  showModalModifressource = false;


  toggleCreateRessource(){
    this.showModalCreateRessource = !this.showModalCreateRessource;
  }

  toggleModalModifRessource(){
    this.showModalModifressource = !this.showModalModifressource;
  }

  changeRessource(){
    
  }

  addRessource(){

  }

  getSemestre(){
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get('http://localhost:5050/Semestre/getAll', { headers })

  }

  loadRessources() :any {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get('http://localhost:5050/ressource/getAll', { headers })



  }


  constructor( private http: HttpClient ) {}

  ngOnInit(): void {
    //this.initializeForm();
    //this.loadGroupes();
    //charger les salles au chargeement de la page
    this.loadRessources().subscribe(
      (data: any) => {
      this.ressources = data
      
      }
    );
      
      //cree un interval pour recharger les salles toutes les 2 minutes
    this.idInetval = setInterval(() => {
      this.loadRessources().subscribe(
        (data: any) => {
        this.ressources = data
        
        }
      );
        
    }, 1000*60*2);

    
    

  }


  ngOnDestroy() {
    if (this.idInetval) {
      clearInterval(this.idInetval);
    }
  }

  

  
  

}
