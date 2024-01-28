import { Injectable } from '@angular/core';
import { Salle } from '../models/salle.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Token } from '@angular/compiler';
import { Observable, elementAt, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Ressource } from '../models/ressource.model';
import { Group } from '../models/group.model';
import { Semestre } from '../models/semestre.model';
import { Equipement } from '../models/equipement.model';
import { Utilisateur } from '../models/utilisateur.model';
import { da } from 'date-fns/locale';

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

  private semestre = new BehaviorSubject<Semestre[]>([]);
  semestre$ = this.semestre.asObservable();

  private equipement = new BehaviorSubject<Equipement[]>([]);
  equipement$ = this.equipement.asObservable();

  private utilisateur = new BehaviorSubject<Utilisateur[]>([]);
  utilisateur$ = this.utilisateur.asObservable();


  constructor(private http: HttpClient) {
    this.salle$ = this.salle.asObservable();
    this.ressource$ = this.ressource.asObservable();
    this.groupe$ = this.groupe.asObservable();
    this.semestre$ = this.semestre.asObservable();
    this.equipement$ = this.equipement.asObservable();
    this.utilisateur$ = this.utilisateur.asObservable();
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


      updateGroupe() :any  {
      console.log("load groupes");
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      this.http.get('http://localhost:5050/groupe/getAll', { headers }).subscribe((data : any) => {
        
        const list = data.map((dataPars : any)=> {
          return new Group(
            dataPars.IdGroupe,
            dataPars.Nom,
            dataPars.idGroupe_parent
          );
        });
        console.log(list);
        this.groupe.next(list);
        

      });
      
      

    }

    updateSemestre() {
      console.log("load semestres");
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      this.http.get('http://localhost:5050/semestre/getAll', { headers }).subscribe((data : any) => {
        const list = data.map((dataPars : any)=> {
          return new Semestre(
            dataPars.Numero,
            dataPars.IdSemestre
          );
        });
        this.semestre.next(list);
      });
    }

    updateEquipement() {
      console.log("load equipements");
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      this.http.get('http://localhost:5050/equipement/getAll', { headers }).subscribe((data : any) => {
        const list = data.map((dataPars : any)=> {
          return new Equipement(
            dataPars.Nom,
            dataPars.idEquipement
          );
        });
        this.equipement.next(list);
      });
    }

    updateUtilisateur() {
      console.log("load utilisateurs");
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      this.http.get('http://localhost:5050/utilisateurs/getAll', { headers }).subscribe((data : any) => {
        const list = data.map((dataPars : any)=> {
          return new Utilisateur(
            dataPars.FirstName,
            dataPars.LastName,
            dataPars.Username,
            dataPars.role,
            dataPars.IdUtilisateur
          );
        });
        this.utilisateur.next(list);
      });
    }




    secToHours(time : any){
      let hours = (time / 3600);
      return hours;
    }
}
