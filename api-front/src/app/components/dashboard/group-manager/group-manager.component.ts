import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { th } from 'date-fns/locale';
import { set } from 'date-fns';

import { SearchService } from '../services/search.service';
import { validateEvents } from 'angular-calendar/modules/common/util/util';
import { Group } from '../models/group.model';
import { Subscription, timeout } from 'rxjs';

@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrl: './group-manager.component.css'
})
export class GroupManagerComponent {
  allGroups: Group[] = []; 
  masterGroup : any;
  SousGroupeActuel : number[] = [] ; 
  ModalCreateGroup : boolean = false;
  showModalModifGroupe : boolean = false;
  idModifGroupe : any = 0;
  showSuprGroup : boolean = false;
  idSuprGroup : any = 0;
  NameSuprGroup : any ;
  temp  : any;

  sub : Subscription[] = [];
  

  delGroup(){
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.delete("http://localhost:5050/groupe/delete/" + this.idSuprGroup, { headers }).subscribe((res: any) => 
    {
      this.loadGroups();
    });


  }

  toggleSuprGroup(id? : any){
    this.showSuprGroup = !this.showSuprGroup;
    if (this.showSuprGroup){
      this.idSuprGroup = id;
      const group = this.allGroups.find((g : any) => g.IdGroupe == id);
      this.NameSuprGroup = group ? group.nom : null;
    }
  }

  constructor( private http: HttpClient , private search : SearchService ) {}

  loadGroups():any {
      console.log("loadGroups")
      this.search.updateGroupe()

      setTimeout(() => {
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
        console.log(this.allGroups)
        this.masterGroup = this.allGroups.filter((group : any) => group.idGroupe_parent == v);
        console.log(this.masterGroup)
      
      } , 1000);
       
        

     
        
    };

    


toggleModalModifGroupe(){
  if(this.showSuprGroup == false){
    this.showModalModifGroupe = !this.showModalModifGroupe;

  }
  
}

ngOnInit(): void {

  this.sub.push(this.search.groupe$.subscribe((data : any) => {
    this.allGroups = data;
  }));

  this.loadGroups();

}

ngOnDestroy() {

  this.sub.forEach((sub : Subscription) => {
    sub.unsubscribe();
  })
}

chargerGroupe(id : any)
{
  this.toggleModalModifGroupe()
  this.idModifGroupe = id;
  setTimeout(() => {
  
  const group : any = this.allGroups.find((g : any) => g.idGroupe == id);
  
  const nomGroup : any = document.getElementById('changerNomGroupe')
  /*  const annee : any = document.getElementById('changerAnneeGroupe')
  const anneeScolaire : any  = document.getElementById('changerAnneeSco')
  
  anneeScolaire.setAttribute('value', group.AnneeScolaire);
  
  annee.setAttribute('value', group.Annee);*/
  nomGroup.setAttribute('value', group.nom);
 } , 0  );



}


changerGroupe(){
  const nomGroup : any = document.getElementById('changerNomGroupe')
  /*
  const annee : any = document.getElementById('changerAnneeGroupe')
  const anneeScolaire : any  = document.getElementById('changerAnneeSco')*/
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };
  const body = { "Nom" : nomGroup.value };

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
  this.loadGroups();
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
  /*const annee = (<HTMLInputElement>document.getElementById("inputAnneeGroupe")).value;
  const anneeScolaire = (<HTMLInputElement>document.getElementById("inputAnneeSco")).value;*/
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };
  const body = { "Nom" : nom,  "idGroupeParent" :-1};
  if (this.SousGroupeActuel.length > 0)
  {
    body["idGroupeParent"] = this.SousGroupeActuel[this.SousGroupeActuel.length - 1];
  }
  this.http.post("http://localhost:5050/groupe/add", body, { headers }).subscribe((res: any) => 
  {
    
    this.loadGroups();
  });  
}
}
