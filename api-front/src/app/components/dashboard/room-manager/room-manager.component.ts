import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { th } from 'date-fns/locale';




@Component({
  selector: 'app-room-manager',
  templateUrl: './room-manager.component.html',
  styleUrl: './room-manager.component.css'
})
export class RoomManagerComponent {
  salles: any ;
  roomsDisplay:string = "";
  showModal = false;
  idInetval : any;
  showModalModifSalle = false;
  idItervalsearchSalle : any;
  searchRoom : any;
  
  toggleModal(){
    this.showModal = !this.showModal;
  }
 
  toggleModalModifSalle(){
    this.showModalModifSalle = !this.showModalModifSalle;
    if (this.showModalModifSalle) {
      this.chargeRoom(1);
    }
  }
  

  constructor( private http: HttpClient ) {}

  ngOnInit(): void {
    //this.initializeForm();
    //this.loadGroupes();
    //charger les salles au chargeement de la page
    this.loadSalles().subscribe(
      (data: any) => {
      this.salles = data
      this.searchRoom = this.salles;
      }
    );
      
      //cree un interval pour recharger les salles toutes les 2 minutes
    this.idInetval = setInterval(() => {
      this.loadSalles().subscribe(
        (data: any) => {
        this.salles = data
        
        }
      );
        
    }, 1000*60*2);
    const search : any = document.getElementById('room-search');
    search.addEventListener('keyup', (e: any) => {
      if(search.value != "") {
        const searchString = e.target.value.toLowerCase();
        
  
      this.searchRoom = this.salles.filter((salle: any) => {return salle.Numero.toLowerCase().startsWith(searchString)});
      
    }else {
      this.searchRoom = this.salles;
    }
   

    })

  }


  //arrete l'interval
  ngOnDestroy() {
    if (this.idInetval) {
      clearInterval(this.idInetval);
    }
  }

  loadSalles(): any {
    console.log("load salles");
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get('http://localhost:5050/salle/getAll', { headers })
  }

  getRooms(id : any): any {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get('http://localhost:5050/salle/get/'+id, { headers })
  }


  chargeRoom(id : any): void {
    this.getRooms(id).subscribe(
      (data: any) => {
        if (document.getElementById('inputNomChangeRoom') != null && document.getElementById('inputCapChangeRoom') != null) {
          var nomElement = document.getElementById('inputNomChangeRoom');
          var capElement = document.getElementById('inputCapChangeRoom');
       
          if (nomElement != null) {
              nomElement.setAttribute("value", data != null ? data.Numero : '');
          }
       
          if (capElement != null) {
              capElement.setAttribute("value", data != null ? data.Capacite : '');
          }
       }
        
      }
    
    );
  }

  ChangeRoom(): any {  
    const token = localStorage.getItem('token');
    const Numero : any = document.getElementById('inputNomChangeRoom');
    const cap : any = document.getElementById('inputCapChangeRoom');
    console.log("le numero est : "+Numero.value);
    console.log("la capacite est : "+cap.value);
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put('http://localhost:5050/salle/update', { "Numero": Numero.value , "Capacite": cap.value }, { headers }).subscribe(this.loadSalles());
 
  }


  //ajouter une salle
  addRoom(): any {
    console.log("add room");
    
    const token = localStorage.getItem('token');
    const Numero : any = document.getElementById('inputNom');
    const cap : any = document.getElementById('inputCap');
    console.log("le numero est : "+Numero.value);
    console.log("la capacite est : "+cap.value);
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.post('http://localhost:5050/salle/add', { "Numero": Numero.value , "Capacite": cap.value }, { headers }).subscribe(this.loadSalles());
  }
  

  
}
