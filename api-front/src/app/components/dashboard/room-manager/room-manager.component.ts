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

  
  toggleModal(){
    this.showModal = !this.showModal;
  }

  constructor( private http: HttpClient ) {}

  ngOnInit(): void {
    //this.initializeForm();
    //this.loadGroupes();
    this.loadSalles().subscribe(
      (data: any) => {
      this.salles = data
      
      }
    );
    
  }

  loadSalles(): any {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get('http://localhost:5050/salle/getAll', { headers })
  }

  getRooms(id : any): any {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get('http://localhost:5050/salle/get/'+id, { headers })
  }


  changeRoom(id : any): void {
    this.getRooms(id).subscribe(
      (data: any) => {
        this.roomsDisplay = data.nom;
      }
    );
  }
  

  
}
