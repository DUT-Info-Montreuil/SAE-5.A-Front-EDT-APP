import { th } from "date-fns/locale";

export class Ressource {

    idRessource!: number;
    nom!: string;
    numero!: string;
    nbrHeure!: number;

    constructor(idRessource : number , nom: string, numero: string , nbrHeure : number) {
        this.idRessource = idRessource;
        this.nom = nom;
        this.numero = numero;
        this.nbrHeure = nbrHeure;
    }
}
