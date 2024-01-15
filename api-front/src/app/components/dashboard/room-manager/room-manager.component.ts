import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { th } from 'date-fns/locale';




@Component({
  selector: 'app-room-manager',
  templateUrl: './room-manager.component.html',
  styleUrl: './room-manager.component.css'
})
export class RoomManagerComponent implements OnInit, AfterViewInit{
  salles: any ;
  roomsDisplay:string = "";
  showModal = false;
  idInetval : any;
  showModalModifSalle = false;
  idItervalsearchSalle : any;
  searchRoom : any;
  idSalle : any;
  showModalSuprSalle = false;
  idSuprSalle : any;
  NameSuprSalle : any;
  @ViewChild('inputNomChangeRoom', { static: true }) inputNomChangeRoom! : ElementRef;
  
  delRoom(){
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.delete('http://localhost:5050/salle/delete/'+this.idSuprSalle, { headers }).subscribe(() => { this.loadSalles().subscribe((data : any) => {this.searchRoom =  data ; this.salles = data; });});


  }


  toggleSuprSalle(id? : any){

    this.showModalSuprSalle = !this.showModalSuprSalle;
    if (this.showModalSuprSalle) {
      this.idSuprSalle = id;
      this.NameSuprSalle = this.salles.filter((salle: any) => {return salle.idSalle == this.idSuprSalle})[0].Numero;

    }
  }


  toggleModal(){
    this.showModal = !this.showModal;
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
  

  constructor( private http: HttpClient ) {}


  ngAfterViewInit() {
  
  }


  ngOnInit(): void {
    //this.initializeForm();
    //this.loadGroupes();
    //charger les salles au chargeement de la page
    this.loadSalles().subscribe((data : any) => {this.searchRoom =  data ; this.salles = data; });
    
  
      
      //cree un interval pour recharger les salles toutes les 2 minutes
    this.idInetval = setInterval(() => {
      this.loadSalles().subscribe((data : any) => {this.searchRoom =  data ; this.salles = data; });
        
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
    return this.http.get('http://localhost:5050/salle/getAll', { headers });
    
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
    this.idSalle = data.idSalle;
    //wait 0.1 seconde
    setTimeout(() => {  if (document.getElementById('inputNomChangeRoom') != null && document.getElementById('inputCapChangeRoom') != null) {
      
      var nomElement = document.getElementById('inputNomChangeRoom');
      var capElement = document.getElementById('inputCapChangeRoom');
      
      if (nomElement != null) {
          nomElement.setAttribute("value", data != null ? data.Numero : '');
      }
  
      if (capElement != null) {
          capElement.setAttribute("value", data != null ? data.Capacite : '');
      }
 }}, 0);
    
      
  
  }
       
        
    
    
    
  

  ChangeRoom(): any {  
    const token = localStorage.getItem('token');
    const Numero : any = document.getElementById('inputNomChangeRoom');
    const cap : any = document.getElementById('inputCapChangeRoom');
    console.log("le numero est : "+Numero.value);
    console.log("la capacite est : "+cap.value);
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put('http://localhost:5050/salle/update', { "Numero": Numero.value , "Capacite": cap.value , "idSalle": this.idSalle  }, { headers }).subscribe(() => {  this.loadSalles().subscribe((data : any) => {this.searchRoom =  data ; this.salles = data; })});
 
  }


  //ajouter une salle
  addRoom(): void {
    console.log("add room");
    
    const token = localStorage.getItem('token');
    const Numero : any = document.getElementById('inputNom');
    const cap : any = document.getElementById('inputCap');
    console.log("le numero est : "+Numero.value);
    console.log("la capacite est : "+cap.value);
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.post('http://localhost:5050/salle/add', { "Numero": Numero.value , "Capacite": cap.value }, { headers }).subscribe(() => { console.log("sub") ; this.loadSalles().subscribe((data : any) => {this.searchRoom =  data ; this.salles = data; });});
  }
  

  
}
