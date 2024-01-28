import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { th } from 'date-fns/locale';
import { set } from 'date-fns';
import { Subscriber, Subscription, timeout } from 'rxjs';
import { SearchService } from '../services/search.service';
import { validateEvents } from 'angular-calendar/modules/common/util/util';
import { Equipement } from '../models/equipement.model';
@Component({
  selector: 'app-equipement-manager',
  templateUrl: './equipement-manager.component.html',
  styleUrl: './equipement-manager.component.css'
})
export class EquipementManagerComponent {
  allEquipements: Equipement[] = [];
  showModalCreateEquipement : boolean = false;
  showSuprEquipement : boolean = false;
  idSuprEquipement : any;
  NameSuprEquipement : any;

  sub : Subscription[] = [];
  
  constructor( private http: HttpClient , private search : SearchService ) {}


  delEquipement(){
    const token = localStorage.getItem('token');
    const header = { 'Authorization': `Bearer ${token}` };
    this.http.delete('http://localhost:5050/equipement/delete/'+this.idSuprEquipement,{ headers: header }).subscribe((res: any) => {
      this.loadEquipements();
    });

  }

  toogleSuprEquipement(id? : any){
    console.log(id);
    this.showSuprEquipement = !this.showSuprEquipement;
    if (this.showSuprEquipement){
      this.idSuprEquipement = id;
      console.log(this.allEquipements);
      for (let s of this.allEquipements)
        if (s.idEquipement == id)
          
          this.NameSuprEquipement = s.nom;
    }
    
  }

  loadEquipements():any {
    this.search.updateEquipement();
  }

  chargerEquipement(id: any):any {
  }

  toggleCreateEquipement():any {
    this.showModalCreateEquipement = !this.showModalCreateEquipement;
  }

  ngOnInit(): void {

    this.sub.push(
      this.search.equipement$.subscribe((data : Equipement[]) => {
        this.allEquipements = data;
      })
    )
    this.loadEquipements();
  } 

  createEquipement():any {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    const nom = document.getElementById("inputNomEquipement") as HTMLInputElement;
    console.log(nom.value)
    this.http.post("http://localhost:5050/equipement/add", {"data" : [{"Nom" : nom.value}]}, { headers }).subscribe((res: any) => 
    {
      this.loadEquipements();    
    });
  }

}
