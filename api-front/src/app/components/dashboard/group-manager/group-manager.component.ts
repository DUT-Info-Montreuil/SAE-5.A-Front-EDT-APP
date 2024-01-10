import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { th } from 'date-fns/locale';
import { set } from 'date-fns';
import { timeout } from 'rxjs';
import { SearchService } from '../services/search.service';


@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrl: './group-manager.component.css'
})
export class GroupManagerComponent {
  allGroups: any; 
  masterGroup : any;
  SousGroupeActuel : number | null = null ; 
  ModalCreateGroup : boolean = false;




  constructor( private http: HttpClient ) {}

  loadGroups():any {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.get("http://localhost:5050/groupe/getAll", { headers }).subscribe((res: any) => 
    {
      this.masterGroup = res.filter((group : any) => group.idGroupe_parent == null);
      this.allGroups = res;
      console.log(this.masterGroup);
    });



}

ngOnInit(): void {
this.loadGroups();



}

chargerGroupe(id : any)
{



}

toggleCreateGroupe(){

}

showModalCreateGroup()
{
  this.ModalCreateGroup = true;
}

addGroupe(){



  
}








}
