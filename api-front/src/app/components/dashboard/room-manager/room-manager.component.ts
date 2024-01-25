import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { da, th } from 'date-fns/locale';
import { Subscriber, Subscription, timeout } from 'rxjs';
import { SearchService } from '../services/search.service';
import { Salle } from '../models/salle.model';




@Component({
  selector: 'app-room-manager',
  templateUrl: './room-manager.component.html',
  styleUrl: './room-manager.component.css'
})
export class RoomManagerComponent implements OnInit{
  salles: Salle[] = []; 
  allEquipement: any;
  roomsDisplay:string = "";
  showModal = false;
  idInetval : any;
  showModalModifSalle = false;
  idItervalsearchSalle : any;
  searchRoom : any;
  idModifSalle : any;
  showModalSuprSalle = false;
  idSuprSalle : any;
  NameSuprSalle : any;
  showDropDown = false;
  showDropDownModifEquip = false;
  @ViewChild('inputNomChangeRoom', { static: true }) inputNomChangeRoom! : ElementRef;
  sub : Subscription[] = [];

  constructor( private http: HttpClient , private search : SearchService ) {}

  ngOnInit(): void {
    //this.initializeForm();
    //this.loadGroupes();
    //charger les salles au chargeement de la page
    this.sub.push(
      this.search.salle$.subscribe((data : Salle[]) => {
        this.salles = data;
        this.searchRoom = data  ;  
      })
    )
    this.loadSalles();
    for (let i = 0; i < this.salles.length; i++) {
        this.getEquipementRoom(this.salles[i].idSalle).subscribe((data2 : any) => {this.salles[i].equipements = data2})
    };
      for (let i = 0; i < this.salles.length; i++) {
        console.log(this.salles[i]);
        
      }
      //cree un interval pour recharger les salles toutes les 2 minutes
    this.idInetval = setInterval(() => {
      this.loadSalles();
        for (let i = 0; i < this.salles.length; i++) {
          this.getEquipementRoom(this.salles[i].idSalle).subscribe((data2 : any) => {this.salles[i].equipements = data2})   
        };
    }, 1000*60*2);

    const search : any = document.getElementById('room-search');
    search.addEventListener('keyup', (e: any) => {
      if(search.value != "") {
        const searchString = e.target.value.toLowerCase();
      this.searchRoom = this.salles.filter((salle: any) => {return salle.Nom.toLowerCase().startsWith(searchString)});
    }else {
      this.searchRoom = this.salles;
      }
    })
  }

  ngOnDestroy() {
    if (this.idInetval) {
      clearInterval(this.idInetval);
    }

    this.sub.forEach((sub : Subscription) => {
      sub.unsubscribe();
    })
  }
  
  checkBoxes : HTMLInputElement[] = [];
  
/***ROOM */
  loadSalles(): any {
    this.search.updateSalle();
    
  }

  delRoom(){
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.delete('http://localhost:5050/salle/delete/'+this.idSuprSalle, { headers }).subscribe(() => { this.loadSalles()});
  }

  ChangeRoom(): any {  
    const token = localStorage.getItem('token');
    const Numero : any = document.getElementById('inputNomChangeRoom');
    const cap : any = document.getElementById('inputCapChangeRoom');
    console.log("le numero est : "+Numero.value);
    console.log("la capacite est : "+cap.value);
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put('http://localhost:5050/salle/update', { "Nom": Numero.value , "Capacite": cap.value , "idSalle": this.idModifSalle  }, { headers }).subscribe(() => {  this.loadSalles().subscribe((data : any) => {this.searchRoom =  data ; this.salles = data; })});
 
  }

  //ajouter une salle
  addRoom(): void {
    let check : any[] = [];
    console.log(this.checkBoxes);
    for (let i = 0; i < this.checkBoxes.length; i++) {
      console.log(this.checkBoxes[i].checked);
      if (this.checkBoxes[i].checked) {
        check.push(this.checkBoxes[i].id);
      }
    }
    console.log(check);
    
    const token = localStorage.getItem('token');
    const Numero : any = document.getElementById('inputNom');
    const cap : any = document.getElementById('inputCap');

    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.post('http://localhost:5050/salle/add', { "Nom": Numero.value , "Capacite": cap.value }, { headers }).subscribe((salle : any) => { 
      this.loadSalles().subscribe((data : any) => {
        for (let i = 0; i < data.length; i++) {
          console.log(data[i].idSalle);
          this.getEquipementRoom(data[i].idSalle).subscribe((data2 : any) => {data[i].equipement = data2})
        };
        this.salles = data;
        this.searchRoom = data  ; 
      });
      console.log(check);
      this.addEquipementToRoom(check , salle.idSalle);
    });
  }

  getRooms(id : any): any {2
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get('http://localhost:5050/salle/get/'+id, { headers })
  }

  chargeRoom(id : any): void {
    //filtre les salles pour avoir celle qui a l'id
    console.log("charge room");
    const data  = this.salles.filter((salle: any) => {return salle.idSalle == id})[0];
    console.log(data);
    this.idModifSalle = data.idSalle;
    //wait 0.1 seconde
    setTimeout(() => {  
      if (document.getElementById('inputNomChangeRoom') != null && document.getElementById('inputCapChangeRoom') != null) {
      
        var nomElement = document.getElementById('inputNomChangeRoom');
        var capElement = document.getElementById('inputCapChangeRoom');
        
        if (nomElement != null) {
          nomElement.setAttribute("value", data != null ? data.nom : '');
        }

        if (capElement != null) {
          capElement.setAttribute("value", data != null ? String(data.capacite) : '');
        }
      }
    }, 0);
  }
/***ROOM */

/**Equipement */

loadEquipement(): any {
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };
  return this.http.get('http://localhost:5050/equipement/getAll', { headers }).subscribe((data : any) => {this.allEquipement = data});
}

getEquipementRoom(id : any): any {
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };
  return this.http.get('http://localhost:5050/salle/get/equipement/'+id, { headers });
}

/**Equipement */


/**modale */

toggleDropDown(){
  this.showDropDown = !this.showDropDown;
  if (this.showDropDown) {
    setTimeout(() => {
    this.checkBoxes = document.querySelectorAll('.getInfo') as HTMLInputElement[] | any;
    ;} , 0 )
  }
}


toggleDropDownModifEquip(){
  this.showDropDownModifEquip = !this.showDropDownModifEquip;
  if (this.showDropDownModifEquip) {
    this.loadEquipement();
    setTimeout(() => {
      this.checkBoxes = document.querySelectorAll('.setInfo') as HTMLInputElement[] | any;
      this.getEquipementRoom(this.idModifSalle).subscribe((data : any) => {
        for (let i = 0; i < this.checkBoxes.length; i++) {
          for (let j = 0; j < this.allEquipement.length; j++) {
            if (this.checkBoxes[i].id == data[j].idEquipement) {
                  this.checkBoxes[i].checked = true;
                  console.log("fucking true")
            }
          }
        }
    });
    ;} , 0 )  
  }
}

toggleSuprSalle(id? : any){

  this.showModalSuprSalle = !this.showModalSuprSalle;
  if (this.showModalSuprSalle) {
    this.idSuprSalle = id;
    this.NameSuprSalle = this.salles.filter((salle: any) => {return salle.idSalle == this.idSuprSalle})[0].nom;
  }
}


toggleModal(){
  this.showModal = !this.showModal;
  if(this.showModal == true){
    this.loadEquipement();
  }
}


toggleModalModifSalle(id : any){
  if(this.showModalSuprSalle != true){
  this.showModalModifSalle = !this.showModalModifSalle;
  if (this.showModalModifSalle) {
    this.chargeRoom(id);
    }
  }
}

closeModalModifSalle() {
  this.showModalModifSalle = false;
}

/**modale*/
  addEquipementToRoom(idList : any[], idSalle : any): void {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.post('http://localhost:5050/salle/add/equipement/'+idSalle, { "idEquipement": idList }, { headers }).subscribe();
  }

}
