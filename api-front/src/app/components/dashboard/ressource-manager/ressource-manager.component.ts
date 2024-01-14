import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { th } from 'date-fns/locale';
import { set } from 'date-fns';
import { timeout } from 'rxjs';
import { SearchService } from '../services/search.service';


@Component({
  selector: 'app-ressource-manager',
  templateUrl: './ressource-manager.component.html',
  styleUrl: './ressource-manager.component.css'
})
export class RessourceManagerComponent {
  ressources: any ;
  searchRessources : any;
  semestres: any;
  idInetval : any;
  showModalCreateRessource = false;
  showModalModifressource = false;
  idChangeRessource : any;


  toggleCreateRessource(){
    this.showModalCreateRessource = !this.showModalCreateRessource;
    if (this.showModalCreateRessource == true) {
      this.loadSemestre();
    }
  }

  toggleModalModifRessource(){
    this.showModalModifressource = !this.showModalModifressource;
  }

  showModifRessource(){
    this.showModalModifressource = true;

  }


  changeRessource(){
    
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
      const body = { Titre: nomRessource.value, Numero: numeroRessource.value, NbrHeureSemestre: nbrHeureRessource.value, IdSemestre: ressourceSelect.value, CodeCouleur: ColorRessource.value };
      return this.http.post('http://localhost:5050/ressource/add' ,body ,  {headers} ).subscribe(()=> { this.loadRessources().subscribe((data : any) => { this.ressources = data , this.searchRessources = data })});
    
    


  }

  changerRessource(){
    
    const nomRessource : any = document.getElementById('modifNomRessource')
    const numeroRessource : any = document.getElementById('modifNumeroRessource')
    const nbrHeureRessource : any  = document.getElementById('modiftNbrHeureRessource')
    const ressourceSelect : any  = document.getElementById('modifRessourceSelect')
    const ColorRessource : any  = document.getElementById('modifColorRessource')
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
      const body = { Titre: nomRessource.value, Numero: numeroRessource.value, NbrHeureSemestre: nbrHeureRessource.value, IdSemestre: ressourceSelect.value, CodeCouleur: ColorRessource.value };
      return this.http.put('http://localhost:5050/ressource/update/'+this.idChangeRessource , body , {headers}).subscribe(()=> { 
        this.loadRessources() });




  } 

  

  loadSemestre(){
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get('http://localhost:5050/semestre/getAll', { headers }).subscribe((res: any) =>{this.semestres = res});

  }

  loadRessources() :any {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get('http://localhost:5050/ressource/getAll', { headers }).subscribe((res: any) =>{this.ressources = res , this.searchRessources = res});



  }


  constructor( private http: HttpClient ) {}

  ngOnInit(): void {
    //this.initializeForm();
    //this.loadGroupes();
    //charger les salles au chargeement de la page
    this.loadRessources();

    
    this.loadSemestre()
  
      
      //cree un interval pour recharger les salles toutes les 2 minutes
    this.idInetval = setInterval(() => {
      this.loadRessources().subscribe(
        (data: any) => {
        this.ressources = data
        this.searchRessources = data;
        
        }
      
      );
      this.loadSemestre();

      

    }, 1000*60*2);

    const search : any = document.getElementById('ressource-search');
    console.log(search);
    search.addEventListener("keyup", (e :any ) => {
      const searchString : string = e.target.value.toLowerCase();
      
      
      if (searchString != "" ) {
        this.searchRessources  = this.ressources.filter((e : any) => {return e.titre.toLowerCase().startsWith(searchString.toLowerCase())});
      }else {
        this.searchRessources =  this.ressources;
      }
      

    });

  }


  ngOnDestroy() {
    if (this.idInetval) {
      clearInterval(this.idInetval);
    }
  }

  

  
  

}
