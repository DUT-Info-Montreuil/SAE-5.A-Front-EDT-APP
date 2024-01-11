import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { th } from 'date-fns/locale';
import { set } from 'date-fns';
import { timeout } from 'rxjs';
import { SearchService } from '../services/search.service';
import { validateEvents } from 'angular-calendar/modules/common/util/util';


@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrl: './group-manager.component.css'
})
export class GroupManagerComponent {
  allGroups: any; 
  masterGroup : any;
  SousGroupeActuel : number[] = [] ; 
  ModalCreateGroup : boolean = false;
  showModalModifGroupe : boolean = false;
  idModifGroupe : any = 0;




  constructor( private http: HttpClient ) {}

  loadGroups():any {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.get("http://localhost:5050/groupe/getAll", { headers }).subscribe((res: any) => 
    {
      let v : any = 0 ;
      console.log(this.SousGroupeActuel) 
      if (this.SousGroupeActuel.length <= 0){
        v = null;
        const button = document.getElementById("goBackButton");
        button?.setAttribute("disabled", "")
        button?.style.setProperty("background-color", "#6389f2")
        //button?.style.setProperty("background-color", "#6389f2")
      }
      else{
        v = this.SousGroupeActuel[this.SousGroupeActuel.length - 1]
        const button = document.getElementById("goBackButton");
        button?.removeAttribute("disabled")
        //button?.style.setProperty("background-color", "#4287f5")
      }
      
      this.masterGroup = res.filter((group : any) => group.idGroupe_parent == v);
      this.allGroups = res;
      ;
    });



}

toggleModalModifGroupe(){
  this.showModalModifGroupe = !this.showModalModifGroupe;
}

ngOnInit(): void {
this.loadGroups();



}

chargerGroupe(id : any)
{
  this.toggleModalModifGroupe()
  this.idModifGroupe = id;
  setTimeout(() => {
  
  const group : any = this.allGroups.find((g : any) => g.IdGroupe == id);
  
  const nomGroup : any = document.getElementById('changerNomGroupe')
  const annee : any = document.getElementById('changerAnneeGroupe')
  const anneeScolaire : any  = document.getElementById('changerAnneeSco')
  
  nomGroup.setAttribute('value', group.Nom);
  annee.setAttribute('value', group.Annee);
  anneeScolaire.setAttribute('value', group.AnneeScolaire);
  
  


 } , 0  );



}


changerGroupe(){
  const nomGroup : any = document.getElementById('changerNomGroupe')
  const annee : any = document.getElementById('changerAnneeGroupe')
  const anneeScolaire : any  = document.getElementById('changerAnneeSco')
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };
  const body = { "Nom" : nomGroup.value, "Annee"  : annee.value, "AnneeScolaire" : anneeScolaire.value };

  this.http.put("http://localhost:5050/groupe/update/" + this.idModifGroupe, body, { headers }).subscribe((res: any) => 
  {
    this.loadGroups();
  });

}

goInGroup(id : any){

  
  const button = document.getElementById("goBackButton");
  button?.removeAttribute("disabled")
  button?.style.removeProperty("background-color")
  
  this.SousGroupeActuel.push(id);
  this.masterGroup = this.allGroups.filter((group : any) => group.idGroupe_parent == id);
}

goBackGroupe(){
  this.SousGroupeActuel.pop();
  let v : any = 0 ; 
  
  
  if (this.SousGroupeActuel.length <= 0){
    v = null;
    const button = document.getElementById("goBackButton");
    button?.setAttribute("disabled", "")
    console.log("disabled")
    
    button?.style.setProperty("background-color", "#6389f2")
  }
  else{
    v = this.SousGroupeActuel[this.SousGroupeActuel.length - 1]
  }
  this.masterGroup = this.allGroups.filter((group : any) => group.idGroupe_parent == v);



}

toggleCreateGroupe(){
  this.ModalCreateGroup = !this.ModalCreateGroup;

}

showModalCreateGroup()
{
  this.ModalCreateGroup = true;
}

addGroupe(){
  const nom = (<HTMLInputElement>document.getElementById("inputNomGroupe")).value;
  const annee = (<HTMLInputElement>document.getElementById("inputAnneeGroupe")).value;
  const anneeScolaire = (<HTMLInputElement>document.getElementById("inputAnneeSco")).value;
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };
  const body = { "Nom" : nom, "Annee"  : annee, "AnneeScolaire" : anneeScolaire , "idGroupe_parent" :-1};
  if (this.SousGroupeActuel.length > 0)
  {
    body["idGroupe_parent"] = this.SousGroupeActuel[this.SousGroupeActuel.length - 1];
  }
  this.http.post("http://localhost:5050/groupe/add", body, { headers }).subscribe((res: any) => 
  {
    
    this.loadGroups();
  });




  
}








}
