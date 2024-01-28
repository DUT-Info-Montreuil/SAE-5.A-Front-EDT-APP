import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { th } from 'date-fns/locale';
import { set } from 'date-fns';
import { timeout } from 'rxjs';
import { SearchService } from '../services/search.service';
import { Semestre } from '../models/semestre.model';



@Component({
  selector: 'app-semestre',
  templateUrl: './semestre.component.html',
  styleUrl: './semestre.component.css'
})
export class SemestreComponent {
  allSemestres: Semestre[] = [] ; 
  showModalCreateSemestre : boolean = false;
  showModalModifSemestre : boolean = false;
  idChangeSemestre : any;
  showSuprSemestre : boolean = false;
  idSuprSemestre : any;
  NameSuprSemestre : any;

  sub : any[] = [];

  constructor( private http: HttpClient, private search : SearchService) {}


  delSemestre(){
    const token = localStorage.getItem('token');
    const header = { 'Authorization': `Bearer ${token}` };
    this.http.delete('http://localhost:5050/semestre/delete/'+this.idSuprSemestre,{ headers: header }).subscribe((res: any) => {
      this.loadSemestre();
    });

  }


  toggleSuprSemestre(id? : any){
    this.showSuprSemestre = !this.showSuprSemestre;
    if (this.showSuprSemestre){
      this.idSuprSemestre = id;
      
      const s : any = this.allSemestres.find((r : any) => r.idSemestre == id);
      
      this.NameSuprSemestre = s.Numero;
    }



  }

  loadSemestre() {
    this.search.updateSemestre();
  }


  toggleCreateSemestre(){
    this.showModalCreateSemestre = !this.showModalCreateSemestre;
  }


  addSemestre(){
    const token = localStorage.getItem('token');
    const header = { 'Authorization': `Bearer ${token}` };
    const num  = document.getElementById('imputNumeroSemestre') as HTMLInputElement;
    this.http.post('http://localhost:5050/semestre/add',{"Numero":num.value},{ headers: header }).subscribe((res: any) => {
      this.loadSemestre();
    });
  }


  chargerRessource(id : any){
    
    this.toggleModalModifSemestre();

    if(this.showSuprSemestre == false){

      this.idChangeSemestre = id;
     setTimeout(() => {
     
      const s : any = this.allSemestres.find((r : any) => r.idSemestre == id);
      
      const numSemestre : any = document.getElementById('modifierNumero')
     
      numSemestre.setAttribute('value', s.nom);
      
      


     } , 0  );
    }
    //time out pour attendre que le modal soit afficher
    
    
  }


  changerRessource(){
    const token = localStorage.getItem('token');
    const header = { 'Authorization': `Bearer ${token}` };
    const num  = document.getElementById('modifierNumero') as HTMLInputElement;
    this.http.put('http://localhost:5050/semestre/update/'+this.idChangeSemestre ,{"Numero":num.value},{ headers: header }).subscribe((res: any) => {
      this.loadSemestre();
    });
  }

  toggleModalModifSemestre(){
    if (this.showSuprSemestre == false){
      this.showModalModifSemestre = !this.showModalModifSemestre;

    }

  }

  ngOnInit(): void {

    this.sub.push(
      this.search.semestre$.subscribe((semestre : Semestre[]) => {
        this.allSemestres = semestre;
        }
      )
    )


    this.loadSemestre();

  }

  ngOnDestroy(): void {
    this.sub.forEach((s) => {
      s.unsubscribe();
    });
  }




  

  

}
