import { Injectable } from '@angular/core';
import { Salle } from '../models/salle.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Token } from '@angular/compiler';
import { elementAt, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Ressource } from '../models/ressource.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  

 


  private salle = new BehaviorSubject<Salle[]>([]);
  salle$ = this.salle.asObservable();

  private ressource = new BehaviorSubject<Ressource[]>([]);
  ressource$ = this.ressource.asObservable();

  constructor(private http: HttpClient) {
    this.salle$ = this.salle.asObservable();
  }


  updateSalle() {
      console.log("load salles");
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      this.http.get('http://localhost:5050/salle/getAll', { headers }).subscribe((data : any) => {
        const list = data.map((dataPars : any)=> {
          return new Salle(
            dataPars.idSalle,
            dataPars.Nom,
            dataPars.Capacite
          );
        });
        this.salle.next(list);
      });
    }

    updateRessource() {
      console.log("load ressources");
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      this.http.get('http://localhost:5050/ressource/getAll', { headers }).subscribe((data : any) => {
        const list = data.map((dataPars : any)=> {
          return new Ressource(
            dataPars.idRessource,
            dataPars.Nom,
            dataPars.Numero,
            this.secToHours(dataPars.nbrHeure)
          );
        });
        this.ressource.next(list);
      });
    }


    secToHours(time : any){
      let hours = (time / 3600);
      return hours;
    }
}
