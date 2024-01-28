import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { th } from 'date-fns/locale';
import { set } from 'date-fns';
import { Subscription, timeout } from 'rxjs';
import { SearchService } from '../services/search.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Ressource } from '../models/ressource.model';



@Component({
  selector: 'app-ressource-manager',
  templateUrl: './ressource-manager.component.html',
  styleUrl: './ressource-manager.component.css'
})
export class RessourceManagerComponent {
  ressources: Ressource[] = [] ;
  searchRessources : any;
  semestres: any;
  allProf : any;
  idInetval : any;
  showModalCreateRessource = false;
  showModalModifressource = false;
  idChangeRessource : any;
  showSuprRessource = false;
  idSuprRessource : any;
  NameSuprRessource : any;  
  ControlProf : any;

  sub : Subscription[] = [];

  constructor( private http: HttpClient , private search : SearchService) {}

  ngOnInit(): void {
    //this.initializeForm();
    //this.loadGroupes();
    //charger les salles au chargeement de la page
    this.sub.push(
      this.search.ressource$.subscribe((data : Ressource[]) => {
        this.ressources = data;
        this.searchRessources = data;
      })
    ) 
    this.loadRessources();
    this.loadSemestre()

      //cree un interval pour recharger les salles toutes les 2 minutes
    this.idInetval = setInterval(() => {
      this.loadRessources();
      this.loadSemestre();
    }, 1000*60*2);

    const search : any = document.getElementById('ressource-search');
    console.log(search);
    search.addEventListener("keyup", (e :any ) => {
      const searchString : string = e.target.value.toLowerCase();
      if (searchString != "" ) {
        this.searchRessources  = this.ressources.filter((e : any) => {return e.nom.toLowerCase().startsWith(searchString.toLowerCase())});
      }else {
        this.searchRessources =  this.ressources;
      }
    });
    this.ControlProf = new FormControl();
  }

  ngOnDestroy() {
    if (this.idInetval) {
      clearInterval(this.idInetval);
    }
    this.sub.forEach((s : any) => s.unsubscribe());
  }

  delRessource(){
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.delete('http://localhost:5050/ressource/delete/'+this.idSuprRessource , {headers}).subscribe(()=> { 
      this.loadRessources() });
  }

  toggleSuprRessource(id? : any){
    this.showSuprRessource = !this.showSuprRessource;
    if (this.showSuprRessource){
      this.idSuprRessource = id;
      const ressource : any = this.ressources.find((r : any) => r.idressource == id);
      this.NameSuprRessource = ressource.titre;
    }
  }

  toggleCreateRessource(){
    this.showModalCreateRessource = !this.showModalCreateRessource;
    if (this.showModalCreateRessource == true) {
      this.loadSemestre();
      //this.loadProf();
    }
  }

  toggleModalModifRessource(){
    if(this.showSuprRessource==false){
    this.showModalModifressource = !this.showModalModifressource;
    }
  }

  showModifRessource(){
    if(this.showSuprRessource==false){
    this.showModalModifressource = true;
    }
  }

  loadProf():any {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get('http://localhost:5050/utilisateurs/getProf', { headers }).subscribe((res: any) => {
      this.allProf = res;
    });
  }
  
  chargerRessource(id : any){
    this.showModifRessource();
    //time out pour attendre que le modal soit afficher
    this.idChangeRessource = id;
    this.loadSemestre() ; 
   
    setTimeout(() => {
    
      const ressource : any = this.ressources.find((r : any) => r.idressource == id);
      const nomRessource : any = document.getElementById('modifNomRessource')
      const numeroRessource : any = document.getElementById('modifNumeroRessource')
      const nbrHeureRessource : any  = document.getElementById('modiftNbrHeureRessource')
      const ressourceSelect : any  = document.getElementById('modifRessourceSelect')
      const ColorRessource : any  = document.getElementById('modifColorRessource')
      nomRessource.setAttribute('value', ressource.titre);
      numeroRessource.setAttribute('value', ressource.numero);
      nbrHeureRessource.setAttribute('value', ressource.nbrheuresemestre);
      ressourceSelect.value = ressource.idsemestre;
      ColorRessource.setAttribute('value', ressource.codecouleur);
      } , 0  );
  }

  addRessource(){
      const nomRessource : any = document.getElementById('inputNomRessource')
      const numeroRessource : any = document.getElementById('inputNumeroRessource')
      const nbrHeureRessource : any  = document.getElementById('inputNbrHeureRessource')
      const ressourceSelect : any  = document.getElementById('ressourceSelect')
      const ColorRessource : any  = document.getElementById('inputColorRessource')
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const body = { Titre: nomRessource.value, Numero: numeroRessource.value, NbrHeureSemestre: this.hoursToSec(nbrHeureRessource.value), IdSemestre: parseInt(ressourceSelect.value), CodeCouleur: ColorRessource.value };
      return this.http.post('http://localhost:5050/ressource/add' ,body ,  {headers} ).subscribe(()=> { this.loadRessources()});
  }

  changerRessource(){
    const nomRessource : any = document.getElementById('modifNomRessource')
    const numeroRessource : any = document.getElementById('modifNumeroRessource')
    const nbrHeureRessource : any  = document.getElementById('modiftNbrHeureRessource')
    const ressourceSelect : any  = document.getElementById('modifRessourceSelect')
    const ColorRessource : any  = document.getElementById('modifColorRessource')
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
      const body = { Titre: nomRessource.value, Numero: numeroRessource.value, NbrHeureSemestre: this.hoursToSec(nbrHeureRessource.value), IdSemestre: ressourceSelect.value, CodeCouleur: ColorRessource.value };
      return this.http.put('http://localhost:5050/ressource/update/'+this.idChangeRessource , body , {headers}).subscribe(()=> { 
        this.loadRessources() });
  } 

  loadSemestre(){
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get('http://localhost:5050/semestre/getAll', { headers }).subscribe((res: any) =>{
      this.semestres = res
    });
  }

  loadRessources() :any {
    this.search.updateRessource();
    
  }

  hoursToSec(hour : number){
    let sec = hour * 3600;
    return sec;
  }

  secToHours(time : any){
    let hours = (time / 3600);
    return hours;
  }
}
