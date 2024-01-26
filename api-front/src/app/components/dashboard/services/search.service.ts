import { Injectable } from '@angular/core';
import { Salle } from '../models/salle.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Token } from '@angular/compiler';
import { elementAt, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Ressource } from '../models/ressource.model';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private salle = new BehaviorSubject<Salle[]>([]);
  salle$ = this.salle.asObservable();

  private ressource = new BehaviorSubject<Ressource[]>([]);
  ressource$ = this.ressource.asObservable();

  private groupe = new BehaviorSubject<Group[]>([]);
  groupe$ = this.groupe.asObservable();

  constructor(private http: HttpClient) {
    this.salle$ = this.salle.asObservable();
    this.ressource$ = this.ressource.asObservable();
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
            dataPars.idressource,
            dataPars.titre,
            dataPars.numero,
            this.secToHours(dataPars.nbrheuresemestre),
            dataPars.codecouleur,
            dataPars.idsemestre
          );
        });
        
        this.ressource.next(list);
      });
    }


    updateGroupe() {
      console.log("load groupes");
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      this.http.get('http://localhost:5050/groupe/getAll', { headers }).subscribe((data : any) => {
        const list = data.map((dataPars : any)=> {
          return new Group(
            dataPars.idGroupe,
            dataPars.Nom,
            dataPars.idGroupe_parent
          );
        });
        this.groupe.next(list);
      });



    }


    secToHours(time : any){
      let hours = (time / 3600);
      return hours;
    }
}
